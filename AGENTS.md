# Dear Representative — Agent Instructions

## Project purpose
Dear Representative is an open-source, privacy-conscious civic contact tool. It helps visitors find official congressional contact channels, compose and personalize messages locally, and follow external petition links. Oregon is the initial dataset; the architecture should support additional states and campaigns.

## Stack and design
- React, TypeScript, Vite; static site by default.
- Keep UI components, legislator/contact data, campaign content, and message rendering separate.
- Store each campaign's House/Senate message-length templates in separate, easy-to-edit files.
- Favor simple, typed code and minimal dependencies. Explain proposed new dependencies.
- Preserve existing behavior and styling unless a task explicitly requests changes.

## Privacy and safety
- Compose messages entirely in the browser. Do not transmit, log, persist, or collect names, addresses, ZIP codes, or message contents.
- Do not add analytics, cookies, tracking, backend services, localStorage/sessionStorage persistence, or third-party requests without explicit approval.
- Do not promise anonymity across external sites, congressional contact forms, petition platforms, or hosting infrastructure.
- Never automatically send messages or sign petitions. The visitor must review and submit through the destination site.
- Do not embed third-party petition widgets by default.

## Accuracy and civic integrity
- Use official sources for legislator identity, chamber, district, contact URLs, and phone numbers. Record source and verification date when adding or updating contact data.
- Do not invent direct email addresses. Distinguish official contact forms from publicly verified direct email addresses.
- ZIP codes can span multiple congressional districts; never silently infer a unique House member from an ambiguous ZIP.
- Preserve current officeholders until their actual terms end. Treat election results and incoming members separately.
- Keep campaign text user-editable. Do not silently change a campaign's political position or wording.
- Do not fabricate petition signature counts or claim that cached counts are live. Use authorized data sources and clearly label verification dates.

## Working with this repository
- Before substantial changes, inspect relevant files, propose a concise plan, and wait for approval when requested.
- Make small, reviewable changes. Do not overwrite user edits or restructure unrelated code.
- Add or update tests for rendering, template selection, placeholder substitution, reset behavior, and data validation as appropriate.
- Run available tests, type checks, and production build; report commands and results honestly.
- Do not commit secrets, node_modules/, dist/, or .env files.
- Update README when architecture or setup changes.

## Near-term roadmap (not authorization to implement)
1. Refactor campaign templates into separate files with a reusable typed renderer.
2. Add a reset-to-original-template action.
3. Expand verified contact methods and phone actions.
4. Add state selection and reliable district lookup.
5. Consider privacy-preserving aggregate analytics and permitted petition metadata updates only after explicit design approval.
