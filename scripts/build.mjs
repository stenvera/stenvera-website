import { mkdir, rm, copyFile, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const output=join(root,'dist');
const source=join(root,'src');
const LINKEDIN='https://nl.linkedin.com/in/mark-veenstra-b87b6a74/nl';
const GITHUB_BRAND='https://github.com/Stenvera';
const GITHUB_USER='https://github.com/mark-veenstra';
const EMAIL='mark@stenvera.com';
const e=(s)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const icon=(name,klass='')=>`<svg class="icon ${klass}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;

const data={
  nl:{
    lang:'nl', ogLocale:'nl_NL', path:'/', other:'/en/', otherLabel:'English',
    metaTitle:'Mark Veenstra | Platform Engineering, AI & Homelab — Stenvera',
    metaDescription:'Ik ben Mark Veenstra. Ik bouw cloudplatformen, integraties, AI-oplossingen en projecten in mijn eigen homelab. Persoonlijke site van Stenvera.',
    nav:['Home','Over mij','Expertise','Projecten','Homelab','Contact'],
    skip:'Ga naar inhoud',navLabel:'Hoofdnavigatie',languageLabel:'Taal selecteren',themeLabel:'Kleurthema kiezen',light:'Licht',dark:'Donker',
    topLabel:'PLATFORM ENGINEERING / AI / AUTOMATION',heroTitle:'Mark Veenstra',
    heroSubtitle:'Platform Engineer <span aria-hidden="true">·</span> Integration Lead <span aria-hidden="true">·</span> AI & Automation Builder',
    heroBody:'Ik verbind mensen, software en cloudplatformen. Van integratie en developer experience tot AI, automatisering en experimenten op mijn eigen homelab.',
    careerIntro:'Vanaf 1 januari 2027 start ik bij <strong>ilionx</strong> als consultant.',
    linkedInButton:'Bekijk LinkedIn', githubStenvera:'GitHub / Stenvera', githubPersonal:'GitHub / mark-veenstra',contactButton:'Contact',
    heroCaption:'Nieuwsgierig, pragmatisch en graag zelf aan het bouwen.',
    expertiseTitle:'Wat ik doe',expertiseIntro:'Technologie moet waarde toevoegen — voor mensen, teams en organisaties.',
    skills:[
      {icon:'cloud',title:'Platform Engineering',body:'Betrouwbare, veilige en schaalbare cloudplatformen ontwerpen en bouwen met Azure, Kubernetes en DevOps.'},
      {icon:'code',title:'Integratie & API’s',body:'Systemen en data verbinden met heldere API’s, integratiepatronen en goed onderhoudbare software.'},
      {icon:'cpu',title:'AI & Automation',body:'AI-agents, automatisering en developer tooling onderzoeken, toepassen en bruikbaar maken.'},
      {icon:'home',title:'Homelab & Self-hosting',body:'Experimenteren en leren met Linux, Kubernetes, lokale AI en open-source diensten op eigen hardware.'},
    ],
    projectsTitle:'Mijn playground', projectsIntro:'Wat ik buiten én binnen werktijd graag ontdek en bouw.',allProjects:'Bekijk Stenvera op GitHub',
    projects:[
      {icon:'bot',title:'Lokale AI',state:'Experiment',body:'Lokale modellen, coding agents en AI-workflows verkennen met privacy en praktische toepasbaarheid voorop.',tags:['LLM','Agents','MCP']},
      {icon:'kube',title:'Kubernetes & cloud',state:'Actief',body:'Een plek om te testen met Kubernetes, GitOps, deployments, observability en Azure-achtige architectuur.',tags:['K8s','Cloudflare','GitOps']},
      {icon:'brand',title:'Stenvera-projecten',state:'In ontwikkeling',body:'Een thuisbasis voor eigen software, prototypes en automatisering — van eerste idee tot bruikbaar product.',tags:['TypeScript','Open source','Build'],href:GITHUB_BRAND},
      {icon:'frame',title:'Digitale fotolijst',state:'Concept / prototype',body:'Een slimme, local-first fotolijst met eigen hardware, familiealbums en optionele slimme functies.',tags:['Embedded','Local-first','UX']},
    ],
    aboutTitle:'Over mij',
    aboutBody:'Hoi, ik ben Mark. Ik woon in Friesland en werk al meer dan twintig jaar in softwareontwikkeling, integratie en platform engineering. Ik krijg energie van complexe vraagstukken begrijpelijk maken, teams verder helpen en oplossingen bouwen die écht werken.',
    aboutBody2:'Buiten mijn werk duik ik graag in AI, automatisering en mijn homelab. Daar kan ik naar hartenlust experimenteren met nieuwe technologie — soms serieus, soms gewoon omdat het leuk is.',
    aboutQuote:'Van idee naar prototype. Van prototype naar iets dat werkt.',
    experienceEyebrow:'EEN BEETJE ACHTERGROND',experienceTitle:'Mijn loopbaan',experienceIntro:'Een paar haltes op mijn route van softwareontwikkeling naar platform en technologie-leiderschap.',
    experience:[
      {years:'Jan 2027 →',org:'ilionx',role:'Consultant',body:'Nieuw hoofdstuk met integratie, automatisering en technologische innovatie.'},
      {years:'2020 — 2026',org:'Accell Group',role:'Lead Platform Engineer / Team Lead',body:'Integratie, data, Azure-platformen, developer enablement en AI & Automation.'},
      {years:'2014 — 2020',org:'Mobilea',role:'Development Lead',body:'Ontwikkeling en technische leiding binnen softwareteams.'},
      {years:'2003 — 2014',org:'Kewill · Minihouse · DIS Europe',role:'Software Development & Consultancy',body:'Mijn technische basis in engineering, consultancy en integratie.'},
    ],
    stackEyebrow:'MIJN TOOLBOX', stackTitle:'Waar ik mee werk',stackIntro:'Voor mij zijn tools een middel, geen doel. Dit zijn een paar vertrouwde bouwstenen.',
    stack:[['Cloud & platform',['Azure / AKS','Kubernetes','Linux','Traefik','Cloudflare']],['Software & integration',['TypeScript','Node.js','Fastify','APIs','MuleSoft']],['Engineering & AI',['GitHub Actions','Terraform','OpenTelemetry','LLMs','Agents / MCP']]],
    contactEyebrow:'ZEG EENS HALLO',contactTitle:'Leuk om kennis te maken.',contactIntro:'Een idee, vraag of zin om te sparren over platforms, integraties, AI of een homelab? Stuur gerust een bericht.',
    emailLabel:'Mail me',socialLabel:'Vind me online',copyright:'Gemaakt met aandacht, vanuit Friesland.',backTop:'Terug naar boven',
    portraitAlt:'Mark Veenstra glimlachend buiten, bij het water'
  },
  en:{
    lang:'en', ogLocale:'en_US', path:'/en/', other:'/', otherLabel:'Nederlands',
    metaTitle:'Mark Veenstra | Platform Engineering, AI & Homelab — Stenvera',
    metaDescription:'I’m Mark Veenstra. I build cloud platforms, integrations, AI solutions and projects in my own homelab. My personal Stenvera website.',
    nav:['Home','About','Expertise','Projects','Homelab','Contact'],
    skip:'Skip to content',navLabel:'Main navigation',languageLabel:'Select language',themeLabel:'Choose color theme',light:'Light',dark:'Dark',
    topLabel:'PLATFORM ENGINEERING / AI / AUTOMATION',heroTitle:'Mark Veenstra',
    heroSubtitle:'Platform Engineer <span aria-hidden="true">·</span> Integration Lead <span aria-hidden="true">·</span> AI & Automation Builder',
    heroBody:'I connect people, software and cloud platforms. From integration and developer experience to AI, automation and experiments in my own homelab.',
    careerIntro:'I’m joining <strong>ilionx</strong> as a consultant on 1 January 2027.',
    linkedInButton:'View LinkedIn', githubStenvera:'GitHub / Stenvera', githubPersonal:'GitHub / mark-veenstra',contactButton:'Contact',
    heroCaption:'Curious, pragmatic, and always eager to build things myself.',
    expertiseTitle:'What I do',expertiseIntro:'Technology should create value — for people, teams and organizations.',
    skills:[
      {icon:'cloud',title:'Platform Engineering',body:'Designing and building reliable, secure, scalable cloud platforms using Azure, Kubernetes and DevOps.'},
      {icon:'code',title:'Integration & APIs',body:'Connecting systems and data using clear APIs, integration patterns and maintainable software.'},
      {icon:'cpu',title:'AI & Automation',body:'Exploring and applying AI agents, automation and developer tooling to solve practical problems.'},
      {icon:'home',title:'Homelab & Self-hosting',body:'Experimenting and learning with Linux, Kubernetes, local AI and open-source services on my own hardware.'},
    ],
    projectsTitle:'Featured playground',projectsIntro:'Things I love to explore and build, inside and outside my day job.',allProjects:'Explore Stenvera on GitHub',
    projects:[
      {icon:'bot',title:'Local AI',state:'Experiment',body:'Exploring local models, coding agents and AI workflows with privacy and practical value in mind.',tags:['LLM','Agents','MCP']},
      {icon:'kube',title:'Kubernetes & cloud',state:'Active',body:'A place to test Kubernetes, GitOps, deployments, observability and Azure-style architecture.',tags:['K8s','Cloudflare','GitOps']},
      {icon:'brand',title:'Stenvera projects',state:'In development',body:'A home for personal software, prototypes and automation — from the first idea to something useful.',tags:['TypeScript','Open source','Build'],href:GITHUB_BRAND},
      {icon:'frame',title:'Digital photo frame',state:'Concept / prototype',body:'A smart, local-first digital photo frame with custom hardware, family albums and optional intelligent features.',tags:['Embedded','Local-first','UX']},
    ],
    aboutTitle:'About me',
    aboutBody:'Hi, I’m Mark. I live in Friesland in the Netherlands and have worked in software development, integration and platform engineering for more than twenty years. I enjoy making complex problems understandable, helping teams move forward and building solutions that actually work.',
    aboutBody2:'Outside work, I enjoy diving into AI, automation and my homelab. It gives me room to experiment with emerging technologies — sometimes with a serious purpose, sometimes simply because it’s fun.',
    aboutQuote:'From idea to prototype. From prototype to something that works.',
    experienceEyebrow:'A LITTLE BACKGROUND',experienceTitle:'My journey',experienceIntro:'A few milestones on my journey from software development to platform and technology leadership.',
    experience:[
      {years:'Jan 2027 →',org:'ilionx',role:'Consultant',body:'A new chapter involving integration, automation and technology innovation.'},
      {years:'2020 — 2026',org:'Accell Group',role:'Lead Platform Engineer / Team Lead',body:'Integration, data, Azure platforms, developer enablement and AI & Automation.'},
      {years:'2014 — 2020',org:'Mobilea',role:'Development Lead',body:'Software development and technical leadership within engineering teams.'},
      {years:'2003 — 2014',org:'Kewill · Minihouse · DIS Europe',role:'Software Development & Consultancy',body:'My technical foundations in engineering, consulting and integration.'},
    ],
    stackEyebrow:'MY TOOLBOX',stackTitle:'Technologies I work with',stackIntro:'Tools are a means to an end. Here are a few familiar building blocks.',
    stack:[['Cloud & platform',['Azure / AKS','Kubernetes','Linux','Traefik','Cloudflare']],['Software & integration',['TypeScript','Node.js','Fastify','APIs','MuleSoft']],['Engineering & AI',['GitHub Actions','Terraform','OpenTelemetry','LLMs','Agents / MCP']]],
    contactEyebrow:'SAY HELLO',contactTitle:'Let’s connect.',contactIntro:'Have an idea, a question, or want to talk platforms, integration, AI or homelabs? Feel free to get in touch.',
    emailLabel:'Email me',socialLabel:'Find me online',copyright:'Thoughtfully built in Friesland, the Netherlands.',backTop:'Back to top',
    portraitAlt:'Mark Veenstra smiling outdoors by the water'
  }
};
function symbols(){return `<svg aria-hidden="true" class="svg-sprite" xmlns="http://www.w3.org/2000/svg"><defs>
<symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></symbol>
<symbol id="icon-moon" viewBox="0 0 24 24"><path d="M20.7 13.1A9 9 0 0 1 10.9 3.3 9 9 0 1 0 20.7 13.1Z"/></symbol>
<symbol id="icon-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
<symbol id="icon-external" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></symbol>
<symbol id="icon-mail" viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></symbol>
<symbol id="icon-cloud" viewBox="0 0 24 24"><path d="M7.2 18H18a4.5 4.5 0 0 0 0-9h-.8a6.8 6.8 0 0 0-13 2.3A3.6 3.6 0 0 0 7.2 18Z"/></symbol>
<symbol id="icon-code" viewBox="0 0 24 24"><path d="m8 5-7 7 7 7M16 5l7 7-7 7M14 2l-4 20"/></symbol>
<symbol id="icon-cpu" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4m6-4v4M9 19v4m6-4v4M19 9h4m-4 6h4M1 9h4m-4 6h4"/></symbol>
<symbol id="icon-home" viewBox="0 0 24 24"><path d="m2 11 10-9 10 9M4 10v11h16V10M9 21v-7h6v7"/></symbol>
<symbol id="icon-bot" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="4"/><path d="M12 7V3m-2 0h4M7.5 13h.1m8.8 0h.1M9 17c2 1 4 1 6 0"/></symbol>
<symbol id="icon-kube" viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7Z"/><path d="m12 6 2 5 5 1-5 2-2 5-2-5-5-2 5-1 2-5Zm0 0v16M3 7l18 10M21 7 3 17"/></symbol>
<symbol id="icon-frame" viewBox="0 0 24 24"><rect x="2.5" y="3" width="19" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 18 6-6 4 3 3-3 5 5"/></symbol>
<symbol id="icon-github" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.06c-3.09.67-3.75-1.3-3.75-1.3-.5-1.27-1.23-1.61-1.23-1.61-1-.69.08-.68.08-.68 1.1.08 1.69 1.13 1.69 1.13.97 1.66 2.55 1.18 3.18.9.1-.7.39-1.18.71-1.45-2.47-.28-5.07-1.24-5.07-5.5 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.61 0C15.64 4.4 16.57 4.7 16.57 4.7c.62 1.54.23 2.68.12 2.96.72.78 1.15 1.78 1.15 3 0 4.27-2.6 5.22-5.08 5.49.4.36.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></symbol>
<symbol id="icon-linkedin" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM7.9 18.8H5.1V9.7h2.8Zm-1.4-10.3a1.62 1.62 0 1 1 0-3.24 1.62 1.62 0 0 1 0 3.24Zm12.3 10.3h-2.8v-4.4c0-1.05-.02-2.4-1.47-2.4-1.47 0-1.7 1.14-1.7 2.33v4.47H10V9.7h2.7v1.24h.04c.38-.71 1.3-1.47 2.67-1.47 2.86 0 3.39 1.88 3.39 4.33Z"/></symbol>
</defs></svg>`}
const link=(url,contents,classes='',label='')=>`<a class="${classes}" href="${e(url)}"${url.startsWith('http')?' target="_blank" rel="noopener noreferrer"':''}${label?` aria-label="${e(label)}"`:''}>${contents}</a>`;
function makePage(d){
 const nl = d.lang==='nl';
 const navHrefs=['#top','#about','#expertise','#projects','#homelab','#contact'];
 const skillCards=d.skills.map(s=>`<article class="skill-card"><div class="skill-icon">${icon(s.icon)}</div><div><h3>${e(s.title)}</h3><p>${e(s.body)}</p></div></article>`).join('');
 const projectCards=d.projects.map((p,i)=>`<article class="project-card"${i===1?' id="homelab"':''}>
 <div class="project-head"><div class="project-icon ${p.icon==='brand'?'brand-project':''}">${p.icon==='brand'?'<img src="/brand.svg" width="31" height="31" alt=""/>':icon(p.icon)}</div><span class="project-status">${e(p.state)}</span></div>
 <h3>${p.href?link(p.href,e(p.title)+icon('external','tiny'),'project-link'):e(p.title)}</h3><p>${e(p.body)}</p>
 <div class="tag-list">${p.tags.map(t=>`<span>${e(t)}</span>`).join('')}</div></article>`).join('');
 const experiences=d.experience.map(item=>`<article class="timeline-item"><span class="timeline-year">${e(item.years)}</span><div class="timeline-content"><span class="timeline-org">${e(item.org)}</span><h3>${e(item.role)}</h3><p>${e(item.body)}</p></div></article>`).join('');
 const stack=d.stack.map(([label,tags])=>`<div class="stack-column"><h3>${e(label)}</h3><div class="stack-tags">${tags.map(t=>`<span>${e(t)}</span>`).join('')}</div></div>`).join('');
 return `<!doctype html>
<html lang="${d.lang}" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(d.metaTitle)}</title><meta name="description" content="${e(d.metaDescription)}">
<link rel="canonical" href="https://stenvera.com${d.path}">
<link rel="alternate" hreflang="nl" href="https://stenvera.com/">
<link rel="alternate" hreflang="en" href="https://stenvera.com/en/">
<link rel="alternate" hreflang="x-default" href="https://stenvera.com/">
<meta property="og:type" content="profile"><meta property="og:site_name" content="Stenvera"><meta property="og:locale" content="${d.ogLocale}"><meta property="og:title" content="${e(d.metaTitle)}"><meta property="og:description" content="${e(d.metaDescription)}"><meta property="og:image" content="https://stenvera.com/og-image.png"><meta property="og:url" content="https://stenvera.com${d.path}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#071525">
<link rel="stylesheet" href="/styles.css"><link rel="preload" as="image" href="/mark-veenstra.webp">
<script>try{const s=localStorage.getItem('stenvera-theme');const v=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=v;}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}</script>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Person',name:'Mark Veenstra',url:'https://stenvera.com/',image:'https://stenvera.com/mark-veenstra.webp',sameAs:[LINKEDIN,GITHUB_USER,GITHUB_BRAND],knowsAbout:['Platform Engineering','Integration','Cloud','Azure','Kubernetes','AI','Automation']}).replaceAll('<','\\u003c')}</script>
<script src="/app.js" defer></script>
</head><body>
${symbols()}
<a href="#main" class="skip-link">${e(d.skip)}</a>
<header class="site-header"><div class="header-inner layout-width">
 <a class="brand" href="${d.path}#top" aria-label="Stenvera home"><img src="/brand.svg" width="45" height="45" alt=""/><span>Stenvera</span></a>
 <nav aria-label="${e(d.navLabel)}" class="main-nav">${d.nav.map((label,i)=>`<a class="nav-item${i===0?' current':''}" href="${navHrefs[i]}"${i===0?' aria-current="page"':''}>${e(label)}</a>`).join('')}</nav>
 <div class="header-controls"><div class="language-switch" role="group" aria-label="${e(d.languageLabel)}">
 ${link('/', 'NL','lang-link'+(nl?' selected':''), 'Nederlands')}
 ${link('/en/','EN','lang-link'+(!nl?' selected':''),'English')}
 </div>
 <div class="theme-switch" role="group" aria-label="${e(d.themeLabel)}"><button type="button" class="theme-btn" data-set-theme="light" aria-pressed="false" title="${e(d.light)}">${icon('sun')}<span>${e(d.light)}</span></button><button type="button" class="theme-btn" data-set-theme="dark" aria-pressed="false" title="${e(d.dark)}">${icon('moon')}<span>${e(d.dark)}</span></button></div></div>
 </div></header>
