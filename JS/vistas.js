import { ACTORES, escapeHTML as e } from './datos.js';
import { estado } from './estado.js';

export const p = new URLSearchParams(location.search);
export const link = (archivo, texto, clase = 'secundario') => `<a class="boton ${clase}" href="${archivo}">${texto}</a>`;
export const chip = (texto, clase = '') => `<span class="etiqueta ${clase}">${e(texto)}</span>`;
export const boton = (texto, accion, id = '', clase = '') => `<button type="button" class="${clase}" data-act="${accion}" data-id="${e(id)}">${texto}</button>`;
export const aviso = (texto, clase = '') => `<div class="aviso ${clase}" role="status">${texto}</div>`;
export const campo = (nombre, label, valor = '', tipo = 'text', extra = '') => `<div class="campo"><label for="${nombre}">${label}</label><input id="${nombre}" name="${nombre}" type="${tipo}" value="${e(valor)}" ${extra}><div class="error" id="error-${nombre}" aria-live="polite"></div></div>`;
export const textarea = (nombre, label, valor = '') => `<div class="campo"><label for="${nombre}">${label}</label><textarea id="${nombre}" name="${nombre}">${e(valor)}</textarea><div class="error" id="error-${nombre}" aria-live="polite"></div></div>`;
export const estadoOferta = o => o.estado === 'rechazada' ? 'Rechazada' : o.aceptaArrendador && o.aceptaArrendatario ? 'Contrato vigente' : o.estado === 'contrato' ? 'Contrato pendiente de aceptación' : 'Oferta enviada';
export function restringido(rol){ return `<div class="panel"><h1>Función sin acceso a esta vista</h1><p>Esta acción corresponde a ${rol}. Cambia la función en las herramientas de QA o inicia la sesión adecuada.</p>${link('index.html','Ir al inicio')}</div>`; }

export function panelCasos() {
  const s=estado();
  const casos=[['publicacion','Publicación y error de campos','publicar.html'],['ofertas','Dos ofertas y aceptación','explorar.html'],['convivencia','Vivir solo o delegar','convivencia.html'],['pago','Comprobante, duplicado y contraste','pagos.html'],['cancelacion','Cancelación S02','cancelacion.html'],['resenas','Reseñas bloqueadas y habilitadas','resenas.html']];
  return `<p>Función activa: <strong>${ACTORES[s.actor]}</strong>. Estos datos están separados del producto.</p><label for="actorDemo">Cambiar función</label><select id="actorDemo">${Object.entries(ACTORES).map(([id,n])=>`<option value="${id}" ${id===s.actor?'selected':''}>${n}</option>`).join('')}</select><p class="muted">Cargar otro caso reemplaza solo los datos ficticios de QA.</p><div class="casos">${casos.map(([id,n,url])=>boton(n,'escenario',`${id}|${url}`,'secundario')).join('')}</div><div class="acciones seccion">${boton('Simular fallo próximo envío','simular-fallo')}${boton('Reiniciar datos de QA','reiniciar','','peligro')}</div>`;
}

export { indicePublico as indice, registroContextual as registro } from './vistas-entrada.js';
export { explorar, ficha, publicar, oferta, ofertas, contrato } from './vistas-publicaciones.js';
