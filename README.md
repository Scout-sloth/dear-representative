# Dear Representative

A privacy-conscious React + TypeScript + Vite civic contact tool, initially populated with Oregon's congressional delegation and a congressional leadership campaign.

## Run

```bash
npm install
npm run dev
```

Use Node.js 24 LTS. For a reproducible install from the lockfile, use `npm ci`.

Development checks:

```bash
npm test
npm run typecheck
npm run build
```

Tests use Vitest, jsdom, and React Testing Library as development-only dependencies. They cover exact original wording for all six templates, placeholder rendering, optional sender fields, chamber selection, editing, copying, reset, petition filtering, and data consistency. `npm run preview` serves the production build locally.

Build for static hosting:

```bash
npm run build
```

Deploy the generated `dist/` directory to Cloudflare Pages, Netlify, or GitHub Pages. Vite uses a relative asset base for project-site hosting.

## Structure

- `src/campaigns/congressional-leadership/` — campaign details, subject, signature, curated petition links, and six independent template files under `templates/{house,senate}/{short,standard,detailed}.ts`.
- `src/campaigns/index.ts` — campaign registry; currently contains one campaign.
- `src/data/states/oregon.ts` — separate Oregon state metadata and legislator records, including explicit salutations and typed contact methods.
- `src/data/states/index.ts` — state and legislator registries; only Oregon is populated.
- `src/lib/messages.ts` — pure, reusable placeholder rendering and complete-message composition, with no campaign wording embedded in the renderer.
- `src/types/index.ts` — separate state, legislator, contact method, campaign, message template, sender, and petition types.
- `src/components/` — message composer, delegation directory, and petition directory.
- `src/App.tsx` — connects the current campaign and state to these components.
- `src/styles.css` — responsive styling.

### Editing a campaign

Edit the appropriate chamber/length template file to change a starting message. Campaign-specific values such as leader, office, and Congress belong in `details.ts`; subject and signature text belong in the campaign's `index.ts`. Petitions remain independent external links in `petitions.ts`.

Templates use `{{salutation}}`, `{{officialName}}`, `{{stateName}}`, `{{senderName}}`, `{{senderCity}}`, and keys from campaign details (currently `{{leader}}`, `{{office}}`, `{{congress}}`). Unknown placeholders throw an error so content mistakes are caught by tests. Values are substituted once as literal text. The body renderer uses sender fallbacks; the signature is composed separately using the optional sender inputs so those inputs never overwrite body edits.

Changing the official or template restores the selected starting body. **Reset to Original Template** does the same without changing either selection. All three actions retain name and city and clear copy confirmation. Copying includes the subject, edited body, and signature; blank sender fields retain the original `[Your name]` and `[City]` placeholders.

Future campaigns can supply the same six-template structure and their own details and petitions. Future states can supply independent state and legislator data. The UI currently selects Oregon and the congressional leadership campaign; state/campaign selectors and district lookup are not implemented. Contact methods distinguish web forms, websites, email addresses, and phone numbers, with optional source/verification metadata. Existing links remain marked `review`; no contact verification is implied by this refactor.

### Privacy

Message generation and editing occur entirely in the browser. Names, cities, and drafts exist only in component memory; they are not transmitted, logged, or persisted. Copying writes the complete message to the visitor's clipboard only when requested. There is no localStorage/sessionStorage draft persistence, analytics, cookies, tracking, backend, automatic submission, or third-party fetching. External sites and hosting infrastructure have their own privacy practices; this site does not promise complete anonymity.

`.gitignore` excludes dependencies, production output, TypeScript build metadata, and `.env`/`.env.*` files, except an intentionally shareable `.env.example` (which must never contain secrets).

## Before public launch

1. Check the current officeholders and exact contact-form endpoints against official House and Senate websites. Links marked `review` are not individually verified for this release.
2. Check each petition link, organizer, current wording, and signature count. No signature counts are displayed by default.
3. Add district lookup if needed. ZIP codes alone do not uniquely identify congressional districts; use an authoritative address lookup rather than guessing.
4. Add an accessibility review, browser testing, and optional automated link checks.
5. Never claim messages or signatures were submitted by this site. Users must submit through the linked external services.

No analytics, accounts, backend, automatic submissions, or local-storage persistence are included.

## License

This project is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for details.
