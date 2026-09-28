import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagePath = path.join(root, 'index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const problems = [];

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) problems.push(`Identificadores duplicados: ${duplicateIds.join(', ')}`);

if ([...html.matchAll(/<h1\b/g)].length !== 1) {
  problems.push('index.html debe tener exactamente un título principal h1.');
}

for (const [, target] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (/^(https?:|mailto:|tel:|data:)/.test(target)) continue;
  if (target.startsWith('#')) {
    const anchor = decodeURIComponent(target.slice(1));
    if (anchor && !ids.includes(anchor)) problems.push(`Destino interno inexistente: ${target}`);
    continue;
  }
  const file = target.split(/[?#]/)[0];
  if (file && !fs.existsSync(path.join(root, file))) problems.push(`Recurso ausente: ${file}`);
}

for (const [index, match] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].entries()) {
  try {
    new vm.Script(match[1], { filename: `index.html:script-${index + 1}` });
  } catch (error) {
    problems.push(`JavaScript inválido en bloque ${index + 1}: ${error.message}`);
  }
}

if (/\[ENLACE_|\[@usuario\]/.test(html)) problems.push('Queda un marcador de contenido pendiente.');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(`PRAM verificado: 1 página, ${ids.length} identificadores, recursos y JavaScript correctos.`);
