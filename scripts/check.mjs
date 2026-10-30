import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../docs/',import.meta.url)));
async function files(dir){return(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const html=(await files(root)).filter(f=>f.endsWith('.html'));
let links=0;
for(const file of html){
 const text=await readFile(file,'utf8');
 assert.match(text,/<html lang="(en|el)">/);assert.equal((text.match(/<h1[ >]/g)||[]).length,1,`${file}: one h1`);
 assert(!/<script|<form|<iframe/i.test(text),`${file}: no scripts, forms or embeds`);
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  let target=match[1];if(/^(https?:|mailto:|data:)/.test(target))continue;
  if(target.startsWith('#')){assert(text.includes(`id="${target.slice(1)}"`),`${file}: missing anchor ${target}`);continue;}
  const [resource,anchor]=target.split('#');
  const local=resource.startsWith('/tallyoralabs-site/')?path.join(root,resource.slice('/tallyoralabs-site/'.length)):path.resolve(path.dirname(file),resource);
  assert(local===root||local.startsWith(root+path.sep),`${file}: link escapes site`);
  const s=await stat(local).catch(()=>null);assert(s,`${file}: missing resource ${target}`);
  if(anchor){const content=await readFile(s.isDirectory()?path.join(local,'index.html'):local,'utf8');assert(content.includes(`id="${anchor}"`),`${file}: missing target anchor ${target}`);}
  links++;
 }
}
for(const file of (await files(path.join(root,'assets'))).filter(f=>f.endsWith('.svg'))){
 const svg=await readFile(file,'utf8');assert(!/<script|<foreignObject|https?:\/\/(?!www.w3.org)/i.test(svg),`${file}: SVG must be self-contained`);
}
console.log(`PASS: ${html.length} HTML pages; ${links} local links/assets; language, headings, anchors, static privacy and self-contained SVG checks.`);
