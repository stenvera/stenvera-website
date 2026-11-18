import assert from 'node:assert/strict';

const base = new URL(process.env.SITE_URL || 'https://stenvera.com');
async function response(path) {
  return fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
}

async function check() {
  for (const [path, language] of [['/', 'nl'], ['/en/', 'en']]) {
    const result = await response(path);
    assert.equal(result.status, 200, `${path} status`);
    assert.match(await result.text(), new RegExp(`<html lang="${language}"`));
    assert.equal(result.headers.get('x-content-type-options'), 'nosniff');
  }
  for (const path of ['/styles.css', '/app.js', '/brand.svg', '/mark-veenstra.webp']) {
    assert.equal((await response(path)).status, 200, `${path} status`);
  }
  assert.equal((await response('/__deployment-smoke-not-found__')).status, 404);
  if (base.hostname === 'stenvera.com') {
    const redirect = await fetch('https://www.stenvera.com/en/?source=deployment-check', {
      redirect: 'manual', signal: AbortSignal.timeout(15000)
    });
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), 'https://stenvera.com/en/?source=deployment-check');
  }
}

for (let attempt = 1; ; attempt++) {
  try {
    await check();
    console.log(`PASS: ${base.origin}: language pages, security header, assets and 404${base.hostname === 'stenvera.com' ? ', plus www redirect' : ''}`);
    break;
  } catch (error) {
    if (attempt === 5) throw error;
    console.warn(`Smoke check attempt ${attempt} failed: ${error.message}; retrying`);
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}