<main id="main">
 <section class="hero" id="top" aria-labelledby="hero-title"><div class="hero-waves" aria-hidden="true"></div><div class="layout-width hero-grid">
 <div class="hero-copy"><div class="accent-line"></div><p class="hero-eyebrow">${e(d.topLabel)}</p><h1 id="hero-title">${e(d.heroTitle)}</h1>
 <p class="hero-subtitle">${d.heroSubtitle}</p><p class="hero-lead">${e(d.heroBody)}</p><p class="hero-career">${d.careerIntro}</p>
 <div class="hero-actions">${link(LINKEDIN,icon('linkedin')+`<span>${e(d.linkedInButton)}</span>`+icon('external','tiny'),'button primary',d.linkedInButton)}
 ${link(GITHUB_BRAND,icon('github')+`<span>${e(d.githubStenvera)}</span>`+icon('external','tiny'),'button secondary',d.githubStenvera)}
 ${link(GITHUB_USER,icon('github')+`<span>${e(d.githubPersonal)}</span>`+icon('external','tiny'),'button secondary',d.githubPersonal)}
 ${link('#contact',icon('mail')+`<span>${e(d.contactButton)}</span>`,'button outline',d.contactButton)}
 </div><p class="hero-caption"><span class="caption-dot"></span>${e(d.heroCaption)}</p></div>
 <div class="hero-portrait-wrap"><div class="portrait-deco" aria-hidden="true"></div><img class="hero-portrait" src="/mark-veenstra.webp" alt="${e(d.portraitAlt)}" width="800" height="999" fetchpriority="high" decoding="async"></div>
 </div></section>
 <section class="section skills-section" id="expertise" aria-labelledby="skills-title"><div class="layout-width"><div class="section-title-wrap"><div><h2 id="skills-title">${e(d.expertiseTitle)}</h2><span class="section-underline" aria-hidden="true"></span></div><p class="section-intro">${e(d.expertiseIntro)}</p></div>
 <div class="skills-grid">${skillCards}</div></div></section>
 <section class="section projects-section" id="projects" aria-labelledby="projects-title"><div class="layout-width"><div class="section-title-wrap"><div><h2 id="projects-title">${e(d.projectsTitle)}</h2><span class="section-underline" aria-hidden="true"></span></div>${link(GITHUB_BRAND,e(d.allProjects)+icon('arrow'),'text-link')}</div><p class="section-intro projects-intro">${e(d.projectsIntro)}</p>
 <div class="project-grid">${projectCards}</div></div></section>
 <section class="about-section" id="about" aria-labelledby="about-title"><div class="layout-width about-grid"><div><h2 id="about-title">${e(d.aboutTitle)}</h2><span class="section-underline" aria-hidden="true"></span></div><div class="about-text"><p>${e(d.aboutBody)}</p><p>${e(d.aboutBody2)}</p><blockquote>${e(d.aboutQuote)}</blockquote></div></div></section>
 <section class="section experience-section" id="experience" aria-labelledby="experience-title"><div class="layout-width experience-layout"><div class="experience-intro"><p class="eyebrow">${e(d.experienceEyebrow)}</p><h2 id="experience-title">${e(d.experienceTitle)}</h2><span class="section-underline" aria-hidden="true"></span><p>${e(d.experienceIntro)}</p></div><div class="timeline">${experiences}</div></div></section>
 <section class="section stack-section" aria-labelledby="stack-title"><div class="layout-width"><p class="eyebrow">${e(d.stackEyebrow)}</p><h2 id="stack-title">${e(d.stackTitle)}</h2><span class="section-underline" aria-hidden="true"></span><p class="section-intro stack-intro">${e(d.stackIntro)}</p><div class="stack-grid">${stack}</div></div></section>
 <section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="layout-width contact-panel"><div class="contact-copy"><p class="eyebrow">${e(d.contactEyebrow)}</p><h2 id="contact-title">${e(d.contactTitle)}</h2><p>${e(d.contactIntro)}</p><div class="contact-actions">${link(`mailto:${EMAIL}`,icon('mail')+`<span>${e(EMAIL)}</span>`,'button primary dark-button',d.emailLabel)}${link(LINKEDIN,icon('linkedin')+`<span>LinkedIn</span>`+icon('external','tiny'),'button contact-secondary')}</div></div><div class="contact-art" aria-hidden="true">&lt;/&gt;</div></div></section>
