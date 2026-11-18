# GitHub Actions deployment

The Website workflow builds and tests pull requests and main commits without Cloudflare credentials. It uploads the tested dist directory and deploys that exact artifact on main only when the repository variable DEPLOYMENTS_ENABLED is true.

## Configuration

- Repository variable CLOUDFLARE_ACCOUNT_ID: the account containing stenvera-website.
- Repository variable DEPLOYMENTS_ENABLED: leave unset until cutover; set to true to enable publishing.
- GitHub environment production: restrict deployments to main. Store CLOUDFLARE_API_TOKEN as an environment secret.
- Use a dedicated account-owned Cloudflare deployment token with Workers / Editor scoped to the existing stenvera-website Worker (Specified Workers). Do not select the legacy Workers Scripts permission or Workers Admin. Keep DNS and redirect administration in the infrastructure repository. If Wrangler reports an additional required permission, review that specific permission before expanding scope.
- The private Stenvera/stenvera-infrastructure repository manages the domain, www DNS and redirects after import. Do not add competing routes to Wrangler.

## Cutover

1. Configure the variables, production environment and deployment secret. Keep DEPLOYMENTS_ENABLED unset.
2. Merge the workflow and confirm a successful build/test run.
3. Pause the existing Workers Builds production trigger. Preserve its configuration for rollback.
4. Set DEPLOYMENTS_ENABLED=true and manually run Website on main.
5. Confirm the deployment and smoke checks succeed before considering the migration complete.

Avoid enabling two automatic production deployers at once. If cutover fails, set DEPLOYMENTS_ENABLED=false and restore the existing Workers Builds trigger. The last successful Worker deployment remains available; use Cloudflare deployment rollback if the published assets themselves need reverting.

## Checks

Run npm run build and npm test before publishing. node scripts/smoke.mjs checks the public site responses; it does not deploy. The smoke check verifies HTTP responses, not client-side language detection or browser layout.

Production credentials are never supplied to pull-request jobs. Trusted same-repository PRs can use the separate preview environment; see [PR previews](previews.md). Workflow actions are pinned to immutable commits; update pins intentionally.

The empty `previews` block in `wrangler.jsonc` supports `wrangler preview` while the existing Cloudflare preview integration remains active. `preview_urls` controls version URLs and does not replace that block.

See [Cloudflare Workers authorization](https://developers.cloudflare.com/workers/authorization/workers/) for current roles. Deployments here must not change Custom Domains or routes; those operations require broader Workers product access and zone Workers Routes Write in the infrastructure token.
