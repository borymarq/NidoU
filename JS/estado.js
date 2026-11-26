import { FECHAS, UNIDADES } from './datos.js';
const CLAVE_PRODUCTO = 'nidou-prototipo-v2';
const CLAVE_QA = 'nidou-prototipo-qa-v3';
const CONTEXTO_QA = 'nidou-contexto-qa';
const enQA = () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(CONTEXTO_QA)==='1';
const claveActual = () => enQA()?CLAVE_QA:CLAVE_PRODUCTO;
const PUBLICACIONES_QA = [
  {id:'A',vivienda:'A',nombre:'Vivienda A de prueba',zona:'Zona ficticia Norte',descripcion:'Vivienda de demostración para casos de QA.',caracteristicas:'Dos habitaciones y áreas comunes',habitaciones:2,servicios:['Internet','Lavandería'],reglas:['Sin mascotas'],calificacion:4.5,ruta:true,inicio:FECHAS.inicio,fin:FECHAS.fin,estado:'publicada',legacyIds:['A1','A2'],modalidades:{habitacion:{precio:235,capacidad:1,cupos:2},completa:{precio:470,capacidad:3}}},
  {id:'B',vivienda:'B',nombre:'Vivienda B de prueba',zona:'Zona ficticia Sur',descripcion:'Vivienda completa de demostración.',caracteristicas:'Tres habitaciones',habitaciones:3,servicios:['Internet'],reglas:['Se admiten mascotas'],calificacion:null,ruta:false,inicio:FECHAS.inicio,fin:FECHAS.fin,estado:'publicada',modalidades:{completa:{precio:680,capacidad:4}}}
];
export const inicial = () => ({
  version: 3, actor: 'visitante', sesionActiva: false, modoQA: false, perfil: {}, borradorRegistro: {}, borradorCancelacion: '', borradorComprobante: {}, borradorChat: {}, publicaciones: [], mediosPublicados: {}, borradorPublicacion: {}, borradorMedios:{items:[]}, borradorOferta: {}, filtros: {}, ofertas: [],
  convivencia: { eleccion: '', estado: 'sin contacto', mensajes: [], contribucion: '' }, convivenciasPorContrato: {}, interlocutoresSoporte: {},
  chats: { contrato: [], soporte: [] }, pagosPorContrato: {},
  pago: { estado: 'proxima', referencia: '', archivo: '', monto: 470, mes: 'Abril de 2027', contraste: '', observacion: '' },
  cancelacion: { estado: 'borrador', causa: '', decision: '', s02:false }, cancelacionesPorContrato:{}, resenas: [], avisos: [], fallo: ''
});
let memoria, memoriaClave;
function migrar(s) {
  if(!s || ![2,3].includes(s.version) || (s.version===2&&s.modoQA))return inicial();
  if(s.version===2){
    const grupos=new Map();
    for(const u of s.publicaciones||[]){
      const id=u.vivienda||u.id, p=grupos.get(id)||{id,vivienda:id,nombre:u.nombre,zona:u.zona,descripcion:u.descripcion,caracteristicas:u.caracteristicas,habitaciones:u.habitaciones,servicios:u.servicios||[],reglas:u.reglas||[],calificacion:u.calificacion??null,ruta:u.ruta,inicio:u.inicio,fin:u.fin,anualInicio:u.anualInicio,anualFin:u.anualFin,mediaId:u.mediaId,estado:'publicada',modalidades:{},legacyIds:[]};
      if(u.modalidad==='completa')p.nombre=u.nombre;
      p.modalidades[u.modalidad]={precio:u.precio,capacidad:u.capacidad,cupos:u.modalidad==='habitacion'?1:undefined};
      p.legacyIds.push(u.id);grupos.set(id,p);
    }
    s.publicaciones=[...grupos.values()];s.version=3;s.modoQA=false;
  }
  return s;
}
export function estado() {
  const clave=claveActual();
  if(memoriaClave!==clave){memoria=undefined;memoriaClave=clave;}
  if (!memoria) {
    try { memoria = migrar(JSON.parse(localStorage.getItem(clave))) ; } catch { memoria = inicial(); }
    memoria.modoQA=enQA();
    memoria.borradorMedios ||= {items:[]};
    memoria.mediosPublicados ||= {};
    if (!memoria.borradorMedios.items) memoria.borradorMedios = {items:[...(memoria.borradorMedios.fotos||[]).map(m=>({...m,tipo:'foto'})),...(memoria.borradorMedios.video?[{...memoria.borradorMedios.video,tipo:'video'}]:[])]};
    memoria.cancelacionesPorContrato ||= {};
    memoria.borradorComprobante ||= {};
    memoria.cancelacion ||= {estado:'borrador',causa:'',decision:'',s02:false};
    memoria.convivenciasPorContrato ||= {};
    memoria.interlocutoresSoporte ||= {};
  }
  return memoria;
}
export function guardar() { localStorage.setItem(claveActual(), JSON.stringify(estado())); window.dispatchEvent(new CustomEvent('nidou:estado')); }
export function cambiar(mutacion) { mutacion(estado()); guardar(); }
export function reiniciar() { memoria = inicial(); guardar(); }
export function activarQA() { if(typeof sessionStorage !== 'undefined')sessionStorage.setItem(CONTEXTO_QA,'1');memoria=undefined;memoriaClave=undefined;estado(); }
export function salirQA() { if(typeof sessionStorage !== 'undefined')sessionStorage.removeItem(CONTEXTO_QA);memoria=undefined;memoriaClave=undefined;estado(); }
export function cerrarSesion() { if(enQA())salirQA();cambiar(s=>{s.actor='visitante';s.sesionActiva=false;s.modoQA=false;s.perfil={};s.borradorRegistro={};}); }
export function tieneSesion(tipo) { const s=estado(); return s.sesionActiva && (tipo==='arrendatario' ? ['arrendatario','principal'].includes(s.actor) : s.actor===tipo); }
export function aviso(actor, texto) { estado().avisos.unshift({ actor, texto, fecha: new Date().toISOString() }); }
export function cargarEscenario(tipo) {
  if(!enQA())return;
  memoria = inicial(); memoria.modoQA=true; memoria.sesionActiva=true; memoria.perfil={nombre:'Persona de prueba',correo:'demo@ejemplo.invalid'}; memoria.actor = tipo === 'ofertas' ? 'arrendatario' : tipo === 'convivencia' ? 'principal' : tipo === 'pago' || tipo === 'cancelacion' ? 'arrendatario' : tipo === 'resenas' ? 'principal' : 'arrendador';
  if (tipo !== 'ofertas' && tipo !== 'publicacion') {
    memoria.ofertas.push({ id: 'A01', unidad: 'A', precio: 470, ocupantes: 1, condiciones: 'Condiciones de ejemplo', ...FECHAS, estado: 'contrato', aceptaArrendador: true, aceptaArrendatario: true });
    if(tipo!=='convivencia')memoria.convivencia.eleccion = 'admitir';
  }
  if (tipo === 'resenas') memoria.ofertas[0].finalizado = true;
  if (tipo === 'cancelacion') memoria.cancelacion.s02 = true;
  guardar();
}
export function contratoActivo(vivienda) { return estado().ofertas.find(o => o.aceptaArrendador && o.aceptaArrendatario && !o.finalizado && (!vivienda || unidad(o.unidad)?.vivienda === vivienda)); }
export function contratoPrincipal(id) { return estado().ofertas.find(o => (!id||o.id===id) && o.aceptaArrendador && o.aceptaArrendatario && unidad(o.unidad)?.modalidad === 'completa'); }
export const convivenciaInicial = () => ({eleccion:'',estado:'sin contacto',mensajes:[],contribucion:''});
export function convivenciaDe(id) { const s=estado(); return id==='A01' ? s.convivencia : s.convivenciasPorContrato[id] || convivenciaInicial(); }
export function convivenciaMutable(s,id) { return id==='A01' ? s.convivencia : s.convivenciasPorContrato[id] ||= convivenciaInicial(); }
export function interlocutorSoporte(id,s=estado(),contexto='') {
  const previo=s.chats.soporte.filter(m=>m.id===id&&m.actor!=='soporte'&&!m.simulada).at(-1)?.actor;
  if(previo)return previo;
  if(s.interlocutoresSoporte[id])return s.interlocutoresSoporte[id];
  if(['principal','arrendatario','candidato'].includes(contexto))return contexto;
  const oferta=s.ofertas.find(o=>o.id===id);
  return unidad(oferta?.unidad)?.modalidad==='completa'?'principal':'arrendatario';
}
export function contratoParaSeguimiento(id) { if(id) return estado().ofertas.find(o => o.id===id && o.aceptaArrendador && o.aceptaArrendatario); return estado().ofertas.find(o => o.aceptaArrendador && o.aceptaArrendatario && !o.finalizado) || estado().ofertas.find(o => o.aceptaArrendador && o.aceptaArrendatario); }
export function siguienteIdOferta(s,vivienda) {
  const prefijo=/^[A-Z]$/.test(vivienda)?vivienda:'U';
  let numero=1,id;
  do { id=`${prefijo}${String(numero++).padStart(2,'0')}`; } while(s.ofertas.some(o=>o.id===id));
  return id;
}
export const pagoInicial = (monto, mes) => ({ estado:'proxima', referencia:'', archivo:'', monto, mes, contraste:'', observacion:'' });
const esCasoBaseA = (s,id) => id==='A01' && unidad(s.ofertas.find(o=>o.id===id)?.unidad)?.vivienda==='A';
export function pagoDe(id) { const s=estado(), o=s.ofertas.find(x=>x.id===id), mes=mesDemostracion(o)?.texto||''; return esCasoBaseA(s,id) ? {...s.pago,monto:s.pago.estado==='proxima'?(o?.precio||s.pago.monto):s.pago.monto,mes} : s.pagosPorContrato[id] || pagoInicial(o?.precio||0,mes); }
export function pagoMutable(s,id) { const o=s.ofertas.find(x=>x.id===id), mes=mesDemostracion(o)?.texto||''; const p=esCasoBaseA(s,id) ? s.pago : s.pagosPorContrato[id] ||= pagoInicial(o?.precio||0,mes); if(p.estado==='proxima')p.monto=o?.precio||p.monto;p.mes=mes; return p; }
export function cancelacionDe(id) { const s=estado(); return esCasoBaseA(s,id) ? s.cancelacion : s.cancelacionesPorContrato[id] || {estado:'borrador',causa:'',decision:'',s02:false}; }
export function pagoSuspendidoPorS02(id) { const caso=cancelacionDe(id); return caso.s02 && caso.estado==='resuelta'; }
export function cancelacionMutable(s,id) { return esCasoBaseA(s,id) ? s.cancelacion : s.cancelacionesPorContrato[id] ||= {estado:'borrador',causa:'',decision:'',s02:false}; }
export function mesDemostracion(o) {
  if (!o?.inicio || !o?.fin || o.inicio > o.fin) return null;
  const clave = o.inicio.slice(0, 7);
  if (clave > o.fin.slice(0, 7)) return null;
  const [anio, mes] = clave.split('-').map(Number);
  return { clave, texto: new Intl.DateTimeFormat('es-EC', { month: 'long', year: 'numeric' }).format(new Date(anio, mes - 1, 1)), inicio: o.inicio, fin: o.fin };
}
export function publicaciones() { const s=estado(); return [...(s.modoQA?PUBLICACIONES_QA:[]),...s.publicaciones]; }
export function publicacion(id) { return publicaciones().find(p=>p.id===id || p.legacyIds?.includes(id)); }
export function unidad(id) {
  if(!id)return undefined;
  const s=estado(), legado=s.modoQA?UNIDADES.find(u=>u.id===id):undefined;
  if(legado)return {...legado,publicacionId:legado.vivienda};
  const [pid,opcion]=id.split('|'), p=publicacion(pid);
  if(!p)return undefined;
  const modalidad=opcion||(p.legacyIds?.includes(id)&&id.endsWith('1')?'habitacion':p.modalidades.completa?'completa':'habitacion');
  let m=p.modalidades[modalidad];
  if(!m){const anterior=s.ofertas.find(o=>o.unidad===id);if(!anterior)return undefined;m={precio:anterior.precio,capacidad:anterior.capacidadModalidad||anterior.ocupantes,cupos:1};}
  return {...p,id,publicacionId:p.id,modalidad,precio:+m.precio,capacidad:+m.capacidad,cupos:+(m.cupos||1),mediaId:p.mediaId};
}
export function periodoUnidad(u) { return { inicio:u?.inicio||FECHAS.inicio, fin:u?.fin||FECHAS.fin }; }
export function solapa(a, b) { return a.inicio <= b.fin && b.inicio <= a.fin; }
export function disponibilidad(u, periodo = periodoUnidad(u)) {
  if(!u)return {disponible:false,motivo:'Unidad no encontrada'};
  const id=u.publicacionId||u.vivienda;
  const comprometidos = estado().ofertas.filter(o => o.aceptaArrendador && o.aceptaArrendatario && !o.finalizado && (o.publicacionId||unidad(o.unidad)?.publicacionId||unidad(o.unidad)?.vivienda) === id && solapa(o, periodo));
  if (!comprometidos.length) return { disponible: true, motivo: 'Disponible' };
  if (comprometidos.some(o => (o.modalidad||unidad(o.unidad)?.modalidad) !== u.modalidad)) return { disponible: false, motivo: 'No disponible: modalidad incompatible' };
  if ((u.id==='A1'||u.id==='A2')&&comprometidos.some(o=>o.unidad===u.id))return { disponible: false, motivo: 'No disponible: unidad ocupada' };
  if (u.modalidad === 'completa' || !['A1','A2'].includes(u.id)&&comprometidos.filter(o=>(o.modalidad||unidad(o.unidad)?.modalidad)==='habitacion').length >= (u.cupos||1)) return { disponible: false, motivo: 'No disponible: unidad ocupada' };
  return { disponible: true, motivo: 'Disponible' };
}
export function ofertasVisibles() { return estado().ofertas.filter(o => o.estado !== 'rechazada'); }
