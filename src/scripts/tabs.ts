/** Accessible tabs: [data-tabs] > [role=tablist] > [role=tab][aria-controls]; panels [role=tabpanel]. */
export function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((wrap) => {
    const tabs = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[role=tab]'));
    const indicator = wrap.querySelector<HTMLElement>('[data-tab-indicator]');

    const moveIndicator = (tab: HTMLElement) => {
      if (!indicator) return;
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    const select = (tab: HTMLButtonElement, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls') || '');
        if (panel) {
          panel.hidden = !on;
          if (on) { panel.classList.remove('tab-in'); void panel.offsetWidth; panel.classList.add('tab-in'); }
        }
      });
      moveIndicator(tab);
      if (focus) tab.focus();
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        let next = -1;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next > -1) { e.preventDefault(); select(tabs[next], true); }
      });
    });
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0];
    if (current) requestAnimationFrame(() => moveIndicator(current));
    new ResizeObserver(() => {
      const sel = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      if (sel) moveIndicator(sel);
    }).observe(wrap);
  });
}
