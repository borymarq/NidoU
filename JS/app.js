import { iniciarMedios } from './medios.js';
import { iniciarVistaComprobante } from './pagos-interacciones.js';
import { ACTORES, escapeHTML as e } from './datos.js';
import { estado, activarQA } from './estado.js';
import { panelCasos } from './vistas.js';
import { explorar, ficha, publicar, oferta, ofertas, contrato } from './vistas-publicaciones.js';
import { indicePublico, registroContextual } from './vistas-entrada.js';
import { convivencia, chat, pagos, resenas } from './vistas-flujos.js';
import { soporte, cancelacion } from './vistas-casos.js';
import { iniciarInteracciones } from './interacciones.js';

const paginas={index:indicePublico,explorar,ficha,registro:registroContextual,publicar,oferta,ofertas,contrato,convivencia,chat,pagos,soporte,cancelacion,resenas,qa:()=>`<p class="eyebrow">Herramientas de prueba</p><h1>Casos de QA</h1><div class="panel">${panelCasos()}</div>`};
const pagina=document.body.dataset.pagina||'index';
if(pagina==='qa')activarQA();
const s=estado();
const idContexto=new URLSearchParams(location.search).get('id');
const rutaConvivencia='convivencia.html'+(idContexto?'?id='+encodeURIComponent(idContexto):'');
const rutaContrato='contrato.html'+(idContexto?'?id='+encodeURIComponent(idContexto):'');
const rutaPagos='pagos.html'+(idContexto?'?id='+encodeURIComponent(idContexto):'');
const nav={
  visitante:[['index.html','Inicio'],['explorar.html','Buscar viviendas'],['publicar.html','Publicar una vivienda']],
  arrendatario:[['index.html','Inicio'],['explorar.html','Buscar viviendas'],['ofertas.html','Mis ofertas'],[rutaContrato,'Mi contrato'],[rutaPagos,'Mensualidades']],
  principal:[['index.html','Inicio'],['explorar.html','Buscar viviendas'],['ofertas.html','Mis ofertas'],[rutaContrato,'Mi contrato'],[rutaConvivencia,'Convivencia'],[rutaPagos,'Mensualidades']],
  arrendador:[['index.html','Inicio'],['explorar.html','Buscar viviendas'],['ofertas.html','Publicaciones y ofertas'],['publicar.html','Publicar']],
  candidato:[['index.html','Inicio'],[rutaConvivencia,'Mi solicitud'],['resenas.html','Reseñas']],
  soporte:[['index.html','Inicio'],['soporte.html','Casos'],['chat.html?tema=soporte','Conversaciones']]
};
const enlaces=pagina==='qa'?[]:nav[s.sesionActiva?s.actor:'visitante'];
const identidad=s.sesionActiva?`<span class="actor-actual" aria-label="Sesión activa">${e(s.perfil.nombre||'Persona de prueba')} · ${e(ACTORES[s.actor])}</span>${s.modoQA?'<button type="button" class="secundario" data-act="salir-qa">Salir de pruebas</button>':''}<button type="button" class="secundario" data-act="cerrar-sesion">Cerrar sesión</button>`:'';
document.querySelector('#app').innerHTML=`<header class="cabecera"><div class="barra"><a href="index.html" class="marca" aria-label="NidoU, inicio" ${pagina==='qa'?'data-act="salir-qa"':''}>Nido<span>U</span></a><nav class="nav" aria-label="Navegación principal">${enlaces.map(([url,nombre])=>`<a href="${url}" ${url.split('.')[0]===pagina?'aria-current="page"':''}>${nombre}</a>`).join('')}</nav>${pagina==='qa'?'<button type="button" class="secundario" data-act="salir-qa">Volver al producto</button>':identidad}</div></header><main id="contenido"><div id="estadoAccion" aria-live="polite"></div>${s.sesionActiva?s.avisos.filter(a=>a.actor===s.actor).slice(0,2).map(a=>`<div class="aviso" role="status">${e(a.texto)}</div>`).join(''):''}${(paginas[pagina]||indicePublico)()}</main><footer class="footer">NidoU · prototipo web interactivo · datos ficticios</footer>`;
iniciarInteracciones();
iniciarMedios();
iniciarVistaComprobante();
