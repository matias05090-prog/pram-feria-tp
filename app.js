'use strict';

/* PRAM stores demonstration data only in this browser. No remote requests. */
const STORAGE_KEY = 'pram-feria-tp-v1';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const dateLabel = value => new Intl.DateTimeFormat('es-CL', {dateStyle:'medium'}).format(new Date(value.length === 10 ? `${value}T12:00:00` : value));
const uid = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
const emptyState = () => ({version:1,ratings:[],cases:[],experiences:[],ideas:[],priorities:[],protocols:{},demoLoaded:false});
const isText = value => typeof value === 'string';
const isDate = value => isText(value) && Number.isFinite(Date.parse(value));
function validSavedData(saved) {
  return saved && saved.version === 1 && ['ratings','cases','experiences','ideas','priorities'].every(k=>Array.isArray(saved[k])) && saved.protocols && typeof saved.protocols === 'object'
    && saved.ratings.every(r=>r && Number.isInteger(r.rating) && r.rating>=1 && r.rating<=5)
    && saved.cases.every(c=>c && ['id','name','owner','description','category','channel','priority','status','resolution'].every(k=>isText(c[k])) && ['Abierto','En revisión','Resuelto'].includes(c.status) && isDate(c.createdAt) && isDate(c.due) && Array.isArray(c.history) && c.history.every(h=>h && isDate(h.at) && isText(h.status) && isText(h.note)))
    && saved.experiences.every(e=>e && ['name','comment','image'].every(k=>isText(e[k])) && isDate(e.createdAt))
    && saved.ideas.every(i=>i && ['id','title','description','category','effort','firstStep'].every(k=>isText(i[k])))
    && Object.values(saved.protocols).every(p=>p && Array.isArray(p.checked) && p.checked.every(i=>Number.isInteger(i)&&i>=0&&i<5) && isText(p.owner) && isText(p.commitment));
}
let state = emptyState();
let storageBlocked = false;
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const saved = JSON.parse(raw);
    if (!validSavedData(saved)) throw new Error('Datos no compatibles');
    state = {...emptyState(), ...saved};
  }
} catch (_) { storageBlocked = true; }

function showMessage(id, text, error = false) { const el = $(`#${id}`); el.textContent = text; el.classList.toggle('error', error); }
let toastTimer;
function toast(text) { const el = $('#toast'); el.textContent = text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 4200); }
function storageWarning() {
  const note = $('#storageNote'); if (!note) return;
  note.textContent = 'No se pudo acceder al almacenamiento local. Los registros anteriores no se han sobrescrito. Descarga un respaldo de esta sesión; si deseas empezar de nuevo, usa «Borrar datos de la demo».';
  note.classList.add('error');
}
if (storageBlocked) storageWarning();
function save() {
  if (storageBlocked) return false;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch (_) { storageBlocked = true; storageWarning(); toast('No se pudo guardar en el navegador. Descarga un respaldo de esta sesión.'); return false; }
}
function saveLabel(saved) { return saved ? 'Guardado en este navegador.' : 'Registrado solo en memoria: descarga un respaldo antes de cerrar.'; }
function download(name, text, type='text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Navigation and native tab keyboard support.
const menuToggle = $('#menuToggle');
function closeMenu() { $('#mainNav')?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded','false'); }
menuToggle?.addEventListener('click', () => { const open = $('#mainNav').classList.toggle('open'); menuToggle.setAttribute('aria-expanded',String(open)); });
$$('#mainNav a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
function bindTabs(selector, activate, vertical = false) {
  const tabs = $$(selector);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index+1)%tabs.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index+tabs.length-1)%tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length-1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next]); tabs[next].focus(); }
    });
  });
}
function selectTab(selector, chosen) { $$(selector).forEach(tab => { const selected = tab === chosen; tab.setAttribute('aria-selected',String(selected)); tab.tabIndex = selected ? 0 : -1; }); }
function openTool(key, focus = false) {
  const tab = $(`[data-tool="${key}"]`); selectTab('[data-tool]',tab);
  $$('.workspace-pane').forEach(panel => { panel.hidden = panel.id !== `pane-${key}`; });
  if (focus) tab.focus();
}
bindTabs('[data-tool]', tab => openTool(tab.dataset.tool));

