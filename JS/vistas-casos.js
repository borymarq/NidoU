import { estado, contratoParaSeguimiento, cancelacionDe, pagoDe, mesDemostracion } from './estado.js';
import { escapeHTML as e, dinero } from './datos.js';
import { link, chip, boton, aviso, campo, textarea, p, restringido } from './vistas.js';

export function cancelacion(){
  const s=estado(),o=contratoParaSeguimiento(p.get('id')),c=o?cancelacionDe(o.id):null;
  if(!o)return `<h1>Sin contrato aplicable</h1>${link('index.html','Volver al inicio')}`;
  if(!['arrendatario','principal','arrendador','soporte'].includes(s.actor))return restringido('una parte del contrato o soporte');
  const titulo=c.s02?'Caso S02':`Solicitud de ${e(o.id)}`;
  return `<p class="eyebrow">Contrato ${e(o.id)} · ${titulo}</p><h1>Solicitar cancelación</h1>${chip(c.estado==='borrador'?'Borrador':c.estado==='revision'?'En revisión':'Resuelto')}
  <div class="split seccion"><div class="panel">${c.estado==='borrador'&&s.actor!=='soporte'?`<p>La solicitud no termina el contrato ni cambia la mensualidad.</p><form id="cancelacion">${textarea('causa','Causa de la solicitud',s.borradorCancelacion||c.causa)}<div class="campo"><label for="prueba">Prueba ficticia opcional</label><input id="prueba" type="file" name="prueba"></div><button type="submit">Enviar solicitud</button></form>`:`<h2>Seguimiento ${titulo}</h2><p>Causa: ${e(c.causa||'—')}.</p>${c.estado==='revision'?aviso('Atención al cliente revisa este caso. El contrato y la mensualidad mantienen su estado.','espera'):c.s02?aviso('S02 aceptado: contrato cancelado y abril en revisión por soporte. No hay pago ni reembolso automático.'):aviso('La solicitud sigue el tratamiento manual; no se ha simulado una resolución general.') }<div class="acciones">${link('chat.html?tema=soporte&id='+e(o.id),'Conversar con soporte')}${link('contrato.html?id='+e(o.id),'Ver contrato')}</div>`}</div>
  <aside class="panel"><h2>Estados separados</h2><p>Contrato: ${c.s02&&c.estado==='resuelta'?'Cancelado':c.estado==='revision'?'Vigente · solicitud en revisión':'Vigente'}.</p><p>Mensualidad ${e(mesDemostracion(o)?.texto||'—')}: ${c.s02&&c.estado==='resuelta'?'En revisión por soporte':e(pagoDe(o.id).estado)}.</p>${s.actor==='soporte'?link('soporte.html?id='+e(o.id),'Volver a soporte'):''}</aside></div>`;
}

export { soporte } from './soporte-vista.js';
