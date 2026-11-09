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

Vite uses `base: '/'` for hosting at the root of `https://dear-representative.org/`. HTTP (`npm run dev`) and optional local HTTPS (`npm run dev:https`) remain available. Local certificates are not used by production builds.

## GitHub Pages deployment

`.github/workflows/deploy-pages.yml` runs on pushes to `main` or **Actions → Deploy GitHub Pages → Run workflow** (select `main`). Other manually selected branches are skipped. Node.js 24 runs `npm ci`, tests, typechecking, and `npm run build`; only `dist/` is uploaded through the official Pages artifact action. A separate job deploys it into the `github-pages` environment. Builds have read-only repository access; only deployment has `pages: write` and `id-token: write`. The `pages` concurrency group queues updates without cancelling an active deployment. No personal access token, DNS secret, or deployment branch is needed. See [GitHub's workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### One-time GitHub settings

1. In repository **Settings → Actions → General**, ensure GitHub Actions and the official `actions/*` actions used by this workflow are permitted. The workflow declares its own token permissions; do not enable general repository write access just for deployment.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Prefer verifying domain ownership in the owner's account/organization **Settings → Pages** using GitHub's supplied TXT record. Keep that verification record afterward. Follow [domain verification instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
4. In repository **Settings → Pages → Custom domain**, save `dear-representative.org` before pointing DNS at Pages. Custom Actions deployments use this setting, not a repository `CNAME` file.
5. Check **Settings → Environments → github-pages** allows deployment from `main`. Complete any required environment approvals when deploying.

### Namecheap DNS

For a domain using Namecheap BasicDNS/PremiumDNS/FreeDNS, open **Domain List → Manage → Advanced DNS → Host Records**. If authoritative nameservers are elsewhere, edit records at that DNS provider instead. Use Automatic TTL. Remove conflicting parking/URL Redirect records for `@` and `www`, while retaining unrelated email and verification records. [Namecheap record instructions](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/)

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `casimirsowinski.github.io` |

The `www` target is the repository owner's GitHub Pages hostname, without a protocol or repository path. Update it if the repository transfers owners. GitHub can redirect `www` to the configured apex domain. Avoid wildcard records. IPv6 is optional: if adding apex AAAA records, use all four GitHub values `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`; remove conflicting old AAAA records. Recheck addresses against [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) when maintaining DNS.

### HTTPS and verification

After DNS propagates and GitHub provisions its certificate, enable **Settings → Pages → Enforce HTTPS**. GitHub manages the public certificate; do not upload mkcert certificates or buy/install a Namecheap certificate for this Pages site. Provisioning is not immediate. If HTTPS remains unavailable, check the Pages DNS status, conflicting records, and any restrictive CAA records using [GitHub's HTTPS troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

After reviewing, committing and pushing the source changes:

1. Confirm both workflow jobs succeed and the deployment environment links to `https://dear-representative.org/`.
2. On Windows, inspect DNS with `Resolve-DnsName dear-representative.org -Type A` and `Resolve-DnsName www.dear-representative.org -Type CNAME`.
3. Open the apex and `www` URLs, check HTTPS/redirects, then hard-refresh. Confirm JavaScript/CSS load from `/assets/` without 404s. The root base is intentional; an unconfigured `github.io/dear-representative/` project URL is not a substitute for testing the custom domain.
4. Test official selection, template editing, reset, message copying, phone copying, restriction/source expansion, and petition filtering on desktop and mobile. Check Copy by pasting into a scratch field; do not submit messages or call offices during testing.
5. Confirm the browser has no mixed-content errors and no app-initiated analytics, draft uploads, or persistence. Pages hosting and external destinations have their own privacy practices; hosting does not provide complete anonymity.

Keep `dist/`, dependencies, certificates, CA material, and secrets out of commits. The workflow uploads only the generated static site; never place private files in `public/` or import secrets into client code. GitHub settings, DNS, public HTTPS issuance and live deployment must be verified separately from local build checks.

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

The contact UI shows the official form, Washington, D.C. location label, and a clickable phone number beside a compact **Copy** button. The number itself is the `tel:` link; calling occurs only when the visitor activates it. At the bottom of the composer, a labeled **Selected representative** area keeps the official's name, title and actions together above any expandable details. Sources, dates, testing scope and noncritical restrictions remain under **Sources and contact details**. Only verified response policies, verification steps, or submission blocks affecting displayed methods receive prominent notices. Phone numbers and websites remain available regardless of those notices.

### Phone copying and mobile testing

Phone copying first uses `navigator.clipboard.writeText` when available. If unavailable or rejected, it attempts a temporary selected-text copy using deprecated `document.execCommand('copy')`. This is a best-effort compatibility fallback, not guaranteed mobile support. It removes the temporary element and restores focus, input/textarea caret or selection, and document selection. It captures that state immediately before fallback so delayed permission rejection does not restore an outdated editing position. Success is announced only after the Clipboard API resolves or the fallback reports success; otherwise the visible number can be copied manually. Feedback uses a polite live region. Complete-message copying retains its existing behavior and manual-copy guidance.

HTTP `localhost` is generally treated as a secure context, while HTTP on a LAN IP such as `192.168.1.49` is not. This can make the asynchronous Clipboard API unavailable on a phone accessing the development server. HTTPS still does not guarantee clipboard permission. No security flags or browser protections need to be changed. See [Clipboard API requirements](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) and [legacy copy limitations](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand).

For manual browser checks, use narrow widths (including 320px), keyboard navigation and a real phone. Verify that the phone link and Copy button remain readable, focus outlines are visible, the selected official updates, sources still expand, and restrictions remain visible. Paste a copied number into a scratch field to confirm the actual clipboard contents; also test denied/unavailable clipboard access and manual selection. Do not call an office or submit a message during testing. Automated DOM tests cover the fallback and restoration paths but cannot establish real-device clipboard compatibility.

### Optional HTTPS development (Windows 11)

`npm run dev` still starts HTTP. `npm run dev:https` uses a separate Vite configuration and local certificates; production builds and previews do not require certificates. No npm dependencies are added. Vite's host/CORS defaults are retained. HTTPS binds to local network interfaces on port 5173; run it only on a trusted private network.

Install [mkcert](https://github.com/FiloSottile/mkcert) using PowerShell:

```powershell
winget install --id FiloSottile.mkcert --exact --scope user --source winget
```

Open a new terminal so `mkcert` is on PATH. If needed in the current terminal, use `& "$env:LOCALAPPDATA\Microsoft\WinGet\Links\mkcert.exe"` in place of `mkcert`.

**One-time trust setup:** run `mkcert -install` only when you intend to install its development CA into Windows/browser trust stores. Review any elevation/security prompt; administrator access or trust changes require your approval. Restart browsers afterward. Generating a certificate alone does not install trust.

From the repository root, generate the server certificate (replace the LAN IP if necessary):

```powershell
New-Item -ItemType Directory -Force .certs | Out-Null
mkcert -cert-file .certs/localhost.pem -key-file .certs/localhost-key.pem localhost 127.0.0.1 192.168.1.49
npm run dev:https
```

Open `https://localhost:5173/` or `https://127.0.0.1:5173/` on the PC. On a phone on the same LAN, use `https://192.168.1.49:5173/` after installing the public CA certificate as described below. `localhost` on a phone means the phone itself. Stop the HTTP server first if it occupies port 5173; HTTPS intentionally reports a port conflict rather than silently choosing another port.

To regenerate after a LAN IP change, find the active adapter's IPv4 address with `ipconfig`, stop Vite, and rerun the generation command with the new IP and the same filenames. Restart HTTPS and use the new URL. Reusing the same CA does not require reinstalling phone trust. Missing/unreadable certificates produce a setup error instead of falling back silently to HTTP.

**Certificate files and Git:** `.certs/` holds the server certificate and its private key. `mkcert -CAROOT` prints the separate user-profile CA directory. `.gitignore` excludes `.certs/`, local tools, certificate/key extensions and `rootCA*`; Vite denies access to these local files. Never put any certificate material in `public/` or import it into application code. Never force-add ignored files.

- `rootCA.pem` is the **public CA certificate**. Transfer only this file privately to your own testing phone; a copy may be renamed `rootCA.crt` if required by the phone's file picker.
- `rootCA-key.pem` is the **CA private key**. Never copy, share, publish, commit or transfer it to a phone. It can sign certificates trusted by devices that trust this CA.
- `.certs/localhost-key.pem` is the **server private key**. Keep it on the development PC; phones do not need it.

**iOS:** open the public CA certificate, install its profile under Settings → General → VPN & Device Management (or Profile Downloaded), then enable it under Settings → General → About → Certificate Trust Settings → Enable Full Trust for Root Certificates. See [Apple's instructions](https://support.apple.com/en-us/102390). Only trust a CA you generated and control.

**Android:** transfer the public CA certificate, then search Settings for “Install a certificate.” On many devices the path is Security & privacy → More security settings → Encryption & credentials → Install a certificate → **CA certificate**. Confirm the warning and select the public CA file. Labels vary by manufacturer and Android release; this is CA trust, not a Wi-Fi/client certificate installation. Restart the browser. Some browsers, apps or managed devices do not accept user-installed CAs; verify in the actual browser rather than assuming trust. Remove the development CA from the phone when no longer needed.

**Test Copy:** first verify the browser shows HTTPS without a certificate warning. Click the phone number's **Copy** button and paste into a local scratch field; do not initiate a call. A browser console, when available, should report `window.isSecureContext === true`. Clipboard permissions and user-gesture requirements still apply. A success message alone does not replace testing the paste result on your phone.

**Troubleshooting:**

- Connection timeout: confirm the current IP, same LAN, no guest Wi-Fi/client isolation or interfering VPN, and that Vite is running. Windows Firewall may require allowing Node/TCP 5173 on the **Private** network profile, preferably restricted to the local subnet. Review administrator prompts; do not disable the firewall or open router ports.
- Certificate warning: confirm that the URL's IP appears in the generated certificate, the same public CA is trusted, device clocks are correct, and browsers have restarted. Do not bypass warnings or change browser security flags. If the CA itself changes, reinstall the new public CA on testing devices.
- Firefox on Windows: mkcert may report that automatic Firefox trust setup is unavailable. If Firefox does not use the Windows trust entry, import only `rootCA.pem` into Firefox Settings → Privacy & Security → Certificates → View Certificates → Authorities, and allow it to identify websites. Do not import the CA private key.
- `mkcert` not found: reopen PowerShell or use the installed executable path above. To inspect the CA location, use `mkcert -CAROOT`; do not display or transmit private-key contents.
- Copy still fails over trusted HTTPS: check browser permissions and test from a direct button tap. Use manual selection if copying is blocked; the legacy fallback is not guaranteed on mobile.

Installing mkcert, generating certificates, and installing CA trust are separate steps. Nothing in `npm run dev:https` performs installation, generation, trust-store changes, or phone setup automatically.

Validate changes with:

```bash
npm test
npm run typecheck
npm run build
git diff --check
```

### Privacy

Message generation and editing occur entirely in the browser. Names, cities, and drafts exist only in component memory; they are not transmitted, logged, or persisted. Copying writes the complete message to the visitor's clipboard only when requested. There is no localStorage/sessionStorage draft persistence, analytics, cookies, tracking, backend, automatic submission, or third-party fetching. External sites and hosting infrastructure have their own privacy practices; this site does not promise complete anonymity.

The always-visible footer disclosure distinguishes local composition and clipboard copying from external congressional/petition sites and GitHub Pages hosting. GitHub Pages may process ordinary technical request information and access logs; see [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). The app does not intentionally collect or save composer information beyond the temporary browser state needed to edit it.

### System themes and visual checks

`src/styles.css` defines semantic light/dark palettes. Light is the default, with CSS `prefers-color-scheme: dark` overrides and native `color-scheme` support. Preference changes apply without reloads, JavaScript, a toggle, cookies or persistence. Numbered sections alternate subtly; cards have separate surfaces, and the selected representative retains its text label and stronger border. Links remain underlined and keyboard focus is outlined across controls.

Theme tests calculate text contrast (at least 4.5:1) and meaningful control/focus contrast (at least 3:1) from the actual CSS tokens. These checks target WCAG AA but are not a complete accessibility audit. When changing colors, rerun tests and inspect both themes at desktop and narrow mobile widths, including native controls, expanded details, focus and copy feedback. Automated DOM tests cannot establish native mobile or screen-reader rendering.

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