const model = {
  cliente:['Cliente','Sus necesidades, expectativas y opiniones orientan las decisiones. Preguntar, escuchar y confirmar son el punto de partida.'],
  estrategia:['Estrategia del servicio','Define la experiencia que la pyme promete: atención clara, respetuosa y coherente. Establece compromisos realistas para todos los canales.'],
  personas:['Colaboradores preparados','El equipo necesita conocer los productos, practicar la escucha y saber a quién derivar. La coordinación hace posible cumplir la promesa.'],
  sistemas:['Sistemas que apoyan','Información actualizada, registro de casos y seguimiento de compromisos ayudan a que la atención funcione incluso cuando cambia el turno.']
};
$$('[data-model]').forEach(button => button.addEventListener('click', () => {
  $$('[data-model]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  const [title,text] = model[button.dataset.model]; $('#modelDetail').innerHTML = `<h4>${title}</h4><p>${text}</p>`;
}));

const protocols = {
  atencion:{title:'Atención al cliente',intro:'Una bienvenida cercana, información clara y un acuerdo que la persona pueda entender.',steps:[['Preparar el canal','Revisar horarios, carta, disponibilidad y condiciones antes de atender.'],['Recibir con disposición','Saludar, presentarse y preguntar cómo se puede ayudar.'],['Escuchar y confirmar','Comprender la necesidad y resumirla para evitar malentendidos.'],['Explicar las opciones','Informar alternativas, costos y tiempos que el equipo pueda cumplir.'],['Cerrar con claridad','Confirmar el pedido o acuerdo, agradecer e indicar el siguiente paso.']],phrase:'“Gracias por visitarnos. Para ayudarte mejor, confirmemos lo que necesitas y las opciones disponibles.”'},
  reclamos:{title:'Gestión de reclamos',intro:'Cada reclamo merece una respuesta respetuosa y una acción concreta, sin depender de la calificación del cliente.',steps:[['Escuchar sin interrumpir','Agradecer el aviso, reconocer la experiencia y evitar discusiones o culpas.'],['Registrar los hechos','Anotar fecha, canal, motivo y antecedentes necesarios. Evitar datos sensibles.'],['Asignar y priorizar','Definir un responsable. Si hay un riesgo inmediato para una persona, avisar de inmediato al encargado.'],['Investigar y acordar','Revisar los antecedentes, proponer una alternativa viable y acordar un plazo de respuesta.'],['Confirmar el compromiso','Explicar qué ocurrirá, por qué canal se responderá y cómo se realizará el seguimiento.']],phrase:'“Lamentamos lo ocurrido. Voy a registrar tu caso, revisarlo con la persona responsable e informarte el próximo paso.”'},
  seguimiento:{title:'Seguimiento y cierre',intro:'Resolver incluye confirmar la acción, dejar registro y aprender para que la dificultad no se repita.',steps:[['Revisar el compromiso','Comprobar el estado del caso y actuar antes de la fecha acordada.'],['Comunicar el avance','Informar lo realizado. Si se requiere más tiempo, explicar el motivo y acordar una nueva fecha.'],['Verificar la solución','Confirmar que la acción se ejecutó y escuchar cómo la recibió la persona.'],['Documentar el cierre','Registrar la solución, fecha y responsable. No marcar como resuelto sin una acción documentada.'],['Convertir el caso en mejora','Identificar la causa, proponer una prevención y revisarla con el equipo.']],phrase:'“Ya realizamos la acción acordada. Queremos confirmar cómo resultó y qué más podemos aprender de tu experiencia.”'}
};
let currentProtocol = ['atencion','reclamos','seguimiento'].includes(new URLSearchParams(location.search).get('tipo')) ? new URLSearchParams(location.search).get('tipo') : 'atencion';
function protocolData() { return state.protocols[currentProtocol] || {checked:[],owner:'',commitment:''}; }
function renderProtocol() {
  if (!$('#protocolPanel')) return;
  selectTab('[data-protocol]', $(`[data-protocol="${currentProtocol}"]`));
  const p = protocols[currentProtocol], saved = protocolData();
  $('#protocolTitle').textContent = p.title; $('#protocolIntro').textContent = p.intro;
  $('#protocolPanel').setAttribute('aria-labelledby',`tab-${currentProtocol}`);
  $('#protocolSteps').innerHTML = p.steps.map(([title,desc],index) => `<label class="protocol-step"><input type="checkbox" data-step="${index}" ${saved.checked.includes(index)?'checked':''}><span><strong>${String(index+1).padStart(2,'0')}. ${title}</strong><small>${desc}</small></span></label>`).join('');
  $('#protocolPhrase').textContent = p.phrase;
  $('#protocolSettings').elements.owner.value = saved.owner;
  $('#protocolSettings').elements.commitment.value = saved.commitment;
  updateProtocolProgress(); showMessage('protocolMessage','');
}
function updateProtocolProgress() { const count = $$('#protocolSteps input:checked').length; $('#protocolProgress').value = count; $('#protocolProgressText').textContent = `${count} de 5 pasos completados`; }
function chooseProtocol(key) { currentProtocol=key; selectTab('[data-protocol]',$(`[data-protocol="${key}"]`)); renderProtocol(); }
bindTabs('[data-protocol]', tab => chooseProtocol(tab.dataset.protocol),true);
$('#protocolSteps')?.addEventListener('change',() => { state.protocols[currentProtocol]={...protocolData(),checked:$$('#protocolSteps input:checked').map(i=>Number(i.dataset.step))}; const saved=save(); updateProtocolProgress(); showMessage('protocolMessage',saveLabel(saved),!saved); });
$('#protocolSettings')?.addEventListener('submit',event => { event.preventDefault(); const form=event.currentTarget; state.protocols[currentProtocol]={...protocolData(),owner:form.elements.owner.value.trim(),commitment:form.elements.commitment.value.trim()}; const saved=save(); showMessage('protocolMessage',saveLabel(saved),!saved); });
$('#downloadProtocol')?.addEventListener('click', () => {
  const p=protocols[currentProtocol],data=protocolData();
  download(`PRAM-protocolo-${currentProtocol}.txt`, `PRAM · FERIA TP\n${p.title.toUpperCase()}\n\n${p.intro}\n\nResponsable: ${data.owner || 'Por definir'}\nPrimera respuesta: ${data.commitment || 'Por acordar'}\nCompromisos internos propuestos; no constituyen plazos legales.\n\n${p.steps.map(([title,text],index)=>`${data.checked.includes(index)?'[x]':'[ ]'} ${index+1}. ${title}\n${text}`).join('\n\n')}\n\nFrase guía: ${p.phrase}\n\nRevisar y adaptar con el equipo antes de implementar.\n`);
});
$('#seeComplaintProtocol')?.addEventListener('click',()=>chooseProtocol('reclamos'));

function renderMetrics() {
  if (!$('#metricRatings')) return;
  const total=state.ratings.length, cases=state.cases.length, resolved=state.cases.filter(c=>c.status==='Resuelto').length;
  $('#metricRatings').textContent=String(total);
  $('#metricAverage').textContent=total?(state.ratings.reduce((n,r)=>n+r.rating,0)/total).toLocaleString('es-CL',{minimumFractionDigits:1,maximumFractionDigits:1}):'—';
  $('#metricOpen').textContent=String(cases-resolved);
  $('#metricResolved').textContent=cases?`${Math.round(resolved/cases*100)}%`:'—';
  $('#metricResolvedDetail').textContent=cases?`${resolved} de ${cases} casos`:'sin casos registrados';
  $('#caseCount').textContent=String(cases);
  $('#loadDemo').disabled=state.demoLoaded;
  $('#loadDemo').textContent=state.demoLoaded?'Ejemplo de feria cargado ✓':'Cargar ejemplo de feria ↗';
}
const ratingLabels=['','Muy insatisfecho','Insatisfecho','Regular','Satisfecho','Muy satisfecho'];
$('#ratingForm')?.addEventListener('change',event => { if(event.target.name!=='rating')return; const value=Number(event.target.value); $$('.star-rating label').forEach((l,i)=>l.classList.toggle('filled',i<value)); $('#ratingLabel').textContent=`${value} de 5 · ${ratingLabels[value]}`; });
$('#ratingForm')?.addEventListener('submit',event => {
  event.preventDefault(); const form=event.currentTarget, data=new FormData(form), rating=Number(data.get('rating'));
  if(rating<1||rating>5){showMessage('ratingMessage','Selecciona una calificación.',true);return;}
  state.ratings.push({id:uid('EVAL'),rating,channel:data.get('channel'),comment:data.get('comment').trim(),createdAt:new Date().toISOString()});
  const saved=save(); renderMetrics(); form.reset(); $$('.star-rating label').forEach(l=>l.classList.remove('filled')); $('#ratingLabel').textContent='Selecciona de 1 a 5 estrellas.';
  showMessage('ratingMessage',`Gracias por compartir tu experiencia. ${saveLabel(saved)}`,!saved);
});

if ($('#caseForm')) $('#caseForm').elements.due.min=today();
$('#caseForm')?.addEventListener('submit',event => {
  event.preventDefault(); const form=event.currentTarget, data=Object.fromEntries(new FormData(form));
  if(data.description.trim().length<10 || !data.owner.trim()){showMessage('caseMessage','Describe la situación e indica un responsable.',true);return;}
  if(data.due<today()){showMessage('caseMessage','El compromiso debe ser hoy o una fecha futura.',true);return;}
  const now=new Date().toISOString(), id=uid('PRAM');
  state.cases.unshift({...data,name:data.name.trim(),owner:data.owner.trim(),description:data.description.trim(),id,createdAt:now,updatedAt:now,status:'Abierto',resolution:'',history:[{at:now,status:'Abierto',note:'Caso registrado'}]});
  const saved=save(); renderMetrics(); renderCases(); form.reset();
  showMessage('caseMessage',`Caso ${id} registrado. Puedes revisarlo en «Seguimiento de casos». ${saveLabel(saved)}`,!saved);
});
function renderCases() {
  if (!$('#caseList')) return;
  const query=$('#caseSearch').value.trim().toLocaleLowerCase('es'), filter=$('#caseFilter').value;
  const rows=state.cases.filter(c=>(filter==='todos'||c.status===filter)&&[c.id,c.name,c.owner,c.category,c.description].join(' ').toLocaleLowerCase('es').includes(query));
  $('#exportCases').disabled=!state.cases.length;
  if(!rows.length){$('#caseList').innerHTML=`<div class="empty-state"><strong>${state.cases.length?'No hay casos con estos filtros.':'Todo comienza con escuchar.'}</strong><p>${state.cases.length?'Prueba otro estado o término de búsqueda.':'Registra tu primer caso o carga el ejemplo de feria para explorar el seguimiento.'}</p></div>`;return;}
  $('#caseList').innerHTML=rows.map(c=>{
    const overdue=c.status!=='Resuelto'&&c.due<today();
    return `<article class="case-item"><div><span class="status ${c.status==='Resuelto'?'resolved':c.status==='En revisión'?'review':''}">${escapeHTML(c.status)}</span><span class="case-id">${escapeHTML(c.id)}${c.example?' · EJEMPLO':''}</span><h4>${escapeHTML(c.category)}${c.priority==='Alta'?' · Prioridad alta':''}</h4><p>${escapeHTML(c.description.slice(0,160))}${c.description.length>160?'…':''}</p><div class="case-meta"><span>Responsable: ${escapeHTML(c.owner)}</span><span class="${overdue?'overdue':''}">${overdue?'Compromiso vencido: ':'Compromiso: '}${dateLabel(c.due)}</span></div></div><button type="button" class="button outline small" data-case="${escapeHTML(c.id)}" aria-label="Gestionar caso ${escapeHTML(c.id)}">Gestionar ↗</button></article>`;
  }).join('');
}
$('#caseSearch')?.addEventListener('input',renderCases); $('#caseFilter')?.addEventListener('change',renderCases);
let editingCase=null;
$('#caseList')?.addEventListener('click',event=>{
  const button=event.target.closest('[data-case]'); if(!button)return;
  const record=state.cases.find(c=>c.id===button.dataset.case); if(!record)return; editingCase=record.id;
  $('#caseDialogTitle').textContent=record.id;
  $('#caseDetails').innerHTML=`<div class="dialog-case-details"><p><strong>${escapeHTML(record.category)} · ${escapeHTML(record.priority)}</strong></p><p>${escapeHTML(record.description)}</p><small>${escapeHTML(record.name||'Sin nombre')} · ${escapeHTML(record.channel)} · ${dateLabel(record.createdAt)}</small><ol class="dialog-history">${record.history.map(h=>`<li>${dateLabel(h.at)} · ${escapeHTML(h.status)} · ${escapeHTML(h.note)}</li>`).join('')}</ol></div>`;
  const form=$('#caseEditForm'); ['status','owner','due','resolution'].forEach(key=>{form.elements[key].value=record[key];});
  showMessage('caseEditMessage',''); $('#caseDialog').showModal();
});
$('#caseEditForm')?.addEventListener('submit',event=>{
  event.preventDefault(); const data=Object.fromEntries(new FormData(event.currentTarget));
  if(!data.owner.trim()){showMessage('caseEditMessage','Indica un responsable.',true);return;}
  if(data.status==='Resuelto'&&data.resolution.trim().length<10){showMessage('caseEditMessage','Describe la solución con al menos 10 caracteres antes de resolver el caso.',true);return;}
  const record=state.cases.find(c=>c.id===editingCase), now=new Date().toISOString();
  if(!record){$('#caseDialog').close();return;}
  const previousStatus=record.status;
  Object.assign(record,data,{owner:data.owner.trim(),resolution:data.resolution.trim(),updatedAt:now});
  if(data.status==='Resuelto'&&previousStatus!=='Resuelto')record.resolvedAt=now;
  if(data.status!=='Resuelto')delete record.resolvedAt;
  record.history.push({at:now,status:data.status,note:`Responsable: ${record.owner}. Compromiso: ${record.due}.${record.resolution?' Acción: '+record.resolution:''}`});
  const saved=save(); renderMetrics(); renderCases(); $('#caseDialog').close(); toast(saveLabel(saved));
});
function csvCell(value) { let text=String(value??''); if(/^[\s]*[=+@-]/.test(text))text="'"+text; return `"${text.replace(/"/g,'""')}"`; }
$('#exportCases')?.addEventListener('click',()=>{
  const fields=['Folio','Fecha','Nombre o apodo','Canal','Motivo','Descripción','Responsable','Compromiso','Prioridad','Estado','Solución','Ejemplo'];
  const rows=state.cases.map(c=>[c.id,c.createdAt,c.name,c.channel,c.category,c.description,c.owner,c.due,c.priority,c.status,c.resolution,c.example?'Sí':'No']);
  download(`PRAM-casos-${today()}.csv`,'\uFEFF'+[fields,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n'),'text/csv;charset=utf-8');
});
$('#exportBackup')?.addEventListener('click',()=>download(`PRAM-respaldo-${today()}.json`,JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),'application/json'));

const baseIdeas=[
  {id:'idea-1',title:'Un saludo que abre la conversación',description:'Acordar una bienvenida breve y cercana para cada canal de atención.',category:'Atención',effort:'Bajo',firstStep:'Practicar tres situaciones reales con el equipo durante 15 minutos.',measure:'Revisar en una encuesta si la persona se sintió bien recibida.'},
  {id:'idea-2',title:'Pedidos claros, menos confusiones',description:'Confirmar productos, cantidades y tiempo estimado antes de cerrar un pedido.',category:'Organización',effort:'Bajo',firstStep:'Crear una lista de confirmación de pedido y probarla durante una semana.',measure:'Comparar las correcciones de pedidos antes y después del piloto.'},
  {id:'idea-3',title:'La voz del cliente, en un minuto',description:'Invitar a todas las personas a evaluar su experiencia con una encuesta breve.',category:'Fidelización',effort:'Bajo',firstStep:'Definir tres preguntas e invitar a participar voluntariamente al terminar la atención.',measure:'Contar respuestas y revisar el promedio semanal, incluyendo opiniones críticas.'},
  {id:'idea-4',title:'Un reclamo, un responsable',description:'Asignar cada caso y registrar el compromiso de respuesta para evitar pendientes sin dueño.',category:'Organización',effort:'Bajo',firstStep:'Elegir un encargado por turno y revisar pendientes al inicio de cada jornada.',measure:'Medir casos pendientes, compromisos vencidos y porcentaje de resolución.'},
  {id:'idea-5',title:'Una carta fácil de entender',description:'Ordenar promociones, precios e ingredientes para ayudar a elegir con confianza.',category:'Atención',effort:'Medio',firstStep:'Validar información con la pyme y probar la carta con cinco personas.',measure:'Registrar dudas frecuentes y si se entiende qué incluye cada promoción.'},
  {id:'idea-6',title:'Quince minutos para mejorar',description:'Reunir al equipo una vez por semana para reconocer aciertos y elegir una mejora.',category:'Fidelización',effort:'Bajo',firstStep:'Revisar un acierto, un caso y una acción con responsable y fecha.',measure:'Comprobar la semana siguiente si la acción se realizó y qué cambió.'}
];
let ideaFilter='Todas';
function renderIdeas() {
  if (!$('#ideaGrid')) return;
  const ideas=[...state.ideas,...baseIdeas].filter(i=>ideaFilter==='Todas'||i.category===ideaFilter);
  $('#ideaGrid').innerHTML=ideas.map(i=>`<article class="idea-card"><div class="idea-top"><span class="tag">${escapeHTML(i.category)}</span><span class="idea-effort">Esfuerzo ${escapeHTML(i.effort.toLowerCase())}</span></div><h3>${escapeHTML(i.title)}</h3><p>${escapeHTML(i.description)}</p><details><summary>Cómo empezar <span aria-hidden="true">+</span></summary><p><strong>Primer paso.</strong> ${escapeHTML(i.firstStep)}</p><p><strong>Cómo medir.</strong> ${escapeHTML(i.measure||'Acordar un indicador con el equipo antes de comenzar.')}</p></details><div class="idea-bottom"><button type="button" data-priority="${escapeHTML(i.id)}" aria-pressed="${state.priorities.includes(i.id)}">${state.priorities.includes(i.id)?'✓ Priorizada':'+ Priorizar'}</button><span>${i.custom?'Propuesta del visitante':'Propuesta PRAM'}</span></div></article>`).join('');
}
$$('[data-idea-filter]').forEach(button=>button.addEventListener('click',()=>{ideaFilter=button.dataset.ideaFilter;$$('[data-idea-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderIdeas();}));
$('#ideaGrid')?.addEventListener('click',event=>{const button=event.target.closest('[data-priority]');if(!button)return;const id=button.dataset.priority,index=state.priorities.indexOf(id);if(index<0)state.priorities.push(id);else state.priorities.splice(index,1);const saved=save();renderIdeas();$(`[data-priority="${id}"]`).focus();toast(index<0?`Idea priorizada. ${saveLabel(saved)}`:`Prioridad retirada. ${saveLabel(saved)}`);});
$('#addIdea')?.addEventListener('click',()=>{showMessage('ideaMessage','');$('#ideaDialog').showModal();});
$('#ideaForm')?.addEventListener('submit',event=>{
  event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));
  if(data.title.trim().length<5||data.description.trim().length<15||!data.firstStep.trim()){showMessage('ideaMessage','Completa el título, la descripción y un primer paso concreto.',true);return;}
  state.ideas.unshift({...data,title:data.title.trim(),description:data.description.trim(),firstStep:data.firstStep.trim(),id:uid('IDEA'),custom:true,createdAt:new Date().toISOString()});
  const saved=save();event.currentTarget.reset();$('#ideaDialog').close();ideaFilter='Todas';$$('[data-idea-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ideaFilter==='Todas')));renderIdeas();toast(`Propuesta agregada. ${saveLabel(saved)}`);
});

$('#experienceForm')?.addEventListener('submit',async event=>{
  event.preventDefault(); const form=event.currentTarget, name=form.elements.name.value.trim(), comment=form.elements.comment.value.trim(), photo=form.elements.photo.files[0],button=$('button[type=submit]',form);
  if(!name||comment.length<5){showMessage('experienceMessage','Escribe tu nombre o apodo y una experiencia de al menos 5 caracteres.',true);return;}
  if(photo&&(!['image/jpeg','image/png','image/webp'].includes(photo.type)||photo.size>1024*1024)){showMessage('experienceMessage','Usa una imagen JPG, PNG o WebP de hasta 1 MB.',true);return;}
  button.disabled=true;
  try {
    let image='';
    if(photo){image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('No se pudo leer la imagen.'));reader.readAsDataURL(photo);});await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=()=>reject(new Error('El archivo no contiene una imagen válida.'));img.src=image;});}
    state.experiences.unshift({id:uid('EXP'),name,comment,image,createdAt:new Date().toISOString()});const saved=save();renderExperiences();form.reset();showMessage('experienceMessage',`Experiencia agregada al muro local. ${saveLabel(saved)}`,!saved);
  } catch(error){showMessage('experienceMessage',error.message,true);} finally {button.disabled=false;}
});
function renderExperiences(){
  if (!$('#experienceFeed')) return;
  $('#experienceFeed').innerHTML=state.experiences.length?state.experiences.map(e=>`<article class="experience-card"><h4>${escapeHTML(e.name)}</h4><time datetime="${escapeHTML(e.createdAt)}">${dateLabel(e.createdAt)}${e.example?' · Ejemplo ficticio':''}</time><p>${escapeHTML(e.comment)}</p>${e.image&&/^data:image\/(jpeg|png|webp);base64,/.test(e.image)?`<img src="${escapeHTML(e.image)}" alt="Fotografía compartida por ${escapeHTML(e.name)}" loading="lazy">`:''}</article>`).join(''):'<div class="empty-state"><strong>Un espacio para compartir.</strong><p>Las experiencias que registres aquí aparecerán en este navegador.</p></div>';
}

