import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
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

// Execute the shipped browser script with controlled language/storage inputs.
function visit({ url='https://stenvera.com/', languages=['nl-NL'], language='en-US', saved, blocked=false }={}) {
 const values=new Map(saved ? [['stenvera-language',saved]] : []);
 const languageLinks=['/','/en/'].map(path=>({href:new URL(path,url).href,addEventListener(type,handler){this[type]=handler;}}));
 const location=new URL(url);
 let redirect;
 location.replace=value=>{redirect=value;};
 const localStorage={
  getItem(key){if(blocked) throw new Error('Blocked'); return values.get(key) ?? null;},
  setItem(key,value){if(blocked) throw new Error('Blocked'); values.set(key,value);}
 };
 runInNewContext(js,{
  URL, navigator:{languages,language},
  window:{location,localStorage,matchMedia:()=>({})},
  document:{documentElement:{dataset:{theme:'light'}},querySelector:()=>null,
   querySelectorAll:selector=>selector==='.lang-link'?languageLinks:[]}
 });
 return {redirect,languageLinks,values,location};
}
assert.equal(visit().redirect,undefined);
assert.equal(visit({languages:['en-GB','nl']}).redirect,'https://stenvera.com/en/');
assert.equal(visit({languages:['de-DE','nl-BE','en']}).redirect,undefined);
assert.equal(visit({languages:['fr-FR']}).redirect,'https://stenvera.com/en/');
assert.equal(visit({languages:[],language:'nl-NL'}).redirect,undefined);
assert.equal(visit({saved:'nl',languages:['en']}).redirect,undefined);
assert.equal(visit({saved:'en'}).redirect,'https://stenvera.com/en/');
assert.equal(visit({saved:'invalid',languages:['nl']}).redirect,undefined);
assert.equal(visit({url:'https://stenvera.com/en/',saved:'nl'}).redirect,undefined);
assert.equal(visit({url:'https://stenvera.com/?source=test#contact',languages:['en']}).redirect,'https://stenvera.com/en/?source=test#contact');
assert.equal(visit({url:'https://stenvera.com/?lang=nl',languages:['en'],blocked:true}).redirect,undefined);
assert.equal(visit({url:'https://stenvera.com/?lang=en',saved:'nl'}).redirect,'https://stenvera.com/en/?lang=en');
assert.equal(visit({blocked:true,languages:['en']}).redirect,'https://stenvera.com/en/');
const english=visit({url:'https://stenvera.com/en/?source=test#about',blocked:true});
assert.equal(english.languageLinks[0].href,'https://stenvera.com/?source=test&lang=nl#about');
english.location.hash='#contact';
english.languageLinks[0].click();
assert.equal(english.languageLinks[0].href,'https://stenvera.com/?source=test&lang=nl#contact');
assert.equal(visit({url:english.languageLinks[0].href,blocked:true,languages:['en']}).redirect,undefined);
const manual=visit({url:'https://stenvera.com/en/'});
manual.languageLinks[0].click();
assert.equal(manual.values.get('stenvera-language'),'nl');
assert.equal(visit({url:'https://stenvera.com/?lang=nl',saved:'en'}).values.get('stenvera-language'),'nl');
console.log('PASS: browser language order, fallback, saved/manual choices, direct URLs, blocked storage and query/hash preservation');
