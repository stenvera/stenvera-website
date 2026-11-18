// Run only from the trusted default branch on PR closure.
const { PR_NUMBER, CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } = process.env;
if (!/^[1-9]\d*$/.test(PR_NUMBER || '')) throw new Error('Invalid PR number');
if (!/^[a-f0-9]+$/i.test(account || '') || !token) throw new Error('Missing Cloudflare credentials');
const name = `pr-${PR_NUMBER}`;
const result = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/workers/workers/stenvera-website/previews/${name}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
  signal: AbortSignal.timeout(30000)
});
// A PR may close before its first preview is created, or after manual cleanup.
if (result.status === 404) {
  console.log(`Preview ${name} is already absent.`);
} else {
  if (!result.ok) throw new Error(`Preview cleanup failed: HTTP ${result.status}`);
  const body = await result.json();
  if (body.success !== true) throw new Error('Cloudflare did not confirm preview deletion');
  console.log(`Deleted preview ${name}.`);
}
