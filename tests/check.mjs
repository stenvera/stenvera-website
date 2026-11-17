import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { join } from 'node:path';
const dist=join(import.meta.dirname,'..','dist');
const nl=readFileSync(join(dist,'index.html'),'utf8');
const en=readFileSync(join(dist,'en/index.html'),'utf8');
const css=readFileSync(join(dist,'styles.css'),'utf8');
const js=readFileSync(join(dist,'app.js'),'utf8');
assert.match(nl,/<html lang="nl"/);
assert.match(en,/<html lang="en"/);
assert.match(nl,/<h1 id="hero-title">Mark Veenstra<\/h1>/);
assert.match(en,/>Featured playground</);
assert.match(nl,/>Mijn playground</);
for(const html of [nl,en]){
 for(const link of ['https://github.com/Stenvera','https://github.com/mark-veenstra','https://nl.linkedin.com/in/mark-veenstra-b87b6a74/nl','mailto:mark@stenvera.com']) assert.ok(html.includes(link),`Missing ${link}`);
 for(const lang of ['hreflang="nl"','hreflang="en"']) assert.ok(html.includes(lang));
 assert.match(html,/data-set-theme="light"/);
 assert.match(html,/data-set-theme="dark"/);
 for(const asset of ['/styles.css','/app.js','/brand.svg','/mark-veenstra.webp','/favicon.svg','/og-image.png']) assert.ok(html.includes(asset),`Missing asset reference ${asset}`);
}
assert.ok(js.includes('prefers-color-scheme: dark'));
assert.ok(js.includes('stenvera-theme'));
assert.ok(css.includes('html[data-theme=dark]'));
for(const file of ['styles.css','app.js','brand.svg','favicon.svg','mark-veenstra.webp','apple-touch-icon.png','og-image.png','robots.txt','sitemap.xml','404.html','_headers']) assert.ok(existsSync(join(dist,file)),`Missing file ${file}`);
console.log('PASS: NL & EN content, contact & social links, OS-aware theme, build assets, SEO files');
