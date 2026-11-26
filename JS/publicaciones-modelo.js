import { elementosMedios } from './medios.js';

const texto = v => String(v??'').trim();
const positivo = v => Number.isFinite(+v) && +v>0;
const fechaValida = v => /^\d{4}-\d{2}-\d{2}$/.test(texto(v));

export function errorPublicacion(b,medios) {
  for(const n of ['nombre','zona','caracteristicas','descripcion','reglas','inicio','fin'])if(!texto(b[n]))return 'Completa los datos compartidos antes de publicar.';
  if(!fechaValida(b.inicio)||!fechaValida(b.fin)||b.inicio>b.fin)return 'El período semestral no es válido.';
  if(Boolean(b.anualInicio)!==Boolean(b.anualFin)||b.anualInicio&&(!fechaValida(b.anualInicio)||!fechaValida(b.anualFin)||b.anualInicio>b.anualFin))return 'Completa un período anual válido o deja ambas fechas vacías.';
  if(!Array.isArray(b.servicios)||!b.servicios.length)return 'Elige al menos un servicio.';
  const opciones=Array.isArray(b.modalidades)?b.modalidades:[];
  if(!opciones.length||opciones.some(x=>!['habitacion','completa'].includes(x)))return 'Elige al menos una modalidad.';
  if(!positivo(b.habitaciones))return 'Indica el número de habitaciones.';
  if(opciones.includes('habitacion')&&(!positivo(b.precioHabitacion)||!positivo(b.capacidadHabitacion)||!positivo(b.cuposHabitacion)))return 'Completa precio, capacidad y cupos de habitación.';
  if(opciones.includes('habitacion')&&+b.cuposHabitacion>+b.habitaciones)return 'Los cupos de habitación no pueden superar las habitaciones indicadas.';
  if(opciones.includes('completa')&&(!positivo(b.precioCompleta)||!positivo(b.capacidadCompleta)))return 'Completa precio y capacidad de vivienda completa.';
  if(!elementosMedios(medios).length)return 'Selecciona al menos una foto o un video ficticio.';
  return '';
}

export function errorOferta(b,u) {
  if(!u || !positivo(b?.precio)||!positivo(b?.ocupantes)||+b.ocupantes>u.capacidad)return 'Indica precio y ocupantes válidos para la modalidad.';
  if(!fechaValida(b.inicio)||!fechaValida(b.fin)||b.inicio>b.fin)return 'Elige fechas válidas antes de enviar la oferta.';
  if(!texto(b.condiciones))return 'Escribe las condiciones de la oferta.';
  if(b.unidadId!==u.id)return 'La modalidad de la oferta ya no coincide con la elegida.';
  return '';
}

export function siguienteIdPublicacion(s) {
  if(s.modoQA&&!s.publicaciones.some(p=>p.id==='C'))return 'C';
  let n=1,id;
  do{id=`V${String(n++).padStart(2,'0')}`;}while(s.publicaciones.some(p=>p.id===id));
  return id;
}

export function crearPublicacion(id,b) {
  const modalidades={};
  if(b.modalidades.includes('habitacion'))modalidades.habitacion={precio:+b.precioHabitacion,capacidad:+b.capacidadHabitacion,cupos:+b.cuposHabitacion};
  if(b.modalidades.includes('completa'))modalidades.completa={precio:+b.precioCompleta,capacidad:+b.capacidadCompleta};
  return {id,vivienda:id,nombre:b.nombre.trim(),zona:b.zona.trim(),caracteristicas:b.caracteristicas.trim(),descripcion:b.descripcion.trim(),reglas:[b.reglas.trim()],servicios:[...b.servicios],habitaciones:+b.habitaciones,inicio:b.inicio,fin:b.fin,anualInicio:b.anualInicio||'',anualFin:b.anualFin||'',mediaId:id,calificacion:null,ruta:false,estado:'publicada',modalidades};
}

export function borradorDesdePublicacion(p) {
  return {id:p.id,nombre:p.nombre,zona:p.zona,caracteristicas:p.caracteristicas,descripcion:p.descripcion,reglas:p.reglas[0]||'',servicios:[...p.servicios],habitaciones:p.habitaciones,inicio:p.inicio,fin:p.fin,anualInicio:p.anualInicio||'',anualFin:p.anualFin||'',modalidades:Object.keys(p.modalidades),precioHabitacion:p.modalidades.habitacion?.precio||'',capacidadHabitacion:p.modalidades.habitacion?.capacidad||'',cuposHabitacion:p.modalidades.habitacion?.cupos||'',precioCompleta:p.modalidades.completa?.precio||'',capacidadCompleta:p.modalidades.completa?.capacidad||''};
}