$('#loadDemo')?.addEventListener('click',()=>{
  if(state.demoLoaded)return;
  const now=new Date().toISOString(), date=today();
  state.ratings.push(...[5,4,5,3,4].map((rating,i)=>({id:uid(`EJ-EVAL-${i}`),rating,channel:'Presencial',comment:'Evaluación ficticia para la Feria TP',example:true,createdAt:now})));
  state.cases.unshift({id:uid('EJ-CASO'),name:'Cliente de ejemplo',channel:'WhatsApp',category:'Tiempo de espera',description:'Ejemplo: se necesita confirmar el tiempo estimado de entrega del pedido.',owner:'Encargado de turno',due:date,priority:'Normal',status:'En revisión',resolution:'Se está revisando el estado del pedido.',createdAt:now,updatedAt:now,example:true,history:[{at:now,status:'En revisión',note:'Caso ficticio de feria'}]},{id:uid('EJ-CASO'),name:'Cliente de ejemplo',channel:'Presencial',category:'Pedido o entrega',description:'Ejemplo: una persona solicitó aclarar qué incluye su promoción.',owner:'Equipo de atención',due:date,priority:'Normal',status:'Resuelto',resolution:'Se explicó la promoción y se confirmó el pedido con la persona.',createdAt:now,updatedAt:now,resolvedAt:now,example:true,history:[{at:now,status:'Resuelto',note:'Caso ficticio resuelto para la demostración'}]});
  state.experiences.unshift({id:uid('EJ-EXP'),name:'Visitante de ejemplo',comment:'Ejemplo ficticio: me explicaron las opciones con claridad y confirmaron mi pedido.',image:'',example:true,createdAt:now});
  state.demoLoaded=true;const saved=save();renderAll();toast(`Ejemplos ficticios cargados: 5 evaluaciones y 2 casos. ${saveLabel(saved)}`);
});
$('#resetData')?.addEventListener('click',()=>$('#resetDialog').showModal());
$('#confirmReset')?.addEventListener('click',()=>{
  try {localStorage.removeItem(STORAGE_KEY);storageBlocked=false;}catch(_){toast('No se pudieron borrar los datos del navegador. No se ha reiniciado la demo.');return;}
  state=emptyState();$('#storageNote').textContent='Los registros se guardan en este navegador. No se envían a la pyme ni se comparten entre dispositivos. Usa datos ficticios para la feria.';$('#storageNote').classList.remove('error');
  $('#caseSearch').value='';$('#caseFilter').value='todos';$('#resetDialog').close();renderAll();toast('Se borraron los datos locales de PRAM.');
});
$$('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}}));

const gallery=[
  ['1788955839703.webp','Entrada de Sushi IsiMiya decorada con banderines','Un negocio con identidad propia.'],
  ['1788955839572.webp','Mostrador de Sushi IsiMiya','Detalles que hacen la diferencia.'],
  ['1788955839655.webp','Carta de promociones fotografiada en Sushi IsiMiya','Variedad para compartir.'],
  ['1788955839796.webp','Fachada de Sushi IsiMiya','Una pyme cercana.'],
  ['1788955839621.webp','Interior de Sushi IsiMiya','Un espacio con personalidad.']
];
let galleryIndex=0;
function showGallery(offset){galleryIndex=(galleryIndex+offset+gallery.length)%gallery.length;const[file,alt,caption]=gallery[galleryIndex];$('#galleryImage').src=`assets/isimiya/${file}`;$('#galleryImage').alt=alt;$('#galleryCaption').textContent=caption;$('#galleryCounter').textContent=`${galleryIndex+1} / ${gallery.length}`;}
$('#galleryPrev')?.addEventListener('click',()=>showGallery(-1));$('#galleryNext')?.addEventListener('click',()=>showGallery(1));
$('#year').textContent=String(new Date().getFullYear());
if (window.self === window.top && !new URLSearchParams(location.search).has('preview')) {
  const button=document.createElement('button'); button.type='button';button.className='text-link';button.id='phonePreviewButton';button.textContent='Vista móvil ↗';
  $('.site-footer .container').append(button);
  button.addEventListener('click',()=>{ const previewURL=new URL(location.href); previewURL.searchParams.set('preview','mobile'); $('#phoneFrame').src=previewURL.href; $('#phoneDialog').showModal(); });
}
$('#phoneDialog')?.addEventListener('close',()=>{ $('#phoneFrame').src='about:blank'; });
window.addEventListener('storage',event=>{
  if(event.key!==STORAGE_KEY)return;
  try {
    const fresh=event.newValue?JSON.parse(event.newValue):emptyState();
    if(!validSavedData(fresh))return;
    state=fresh;renderMetrics();renderCases();renderIdeas();renderExperiences();
  } catch(_) { /* Preserve the current session if another tab has unreadable data. */ }
});
function renderAll(){renderProtocol();renderMetrics();renderCases();renderIdeas();renderExperiences();}
renderAll();
