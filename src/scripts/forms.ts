/**
 * Enquiry and contact forms.
 * Validates in the browser, then posts JSON to the school's form relay
 * (formsubmit.co, the service the current site already uses). Success is only
 * shown when the relay confirms delivery; anything else shows a clear error with
 * direct phone and email alternatives.
 */
type Rule = (v: string, el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => string | null;

const rules: Record<string, Rule> = {
  required: (v, el) => {
    if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox')) {
      const group = el.form?.querySelectorAll<HTMLInputElement>(`input[name="${el.name}"]`);
      return group && Array.from(group).some((r) => r.checked) ? null : el.dataset.msg || 'Please choose an option.';
    }
    return v.trim() ? null : el.dataset.msg || 'This field is required.';
  },
  email: (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Enter a valid email address, like name@example.com.'),
  phone: (v) => {
    if (!v) return null;
    const digits = v.replace(/[\s()+-]/g, '');
    return /^\d{10,14}$/.test(digits) ? null : 'Enter a valid phone number, like 0812 345 6789.';
  },
  min: (v, el) => {
    const n = Number(el.dataset.min || 0);
    return !v || v.trim().length >= n ? null : `Please write at least ${n} characters.`;
  },
};

function validateField(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  const field = el.closest<HTMLElement>('.field');
  if (!field) return true;
  const checks = (el.dataset.validate || '').split(' ').filter(Boolean);
  if (el.required) checks.unshift('required');
  let message: string | null = null;
  for (const c of checks) {
    message = rules[c]?.(el.value, el) ?? null;
    if (message) break;
  }
  const errEl = field.querySelector<HTMLElement>('.field-error');
  field.classList.toggle('is-invalid', !!message);
  if (errEl) errEl.textContent = message ?? '';
  const targets = el.type === 'radio' ? field.querySelectorAll('input') : [el];
  targets.forEach((t) => t.setAttribute('aria-invalid', message ? 'true' : 'false'));
  return !message;
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    const fields = () => Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type=hidden]), select, textarea'))
      .filter((el) => !el.closest('.hp'));
    const status = form.querySelector<HTMLElement>('[data-status]');
    const submit = form.querySelector<HTMLButtonElement>('button[type=submit]');
    const endpoint = form.dataset.endpoint || form.action;

    // Validate on blur, then live once a field has been flagged.
    fields().forEach((el) => {
      el.addEventListener('blur', () => { if (el.value || el.closest('.field')?.classList.contains('is-invalid')) validateField(el); });
      el.addEventListener('input', () => { if (el.closest('.field')?.classList.contains('is-invalid')) validateField(el); });
      el.addEventListener('change', () => { if (el.closest('.field')?.classList.contains('is-invalid')) validateField(el); });
    });

    const showStatus = (kind: 'error' | 'success', html: string) => {
      if (!status) return;
      status.className = `form-status form-status--${kind} is-shown`;
      status.innerHTML = html;
      status.focus({ preventScroll: false });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status?.classList.remove('is-shown');

      const seen = new Set<string>();
      let firstInvalid: HTMLElement | null = null;
      for (const el of fields()) {
        if (el.type === 'radio') { if (seen.has(el.name)) continue; seen.add(el.name); }
        if (!validateField(el) && !firstInvalid) firstInvalid = el;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        showStatus('error', 'Please check the highlighted fields and try again.');
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return; // bot

      if (!navigator.onLine) {
        showStatus('error', 'You appear to be offline. Please reconnect and try again, or call the school directly.');
        return;
      }

      submit?.setAttribute('aria-busy', 'true');
      submit?.setAttribute('disabled', '');
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal,
        });
        const json = await res.json().catch(() => ({}));
        const ok = res.ok && (json.success === true || json.success === 'true');
        if (!ok) throw new Error(json.message || `Request failed (${res.status})`);

        form.reset();
        fields().forEach((el) => el.closest('.field')?.classList.remove('is-invalid'));
        const name = String(data.parent_name || data.name || '').split(' ')[0];
        showStatus('success', `<strong>Thank you${name ? `, ${escapeHtml(name)}` : ''}.</strong> Your message has been sent to Gulf Flower Schools, and the school can now reply to you by phone or email.`);
      } catch (err) {
        const fallback = form.dataset.fallback || '';
        showStatus('error', `<strong>Your message could not be sent.</strong> Please try again in a moment${fallback ? `, or reach the school directly: ${fallback}` : '.'}`);
        console.warn('[form] submission failed:', err);
      } finally {
        window.clearTimeout(timeout);
        submit?.removeAttribute('aria-busy');
        submit?.removeAttribute('disabled');
      }
    });
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}
