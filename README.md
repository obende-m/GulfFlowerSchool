# Gulf Flower Schools — website

Static, multi-page website for Gulf Flower Schools (Oworonshoki, Lagos), built with [Astro](https://astro.build).
All school information comes from a research extraction of the existing gulfflowerschool.com (kept outside this repository).

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/ — upload dist/ to any static host
npm run preview   # serve the built site
node qa/qa.mjs    # browser QA (needs a build and Chrome installed); add --shots for screenshots
```

## Structure

| Path | What it is |
|---|---|
| `src/data/site.ts` | **School facts in one place**: contacts, campuses, portals, nav, form endpoint, WhatsApp, social URLs |
| `src/data/content.ts` | Stages, subjects, grading, facilities, leaders' messages, FAQs |
| `src/data/photos.ts` | Every photograph with its alt text |
| `src/styles/global.css` | Design tokens (colour, type, spacing), buttons, forms, motion states |
| `src/components/` | Header, footer, page hero, photo frames, forms, tabs, age guide; `home/` holds the homepage sections |
| `src/pages/` | One file per page (home, about, leadership, schools ×3, campus life, admissions, gallery, contact, portals, 404) |
| `src/scripts/` | Menu/header, GSAP animation layer, forms, gallery, tabs |
| `qa/` | Browser QA harness and helpers |

## Still to connect or confirm (nothing below was invented)

1. **Forms** post to `formsubmit.co` → `gulfflowersignatures@gmail.com`, the relay the current site already uses.
   The first real submission triggers a one-time activation email; the school must click it before messages arrive.
   To use another backend, change `forms.endpoint` in `src/data/site.ts` (it must accept JSON and return `{ "success": true }`).
2. **WhatsApp**: no number is published. Set `whatsapp` in `src/data/site.ts` to show WhatsApp buttons.
3. **Social media**: only the handle `@gulfflowerschool` is published. Add confirmed URLs to `social` to turn them into links.
4. **Logo**: only a 50×50 favicon exists. Replace `public/crest.png` (and `src/assets/brand/crest.png`) with vector artwork.
5. **Third phone number**: 08127261707 (current site) vs 08127261207 (legacy page). The site uses …1707.
6. **Admission notice** ("Admission is open for registration") is shown as on the current site; update `site.admissionNotice` each session.
7. **Fees, term dates, application documents, school hours, privacy/safeguarding policies, news/events, testimonials**: not published by the school, so not on the site.
8. **Photo consent** for the pupils shown should be confirmed by the school.
