# Repository guidance for coding agents

## Context

Stenvera is Mark Veenstra's bilingual personal website on Cloudflare Workers Static Assets. Read README.md, package.json and wrangler.jsonc before changing build or deployment behavior. Historical Pages instructions are superseded.

Inspect git status first and preserve unrelated edits. Keep changes focused on the request. Prefer the small static implementation; introduce frameworks, services, analytics or dependencies only when needed for the requested feature.

## Source map

- scripts/build.mjs: NL/EN content, shared HTML template, metadata, sitemap, 404 and explicit asset-copy list.
- src/styles.css: responsive styling and both themes.
- src/app.js: device-aware theme selection, language/hash handling and navigation.
- src/_headers: security policy; consider it when changing scripts or resource loading.
- tests/check.mjs: checks generated output, so build first.
- dist/: generated and ignored. Edit source and rebuild. New assets may require updating the explicit copy list.

## Product constraints

- Preserve Dutch / and English /en/; update both language objects for shared content changes.
- Root visits use the first supported browser language, falling back to English; manual language choices take priority. Preserve explicit /en/ links and query/hash values. Language switching must work when browser storage is blocked.
- Keep canonical URLs, hreflang and sitemap consistent with https://stenvera.com.
- Preserve semantic HTML, keyboard navigation, accessible labels, responsive layout and both themes. First visit follows the device theme; manual choice persists.
- Preserve mark@stenvera.com and the correct LinkedIn and both GitHub links. Do not invent personal facts or employment dates. The planned ilionx start remains 1 January 2027 until confirmed otherwise.
- Preserve the supplied portrait and branding. The SVG is a reconstruction, not the original. Do not add a license covering personal assets without owner direction.
- There is no server, database or contact-form backend. Keep private homelab information and credentials out of this public source tree.

## Validation

Run from repository root:

```sh
npm run build
npm test
```

These checks use only Node built-ins. Node 24 is the documented local baseline. For Wrangler development, use npm ci when a lockfile exists, otherwise npm install. Preserve the exact Wrangler pin and commit the generated lockfile for dependency changes.

For visual or interaction changes, use npm run dev and inspect both languages and themes on mobile and desktop. Rebuild after source edits: the dev command builds only once. Check links, keyboard navigation, theme persistence, overflow and console errors. Report if browser verification is unavailable.

Adapt meaningful tests when behavior changes; documentation-only edits need no new tests. Report checks actually run and remaining uncertainty. Local tests do not establish live deployment success.

## Deployment boundaries

- Worker: stenvera-website; production branch: main; assets: ./dist.
- npm run deploy publishes existing output without build/tests; npm run deploy:local builds and publishes without tests. Neither is a validation command.
- Local edits and checks do not authorize publishing. Push, merge or deploy only when requested; production pushes can deploy automatically.
- Keep the apex custom domain dashboard-managed; routes is intentionally absent from Wrangler. The www Bulk Redirect, DNS, Email Routing and Tunnel configuration live outside this repository.
- Do not modify unrelated DNS, email or homelab resources. Never commit API tokens, .dev.vars, .env files or credential-bearing logs.
- Update README.md when commands, dependencies, architecture or deployment requirements change. Distinguish recorded setup from settings verified in the live account.
