# Pull request previews

The Website workflow builds and tests every PR. For same-repository PRs, it then downloads the tested assets, creates or updates a Cloudflare Preview named pr-<number>, and posts its URL on the PR. The GitHub preview environment also links to the deployment.

Previews are public. They do not replace the production deployment or change the stenvera.com domain. This static site has no database, service bindings or runtime secrets; reassess resource isolation before adding them. Cloudflare Preview URLs are not access controls.

## Setup

1. Create a GitHub environment named preview in Stenvera/stenvera-website. It must allow PR refs; the production environment remains restricted to main.
2. Create a separate Cloudflare account-owned token: Specified Workers / stenvera-website / Workers Editor. Save it in the preview environment as CLOUDFLARE_API_TOKEN. Leave IP filtering empty for GitHub-hosted runners.
3. Set repository variable PREVIEWS_ENABLED=true. CLOUDFLARE_ACCOUNT_ID is shared with the production workflow.
4. Merge the workflow changes. Open or update a same-repository PR and inspect its preview job, PR link and screenshot artifact. The cleanup workflow must exist on main to handle PR closure.

The token is separate from production's secret, but Workers Editor is not a preview-only role: it can also update the targeted Worker's production deployment. Only trusted repository contributors should have write access. Fork PRs and Dependabot PRs receive build checks only. Never expose credentials to fork code with pull_request_target. The cleanup workflow uses that event solely to run trusted default-branch code after closure.

## Checks and review

- HTTP checks verify both language pages, assets, security headers and the custom 404.
- Chromium checks cover Dutch/English browser preferences, remembered manual language choice, system dark theme, remembered theme choice, JavaScript errors and horizontal overflow at desktop/mobile widths.
- The preview-screenshots artifact contains both languages and themes at 1440px and 390px widths. Inspect it and the live preview before approving a PR; these checks do not establish full accessibility or cross-browser compatibility.
- The production www redirect is checked only after production deployment because a Preview has no production custom domain.

Run browser checks manually after npm ci and npx playwright install chromium:

```sh
SITE_URL=https://your-preview-url npm run test:browser
```

In PowerShell, set $env:SITE_URL before running npm run test:browser. Screenshots are written to the ignored artifacts/browser directory.

## Lifecycle

Deployment and cleanup share a per-PR concurrency group. Before deploying, the workflow verifies the PR is still open and its head commit still matches the triggering event. The cleanup workflow deletes only pr-<number>, never the Worker itself. Reopening a PR recreates its preview.

If previews are paused with PREVIEWS_ENABLED=false, cleanup is also paused. Remove leftover previews manually with the pinned Wrangler:

```sh
npx wrangler preview delete --worker-name stenvera-website --name pr-123 --skip-confirmation
```

References: [Cloudflare CI examples](https://developers.cloudflare.com/workers/previews/examples/) and [Preview resource isolation](https://developers.cloudflare.com/workers/previews/resources/).
