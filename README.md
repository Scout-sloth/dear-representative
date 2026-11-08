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

Future campaigns can supply the same six-template structure and their own details and petitions. Future states can supply independent state and legislator data. The UI currently selects Oregon and the congressional leadership campaign; state/campaign selectors and district lookup are not implemented. Contact methods distinguish web forms, websites, email addresses, and phone numbers, with independent verification metadata and method IDs.

### Maintaining contact data

Edit `src/data/states/oregon.ts`. Keep state metadata separate from legislators; each legislator has an explicit state, chamber, and optional House district. The reusable `ContactActions` component is shared by the composer and directory. `src/lib/contacts.ts` formats canonical U.S. numbers and selects relevant restriction notices. No runtime contact lookup or fetching is performed.

1. Confirm serving officeholders and districts against the [House directory](https://www.house.gov/representatives) or [Senate Oregon directory](https://www.senate.gov/states/OR/intro.htm). Do not replace members with election winners before their terms begin.
2. Follow each official website's constituent correspondence link. Record that exact entry URL, even if it begins with address verification. Do not label a general homepage as a form. Record a Washington, D.C. phone number separately from district numbers and fax numbers, in canonical `+1` format.
3. Record `identityVerification` and each contact's `status`, `sourceUrls`, and `lastVerified` separately. A verified record requires official supporting URLs and the actual review date (`YYYY-MM-DD`). Unknown/unverified records use `lastVerified: null`. The verified date describes the published information, not a guarantee of availability or response. Include direct email only when explicitly published for general constituent correspondence; do not substitute press, scheduling, academy, or staff addresses.
4. Keep form `functionality` independent of official-URL verification. `not-tested` means no independent interaction test was performed; `could-not-test` explains a specific inspection barrier. `tested` requires a date, explicit scope and notes describing what was actually tested. Reading fields or seeing an official link is not a successful submission test. Never send test messages or enter fabricated constituent data. A tool access error does not invalidate an officially published form link.
5. Maintain `contactRestrictions` using method IDs in `appliesTo`. `type` describes the subject; `effect` distinguishes a response policy, required information, a verification step, and a documented submission block. Each verified restriction requires an official `sourceUrl` and `lastVerified`. Unverified claims and unknown policies must not be presented as established restrictions. A ZIP/address field alone does not establish refusal to respond, actual blocking, or a legal obligation. An empty array does not mean unrestricted access. For unknown entries, `sourceUrl` identifies a page reviewed, not proof of a restriction, and `lastVerified` stays null.
6. Recheck sources before releases and when offices announce changes. If a detail cannot be established, label it unknown/unverified and document the limitation instead of guessing. Run all validation commands below after edits. Tests check data consistency, not live website availability.

Contact data reviewed **November 8, 2026**:

| Official | Seat | Washington, D.C. | Official form/source | Phone source |
|---|---|---|---|---|
| Ron Wyden | Senate, OR | (202) 224-5244 | [Contact page](https://www.wyden.senate.gov/contact) links to [Email Ron](https://www.wyden.senate.gov/contact/email-ron) | [Office locations](https://www.wyden.senate.gov/contact/office-locations) |
| Jeff Merkley | Senate, OR | (202) 224-3753 | [Email Jeff](https://www.merkley.senate.gov/connect/contact/) | [Office locations](https://www.merkley.senate.gov/connect/office-locations/) |
| Suzanne Bonamici | House, OR-1 | (202) 225-0855 | [Contact page](https://bonamici.house.gov/contact) links to [Email Suzanne](https://bonamici.house.gov/contact/email) | [Contact page](https://bonamici.house.gov/contact) |
| Cliff Bentz | House, OR-2 | (202) 225-6730 | [Contact form](https://bentz.house.gov/contact) | [Contact page](https://bentz.house.gov/contact) |
| Maxine Dexter | House, OR-3 | (202) 225-4811 | [Contact page](https://dexter.house.gov/contact) links to [Contact Me](https://dexter.house.gov/contact/email-me) | [Contact page](https://dexter.house.gov/contact) |
| Val Hoyle | House, OR-4 | (202) 225-6416 | [Contact page](https://hoyle.house.gov/contact) links to [Email Val](https://hoyle.house.gov/contact/email-val?clear=) | [Official homepage](https://hoyle.house.gov/) |
| Janelle Bynum | House, OR-5 | (202) 225-5711 | [Contact page](https://bynum.house.gov/contact) links to [address verification](https://bynum.house.gov/contact/email-me) | [Contact page](https://bynum.house.gov/contact) |
| Andrea Salinas | House, OR-6 | (202) 225-5643 | [Address verification/contact entry](https://salinas.house.gov/contact) | [Contact page](https://salinas.house.gov/contact) |

The House and Senate directories above corroborate identity, official websites, and D.C. numbers. All eight official form entry URLs are verified; none has independently tested submission functionality. Wyden, Bonamici and Hoyle's correspondence controls were unavailable in retrieved content. Bynum and Salinas publish an address-verification step, whose next stage was not inspected without constituent information. Merkley, Bentz and Dexter's public instructions/form markup were inspected read-only, not interaction-tested. No direct email address was verified for general correspondence. Residency-based response policies and actual out-of-district submission blocking remain unestablished. These limitations do not imply that the forms are broken or that offices refuse correspondence.

The contact UI shows the official form, a visible D.C. number, and explicit Call/Copy actions. Calling only occurs when the visitor follows the `tel:` link; copying affects only the clipboard. Sources, dates, testing scope and noncritical restrictions are under **Sources and contact details**. Only verified response policies, verification steps, or submission blocks affecting displayed methods receive prominent notices. Phone numbers and websites remain available regardless of those notices.

Validate changes with:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

### Privacy

Message generation and editing occur entirely in the browser. Names, cities, and drafts exist only in component memory; they are not transmitted, logged, or persisted. Copying writes the complete message to the visitor's clipboard only when requested. There is no localStorage/sessionStorage draft persistence, analytics, cookies, tracking, backend, automatic submission, or third-party fetching. External sites and hosting infrastructure have their own privacy practices; this site does not promise complete anonymity.

`.gitignore` excludes dependencies, production output, TypeScript build metadata, and `.env`/`.env.*` files, except an intentionally shareable `.env.example` (which must never contain secrets).

## Before public launch

1. Recheck officeholders, contact sources and verification dates against official House and Senate websites. Published-link verification is separate from form functionality testing.
2. Check each petition link, organizer, current wording, and signature count. No signature counts are displayed by default.
3. Add district lookup if needed. ZIP codes alone do not uniquely identify congressional districts; use an authoritative address lookup rather than guessing.
4. Add an accessibility review, browser testing, and optional automated link checks.
5. Never claim messages or signatures were submitted by this site. Users must submit through the linked external services.

No analytics, accounts, backend, automatic submissions, or local-storage persistence are included.

## License

This project is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for details.
