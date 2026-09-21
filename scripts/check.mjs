import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=fs.readdirSync(root).filter(name=>name.endsWith('.html'));
const sources=new Map(pages.map(name=>[name,fs.readFileSync(path.join(root,name),'utf8')]));
const problems=[];
let totalIds=0;
for(const [name,html] of sources){
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);totalIds+=ids.length;
  if(new Set(ids).size!==ids.length)problems.push(`${name}: identificadores duplicados.`);
  if([...html.matchAll(/<h1\b/g)].length!==1)problems.push(`${name}: debe tener un título principal.`);
  for(const [,asset] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    if(/^(https?:|mailto:|about:)/.test(asset))continue;
    const [beforeHash,anchor]=asset.split('#');
    const file=beforeHash.split('?')[0]||name;
    if(!fs.existsSync(path.join(root,file))){problems.push(`${name}: archivo ausente ${file}`);continue;}
    if(anchor&&sources.has(file)&&!sources.get(file).includes(`id="${anchor}"`))problems.push(`${name}: destino inexistente ${file}#${anchor}`);
  }
  if(html.includes('__MENU__')||html.includes('[ENLACE_'))problems.push(`${name}: marcador pendiente.`);
}
if(problems.length){console.error(problems.join('\n'));process.exit(1);}
console.log(`PRAM verificado: ${pages.length} páginas, ${totalIds} identificadores, destinos internos y recursos locales disponibles.`);
