# Oregon Civic Contact

A privacy-friendly React + TypeScript + Vite starter for finding Oregon congressional contact channels, composing editable constituent messages, and browsing external petitions.

## Run

```bash
npm install
npm run dev
```

Build for static hosting:

```bash
npm run build
```

Deploy the generated `dist/` directory to Cloudflare Pages, Netlify, or GitHub Pages. Vite uses a relative asset base for project-site hosting.

## Structure

- `src/data/officials.ts` — Oregon delegation and official contact channels.
- `src/data/petitions.ts` — curated petition links.
- `src/lib/messages.ts` — editable starting templates, generated for the selected chamber.
- `src/types/index.ts` — typed models for later multi-state expansion.
- `src/App.tsx` — composer, directory, and petition browser.
- `src/styles.css` — responsive styling.

## Before public launch

1. Check the current officeholders and exact contact-form endpoints against official House and Senate websites. Links marked `review` are not individually verified for this release.
2. Check each petition link, organizer, current wording, and signature count. No signature counts are displayed by default.
3. Add district lookup if needed. ZIP codes alone do not uniquely identify congressional districts; use an authoritative address lookup rather than guessing.
4. Add an accessibility review, browser testing, and optional automated link checks.
5. Never claim messages or signatures were submitted by this site. Users must submit through the linked external services.

No analytics, accounts, backend, automatic submissions, or local-storage persistence are included.
