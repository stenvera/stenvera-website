# Stenvera.com — Mark Veenstra

A real, production-ready, bilingual (NL + EN) static personal website. Inspired by the approved Stenvera light/dark design mockups. It uses Mark's supplied portrait photo, a source-editable Stenvera-style vector mark, and links to LinkedIn and both GitHub profiles.

## Included

- **NL** `https://stenvera.com/` and **EN** `https://stenvera.com/en/`, with accessible language switch.
- Light / dark themes: **first visit follows `prefers-color-scheme`** from the visitor's OS/browser, and manual choice is remembered in `localStorage`. When no override is set, it also reacts to changes of the OS preference.
- Responsive desktop, tablet and mobile layouts.
- Intro, expertise, homelab and project playground, experience, technology stack, and contact sections.
- Contact email: `mark@stenvera.com` (mailto link, not a hosted contact form).
- Links to both https://github.com/Stenvera and https://github.com/mark-veenstra plus LinkedIn.
- SEO: canonical URLs, distinct language metadata, `hreflang`, sitemap, robots, Open Graph image, Person JSON-LD, and custom 404.
- No analytics, trackers, frontend frameworks, external fonts or network-dependent runtime resources.

**Note about the logo:** the supplied visual design mockups contain a Stenvera S-style symbol, but the original vector file was not available in this task. The project therefore includes a new editable SVG reconstruction (`src/brand.svg`) visually in the same style. Replace it with the exact approved vector whenever available. The favicon (`src/favicon.svg`) is coordinated with it.

## Quick start

Requires Node.js 20+. There are **zero npm dependencies**.

```bash
npm run build
npm test
python3 -m http.server 8080 --directory dist
```

Visit http://localhost:8080/ (Dutch) or http://localhost:8080/en/ (English).

`npm run build` generates a self-contained `dist/` folder. This directory is intentionally excluded from Git, and Cloudflare Pages builds it automatically.

## Upload to GitHub

Create a new repository e.g. `stenvera-website` on either your personal account `mark-veenstra` or the `Stenvera` organization. Make sure your GitHub user has permissions to the target organization if choosing Stenvera.

Unzip the package and run **from the directory containing `package.json`**:

```bash
git init
git add .
git commit -m "Initial Stenvera personal website"
git branch -M main
git remote add origin https://github.com/Stenvera/stenvera-website.git
git push -u origin main
```

If using your personal GitHub account instead, use `https://github.com/mark-veenstra/stenvera-website.git` as the remote. **Create that repository first**; the examples do not create it for you.

Or upload the unzipped source files with GitHub's web interface (not the ZIP file itself).

## Connect Cloudflare Pages to GitHub

1. Open the Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**. UI names can change.
2. Authorize the Cloudflare GitHub integration for your account or Stenvera organization, and select the `stenvera-website` repository.
3. Configure the build:

   | Setting | Value |
   |---|---|
   | Framework preset | `None` |
   | Production branch | `main` |
   | Root directory | `/` (repo root / default) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node.js | 20 or later |

4. Deploy. Cloudflare creates a `*.pages.dev` preview URL. Each push to `main` then automatically deploys a new production version. Nonproduction branches can produce preview deployments.
5. In your Pages project choose **Custom domains → Set up a domain** and add `stenvera.com` (your domain's DNS is already hosted with Cloudflare). Let Cloudflare create/manage the corresponding apex DNS record. Do not manually add an apex Pages CNAME before associating the custom domain.
6. To send `www.stenvera.com` to `https://stenvera.com`, follow Cloudflare's documented **Bulk Redirect** pattern and add the required proxied `www` DNS record. Do not blindly attach `www` to a Tunnel because of a wildcard rule. The official guide gives an example using a proxied DNS A record pointed to `192.0.2.1`, which is a **placeholder for the redirect mechanism, not a website origin IP**.
7. Verify both `https://stenvera.com/` and `https://stenvera.com/en/` and all external links, the theme toggle, and the email link.

**Important for the existing Stenvera setup:** You can keep your wildcard/other DNS records for future project subdomains (`*.stenvera.com`), Cloudflare Tunnel, `privatelab.stenvera.com`, and your Cloudflare Email Routing MX/TXT records. Only the apex `stenvera.com` record should be managed for this Pages website. If there is already an apex record routing elsewhere, resolve that specific conflict, without touching the existing mail routing or project records.

Cloudflare official documentation:
- GitHub integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- WWW → apex redirect: https://developers.cloudflare.com/pages/how-to/www-redirect/
- Build settings: https://developers.cloudflare.com/pages/configuration/build-configuration/

## Editing the website

| What you want to update | File |
|---|---|
| Dutch / English text, URLs, expertise & experience | `scripts/build.mjs` (the `data.nl` / `data.en` objects) |
| Styling, colors, spacing, responsiveness | `src/styles.css` (`:root` and `html[data-theme=dark]`) |
| Theme and language interaction | `src/app.js` |
| Photo | `src/mark-veenstra.webp` |
| Logo and favicon | `src/brand.svg`, `src/favicon.svg` |
| Link preview image | `src/og-image.png` |
| Headers, robot rules | `src/_headers`, `src/robots.txt` |

**Before publishing:** Check the wording about ilionx, including the planned 1 January 2027 starting date (update it once you have started), and confirm `mark@stenvera.com` forwards successfully to your mailbox. A mailto link requires working mail routing, but this site does not host your email.

## Technical notes

The two pages are pre-rendered at build time. There is no SPA fallback, no server code, and no origin connected to the homelab. Visitor preferences live only in the visitor's own browser storage. All navigation, language links and SEO URLs work with Cloudflare Pages' standard static-file hosting.