</main>
<footer class="site-footer"><div class="layout-width footer-inner"><div class="footer-brand"><img src="/brand.svg" width="36" height="36" alt=""/><strong>Stenvera</strong></div><div class="footer-links">${link(`mailto:${EMAIL}`,icon('mail')+e(EMAIL))}${link(LINKEDIN,icon('linkedin')+'LinkedIn')}${link(GITHUB_BRAND,icon('github')+'Stenvera')}${link(GITHUB_USER,icon('github')+'mark-veenstra')}</div></div><div class="layout-width footer-bottom"><p>© <span id="year">2026</span> Stenvera · ${e(d.copyright)}</p><a href="#top">${e(d.backTop)} ↑</a></div></footer>
</body></html>`;
}
await rm(output,{recursive:true,force:true});
await mkdir(join(output,'en'),{recursive:true});
for(const f of ['styles.css','app.js','brand.svg','favicon.svg','landscape.svg','mark-veenstra.webp','apple-touch-icon.png','og-image.png','robots.txt','_headers']) await copyFile(join(source,f),join(output,f));
await writeFile(join(output,'index.html'),makePage(data.nl));
await writeFile(join(output,'en','index.html'),makePage(data.en));
await writeFile(join(output,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Not found — Stenvera</title><link rel="stylesheet" href="/styles.css"></head><body><main class="not-found"><img src="/brand.svg" alt="Stenvera" width="80" height="80"><h1>404</h1><p>That page doesn't exist / Deze pagina bestaat niet.</p><a class="button primary" href="/">Go to homepage</a></main></body></html>`);
await writeFile(join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>https://stenvera.com/</loc><xhtml:link rel="alternate" hreflang="nl" href="https://stenvera.com/"/><xhtml:link rel="alternate" hreflang="en" href="https://stenvera.com/en/"/></url><url><loc>https://stenvera.com/en/</loc><xhtml:link rel="alternate" hreflang="nl" href="https://stenvera.com/"/><xhtml:link rel="alternate" hreflang="en" href="https://stenvera.com/en/"/></url></urlset>`);
console.log(`Built Stenvera: ${output} (NL + EN)`);
