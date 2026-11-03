import {readFile,writeFile,mkdir,copyFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {copy,policies,deletion,email} from '../src/content.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'docs');
const site='https://vlp3r.github.io/tallyoralabs-site/';
const routes=['','lumenfold','wonderleaf','support','privacy','lumenfold/privacy','lumenfold/delete-account','wonderleaf/privacy','wonderleaf/delete-account'];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span class="arrow" aria-hidden="true">↗</span>';
await mkdir(path.join(out,'assets'),{recursive:true});
for(const file of await readdir(path.join(root,'assets')))await copyFile(path.join(root,'assets',file),path.join(out,'assets',file));
await copyFile(path.join(root,'src/styles.css'),path.join(out,'assets/styles.css'));

function render(lang,route){
 const t=copy[lang],greek=lang==='el';
 const base='../'.repeat(route.split('/').filter(Boolean).length+(greek?1:0));
 const href=(r='',l=lang)=>base+(l==='el'?'el/':'')+(r&&r!=='404'?r+'/':'');
 const asset=n=>base+'assets/'+n;
 const absolute=(r='',l=lang)=>site+(l==='el'?'el/':'')+(r?r+'/':'');
 const button=(url,label,ghost=false)=>`<a class="button${ghost?' ghost':''}" href="${escape(url)}">${label}${arrow}</a>`;
 const policyLinks=app=>`<div class="policy-links"><a href="${href(app+'/privacy')}">${t.privacy}</a><a href="${href(app+'/delete-account')}">${t.deletion}</a><a href="${href('support')}">${t.support}</a></div>`;
 const brand=`<a class="brand" href="${href()}"><img src="${asset('tallyora-mark.png')}" alt="" width="41" height="41"><span>Tallyora<span>Labs</span></span></a>`;
 const header=`<a class="skip" href="#main">${t.skip}</a><header class="site-header"><nav class="wrap nav" aria-label="${greek?'Κύρια πλοήγηση':'Main navigation'}">${brand}<div class="nav-links"><a class="nav-games" href="${href()}#worlds">${t.games}</a><a href="${href('support')}">${t.support}</a><a class="lang" href="${href(route,greek?'en':'el')}" lang="${greek?'en':'el'}" hreflang="${greek?'en':'el'}">${t.language}</a></div></nav></header>`;
 const footer=`<footer class="site-footer"><div class="wrap"><div class="footer-top"><div>${brand}<p>${t.footer}</p></div><div class="footer-links"><a href="${href('lumenfold')}">LUMENFOLD</a><a href="${href('wonderleaf')}">Wonderleaf</a><a href="${href('support')}">${t.support}</a><a href="${href('privacy')}">${t.sitePrivacy}</a></div></div><div class="footer-bottom"><span>© 2026 TallyoraLabs · Stylianos Minoglou</span><a href="mailto:${email}">${email}</a></div></div></footer>`;
 const help=`<aside class="help"><div><h2>${t.helpTitle}</h2><p>${t.helpBody}</p></div>${button(href('support'),t.contact)}</aside>`;
 const emailBox=(subject,cta=t.send)=>`<div class="email-box"><span class="eyebrow">${t.emailLabel}</span><a class="email-address" href="mailto:${email}?subject=${encodeURIComponent(subject)}">${email}</a>${button('mailto:'+email+'?subject='+encodeURIComponent(subject),cta)}<p class="hint">${t.noMail}</p></div>`;
 let title,description,main;
 if(route===''){
  title=greek?'TallyoraLabs — Παιχνίδια & ιστορίες':'TallyoraLabs — Small worlds. Room to wonder.';description=t.intro;
  main=`<main id="main"><div class="wrap"><section class="hero"><div><p class="eyebrow">${t.eyebrow}</p><h1>${t.headline}</h1><p class="intro">${t.intro}</p>${button('#worlds',t.explore)}</div><div class="hero-art" aria-hidden="true"><div class="hero-lumen"><img src="${asset('lumenfold-world.svg')}" width="1000" height="800" alt="" fetchpriority="high"></div><div class="hero-book"><img src="${asset('wonderleaf-castle.svg')}" width="1000" height="800" alt=""></div><span class="orbit-label">${greek?'Φαντασία<br>& παιχνίδι':'Play.<br>Wonder.<br>Repeat.'}</span></div></section><section class="section" id="worlds"><div class="section-heading"><h2>${t.worldTitle}</h2><p>${t.worldIntro}</p></div><div class="games-grid">${['lumenfold','wonderleaf'].map(app=>{const lum=app==='lumenfold';return `<article class="game-card"><a class="art-link${lum?' dark':''}" href="${href(app)}" aria-label="${lum?'LUMENFOLD: Pocket Worlds':'Wonderleaf'}"><img src="${asset(lum?'lumenfold-world.svg':'wonderleaf-castle.svg')}" width="1000" height="800" alt="${lum?(greek?'Εικονογράφηση μικρού αιωρούμενου κόσμου με ενεργειακό πύργο':'Illustration of a floating island with a glowing energy tower'):(greek?'Το εικονογραφημένο κάστρο του Wonderleaf':'The illustrated castle from Wonderleaf')}" loading="lazy"><span class="pill">${t.inDevelopment}</span></a><p class="eyebrow">${lum?t.lumenTag:t.wonderTag}</p><h3>${lum?'LUMENFOLD: Pocket Worlds':'Wonderleaf'}</h3><p class="tagline">${lum?t.lumenDesc:t.wonderDesc}</p><p class="description">${lum?t.lumenBody:t.wonderBody}</p><a class="text-link" href="${href(app)}">${t.discover}${arrow}</a></article>`;}).join('')}</div></section><section class="section"><div class="studio"><div class="studio-mark" aria-hidden="true"><img src="${asset('tallyora-mark.png')}" width="135" height="135" alt="" loading="lazy"></div><div><p class="eyebrow">TALLYORALABS</p><h2>${t.studioTitle}</h2><p>${t.studioBody}</p><a class="text-link" href="mailto:${email}">${t.contact}${arrow}</a></div></div></section>${help}</div></main>`;
 }else if(route==='lumenfold'||route==='wonderleaf'){
  const lum=route==='lumenfold',name=lum?'LUMENFOLD: Pocket Worlds':'Wonderleaf',features=lum?t.lumenFeatures:t.wonderFeatures;
  title=name+' · TallyoraLabs';description=lum?t.lumenLead:t.wonderLead;
  main=`<main id="main" class="wrap"><section class="product-hero"><a class="back" href="${href()}#worlds">← ${t.back}</a><div class="product-layout"><div><p class="eyebrow">${lum?t.lumenTag:t.wonderTag}</p><h1>${lum?t.lumenTitle:t.wonderTitle}</h1><p class="lead">${description}</p><span class="eyebrow">${t.inDevelopment} · Android</span><p class="status">${lum?t.lumenStatus:t.wonderStatus}</p></div><figure class="product-art ${route}"><img src="${asset(lum?'lumenfold-world.svg':'wonderleaf-castle.svg')}" width="1000" height="800" alt="${lum?(greek?'Εικονογράφηση αιωρούμενου κόσμου LUMENFOLD':'LUMENFOLD floating-world illustration'):(greek?'Εικονογράφηση του κάστρου Wonderleaf':'Original Wonderleaf castle artwork')}"><figcaption class="caption">${lum?t.illustrated:'Wonderleaf'}</figcaption></figure></div></section><section class="features" aria-label="${greek?'Το παιχνίδι':'The experience'}">${features.map(([h,p],i)=>`<article class="feature"><span class="number">0${i+1}</span><h2>${h}</h2><p>${p}</p></article>`).join('')}</section><section class="policy-panel"><p class="eyebrow">${lum?'LUMENFOLD: POCKET WORLDS':t.forParents}</p><h2>${t.legalNav}</h2>${policyLinks(route)}</section>${help}</main>`;
 }else if(route==='support'){
  title=t.support+' · TallyoraLabs';description=t.supportIntro;
  main=`<main id="main" class="wrap"><section class="support-head"><p class="eyebrow">TALLYORALABS · ${t.support}</p><h1>${t.supportTitle}</h1><p>${t.supportIntro}</p></section><div class="support-grid"><div>${emailBox('TallyoraLabs support')}<p>${t.supportHint}</p><div class="notice">${t.supportChildren}</div></div><section><h2>${t.dataTitle}</h2><p>${t.dataIntro}</p>${['lumenfold','wonderleaf'].map(app=>`<div class="support-app"><h3>${app==='lumenfold'?'LUMENFOLD: Pocket Worlds':'Wonderleaf'}</h3>${policyLinks(app)}</div>`).join('')}</section></div></main>`;
 }else if(route==='404'){
  title='Page not found · TallyoraLabs';description='Return to the TallyoraLabs website.';
  main=`<main id="main" class="wrap missing"><p class="eyebrow">404</p><h1>${greek?'Αυτή η σελίδα δεν βρέθηκε.':'This page wandered off.'}</h1><p>${greek?'Οι κόσμοι μας βρίσκονται στην αρχική σελίδα.':'Find our worlds on the home page.'}</p>${button(href(),t.back)}</main>`;
 }else{
  const app=route.split('/')[0],isDeletion=route.endsWith('delete-account'),isSite=route==='privacy';
  const name=isSite?'TallyoraLabs':app==='lumenfold'?'LUMENFOLD: Pocket Worlds':'Wonderleaf';
  const data=isDeletion?deletion[lang][app]:null;
  const sections=data?data.sections:policies[lang][isSite?'website':app];
  const heading=data?data.title:(isSite?t.sitePrivacy:t.privacy+' · '+name);
  const updatedDate=app==='lumenfold'?'2026-11-03':'2026-11-02';
  const updatedLabel=app==='lumenfold'?(greek?'Τελευταία ενημέρωση: 3 Νοεμβρίου 2026':'Last updated: 3 November 2026'):t.updated;
  title=heading+' · TallyoraLabs';description=data?data.intro:(isSite?(greek?'Πώς λειτουργεί η ιστοσελίδα TallyoraLabs.':'How the TallyoraLabs website works.'):t.policyNote);
  const toc=sections.map(([h],i)=>`<a href="#section-${i+1}">${h}</a>`).join('');
  main=`<main id="main" class="wrap"><header class="legal-head"><a class="back" href="${href(isSite?'support':app)}">← ${name}</a><p class="eyebrow">${name}</p><h1>${heading}</h1><p class="date"><time datetime="${updatedDate}">${updatedLabel}</time></p><p class="summary">${description}</p></header><div class="legal-layout"><aside class="toc" aria-label="${greek?'Περιεχόμενα':'On this page'}"><p>${greek?'ΣΕ ΑΥΤΗ ΤΗ ΣΕΛΙΔΑ':'ON THIS PAGE'}</p>${toc}</aside><article class="legal-body">${!isDeletion&&!isSite?`<div class="notice">${t.policyNote}</div>`:''}${isDeletion?emailBox((app==='lumenfold'?'LUMENFOLD account':'Wonderleaf data')+' deletion',app==='lumenfold'?t.mailDelete:t.wonderDelete):''}${sections.map(([h,p],i)=>`<section id="section-${i+1}"><h2>${h}</h2>${p.startsWith('<ul>')?p:'<p>'+p+'</p>'}</section>`).join('')}<div class="policy-panel">${isSite?`<a href="${href('support')}">${t.support}</a>`:policyLinks(app)}</div></article></div></main>`;
 }
 return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#f7f6f0"><meta name="referrer" content="strict-origin-when-cross-origin"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'none'; connect-src 'none'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"><link rel="icon" href="${asset('tallyora-mark.png')}"><link rel="stylesheet" href="${asset('styles.css')}"><link rel="canonical" href="${absolute(route)}"><link rel="alternate" hreflang="en" href="${absolute(route,'en')}"><link rel="alternate" hreflang="el" href="${absolute(route,'el')}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${absolute(route)}"><meta property="og:image" content="${site}assets/tallyora-mark.png"></head><body>${header}${main}${footer}</body></html>`;
}
for(const lang of ['en','el'])for(const route of routes){
 const target=path.join(out,lang==='el'?'el':'',route);
 await mkdir(target,{recursive:true});await writeFile(path.join(target,'index.html'),render(lang,route));
}
await writeFile(path.join(out,'.nojekyll'),'');
// Use absolute project-relative links for the custom 404, whose incoming URL depth is unknown.
await writeFile(path.join(out,'404.html'),render('en','404').replaceAll('href="../','href="/tallyoralabs-site/').replaceAll('src="../','src="/tallyoralabs-site/'));
await writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site}sitemap.xml\n`);
await writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['en','el'].flatMap(lang=>routes.map(route=>`<url><loc>${site}${lang==='el'?'el/':''}${route?route+'/':''}</loc><lastmod>2026-10-30</lastmod></url>`)).join('')}</urlset>`);
console.log(`Built ${routes.length*2} bilingual pages and 404 into ${out}`);
