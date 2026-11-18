# Stenvera.com — Mark Veenstra

Bilingual personal website deployed with **Cloudflare Workers Static Assets** from [Stenvera/stenvera-website](https://github.com/Stenvera/stenvera-website). Dutch: <https://stenvera.com/>. English: <https://stenvera.com/en/>.

## Architecture

`scripts/build.mjs` generates HTML and copies `src/` assets into `dist/`. There is no framework, backend Worker script, database, contact form, external font or runtime npm dependency. Wrangler is a development dependency. The source includes no analytics or trackers; dashboard-managed analytics settings are separate.

## Included

- Dutch and English pages with automatic language selection on root visits based on browser preferences, falling back to English.
- Accessible NL/EN switch with remembered manual selection.
- Device-aware light/dark themes with remembered manual selection.
- Responsive layouts, portrait, projects, experience and contact sections.
- SEO: canonical URLs, hreflang, sitemap, robots, Open Graph image and Person JSON-LD.
- Custom 404 page.

Visitors entering at `/` are directed to Dutch or English using their browser's ordered language preferences (normally inherited from OS settings). The first supported language wins; English is the fallback. The NL/EN switch remembers an explicit choice in local storage and includes a `lang` query parameter so it also works when storage is unavailable. Direct `/en/` links stay English. Redirects preserve query parameters and section anchors. Detection runs in the browser; without JavaScript, `/` serves Dutch and `/en/` serves English.

Contact is `mark@stenvera.com`, with LinkedIn and both GitHub profiles linked. Branding assets are stored in `src/`. No license has been selected; public availability does not grant reuse rights to personal photos or branding.

## Local development

Use Node.js 24 and npm for local work. The package declares Node >=20, but the tests use `import.meta.dirname`, which requires at least Node 20.11. Wrangler is pinned to `4.164.0`.

```sh
npm ci
npm run build
npm test
npm run dev
```

`package-lock.json` records the dependency tree for reproducible `npm ci` installs. When intentionally changing dependencies, use `npm install` and commit the updated lockfile. The build and tests themselves use only Node built-ins, so they can run without installing Wrangler.

Open the URL printed by Wrangler and check `/` and `/en/`. The dev command builds only once: run `npm run build` again after editing source. The build replaces `dist/`; never edit generated output directly.

| Command | Behavior |
|---|---|
| `npm run build` | Generate pages, sitemap, 404 and copied assets |
| `npm test` | Check existing build output; build first |
| `npm run dev` | Build once and start Wrangler locally |
| `npm run deploy` | Publish existing `dist/`; does not build or test |
| `npm run deploy:local` | Build and publish; does not test |

For a basic preview without Wrangler, build and run `python -m http.server 8080 --directory dist` (`py` on Windows or `python3` where appropriate). This does not emulate Cloudflare headers, redirects or 404 handling.

## Cloudflare setup

GitHub Actions builds and tests pull requests. Pushes to main deploy the tested assets through Wrangler when DEPLOYMENTS_ENABLED is true. See [Deployment](docs/deployment.md) for credentials, cutover and rollback.

### GitHub Actions configuration

| Setting | Value |
|---|---|
| Workflow | .github/workflows/website.yml |
| Production branch | main |
| GitHub environment | production, restricted to main |
| Repository variable CLOUDFLARE_ACCOUNT_ID | Account containing stenvera-website |
| Repository variable DEPLOYMENTS_ENABLED | true to publish; false to pause |
| Environment secret CLOUDFLARE_API_TOKEN | Account-owned token: Specified Workers / stenvera-website / Editor |
| Build and checks | npm ci, npm run build, npm test |
| Deploy command | npm run deploy |
| Assets directory | ./dist |

Application runtime secrets and bindings are not required. GitHub stores the deployment credential. Keep the old Workers Builds production trigger disabled to avoid competing production deployments.

### Wrangler configuration

| Setting | Current value |
|---|---|
| `compatibility_date` | `2026-11-17` |
| `workers_dev` | `true` |
| `preview_urls` | `true` |
| `assets.directory` | `./dist` |
| `assets.html_handling` | `auto-trailing-slash` |
| `assets.not_found_handling` | `404-page` |
| `assets.run_worker_first` | `false` |
| `observability.logs` | Enabled, sampling `1`, invocation logs and persistence enabled |
| `observability.traces.enabled` | `false` |

The apex custom domain is Terraform-managed in the private infrastructure repository, so `routes` is omitted from `wrangler.jsonc`. Static asset requests do not execute application Worker JavaScript, so invocation logs are not a page-view counter.

### Domains, redirects and email

- Attach `stenvera.com` as the Worker's **Custom Domain**. See [Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- The Bulk Redirect list is named `stenvera_www_redirects`: source `www.stenvera.com/`, target `https://stenvera.com`, status **301**. Enable **Preserve query string**, **Subpath matching** and **Preserve path suffix**; disable **Include subdomains**. Enable a redirect rule referencing the list.
- Configure `www` as a **proxied A record** pointing to `192.0.2.1`, TTL Auto. This is a placeholder for edge redirects, not a website origin.
- Keep unrelated DNS and email records unchanged when configuring the website.
- `mailto:mark@stenvera.com` relies on external mail forwarding; the repository does not provision or verify it.

### Publishing and checks

Before publishing, run `npm run build` and `npm test`. To deploy manually, authenticate with `npx wrangler login`, then run `npm run deploy` against the tested output. A push/merge to the configured production branch can publish automatically.

After deployment verify:

- `/` and `/en/`, assets, external/contact links, language switching and themes.
- An unknown path returns HTTP 404 with the custom page.
- `https://www.stenvera.com/en/?source=check` redirects to `https://stenvera.com/en/?source=check`, retaining path and query.
- Response security headers match `src/_headers`.

## Editing guide

| Change | File |
|---|---|
| NL/EN content, links, HTML templates, metadata, sitemap, 404 | `scripts/build.mjs` (`data.nl` / `data.en`) |
| Styling and responsive themes | `src/styles.css` |
| Theme, language and navigation interactions | `src/app.js` |
| Portrait | `src/mark-veenstra.webp` |
| Logo, favicon, touch icon | `src/brand.svg`, `src/favicon.svg`, `src/apple-touch-icon.png` |
| Social preview image | `src/og-image.png` |
| Headers and crawler rules | `src/_headers`, `src/robots.txt` |
| Deployment | `wrangler.jsonc`, `package.json` |
| Build checks | `tests/check.mjs` |
| Coding-agent guidance | `AGENTS.md` |

Keep both languages aligned when updating content. For visual or interaction changes, inspect both languages and themes at mobile and desktop sizes. Node tests do not verify layout, browser interactions or live deployment.
