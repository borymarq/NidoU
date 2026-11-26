import { estado } from './estado.js';
import { escapeHTML as e } from './datos.js';
import { destinoSeguro, urlAcceso } from './acceso.js';

const p = new URLSearchParams(location.search);

export function indicePublico() {
  const s=estado();
  return `<div class="hero"><div><p class="eyebrow">Vivienda estudiantil</p><h1>Un lugar para llegar, vivir y avanzar</h1><p class="intro">${s.sesionActiva?'Busca una vivienda y conoce sus condiciones desde tu sesión.':'Busca una vivienda y conoce sus condiciones. Si quieres publicar o enviar una oferta, podrás entrar cuando llegue ese paso.'}</p><div class="acciones"><a class="boton" href="explorar.html">Buscar viviendas</a><a class="boton secundario" href="publicar.html">Publicar una vivienda</a></div></div><div class="hero-arte" aria-hidden="true"></div></div>${s.publicaciones.some(p=>p.estado==='publicada')?`<section class="seccion panel"><h2>Viviendas publicadas</h2><p>Consulta las opciones y sus condiciones desde Explorar.</p><a class="boton secundario" href="explorar.html">Ver viviendas</a></section>`:`<section class="seccion panel"><h2>Las viviendas aparecerán aquí</h2><p>Todavía no hay publicaciones. Puedes empezar una búsqueda o publicar tu vivienda ficticia.</p><div class="acciones"><a class="boton secundario" href="explorar.html">Abrir búsqueda</a><a class="boton secundario" href="publicar.html">Publicar una vivienda</a></div></section>`}`;
}

export function registroContextual() {
  const s=estado();
  const tipo=p.get('tipo')==='arrendador'?'arrendador':p.get('tipo')==='arrendatario'?'arrendatario':'';
  const modo=p.get('modo')==='entrar'?'entrar':'crear';
  const volver=destinoSeguro(p.get('volver'));
  if(s.sesionActiva&&p.get('cambiar')!=='1')return `<div class="panel"><h1>Ya tienes una sesión activa</h1><p>${e(s.perfil.nombre||'Persona de prueba')} puede continuar sin volver a ingresar sus datos.</p><a class="boton" href="${e(volver)}">Continuar</a></div>`;
  const titulo=modo==='entrar'?'Iniciar sesión de demostración':'Crear sesión de demostración';
  const alterno=modo==='entrar'?'crear':'entrar';
  const textoAlterno=modo==='entrar'?'Crear una sesión':'Iniciar una sesión';
  const urlAlterno=urlAcceso(tipo||'arrendatario',volver,alterno)+(p.get('cambiar')==='1'?'&cambiar=1':'');
  return `<p class="eyebrow">Acceso de demostración</p><h1>${titulo}</h1><p class="intro">Usa un nombre y correo ficticios. Volverás a la acción que elegiste; aquí no se piden tarjeta ni cuenta bancaria.</p><div class="split"><form id="registro" class="panel" data-volver="${e(volver)}"><div class="campo"><label for="tipoPerfil">Función</label><select id="tipoPerfil" name="tipoPerfil"><option value="estudiante" ${tipo==='arrendatario'?'selected':''}>Arrendatario estudiante</option><option value="familiar">Arrendatario padre/madre</option><option value="arrendador" ${tipo==='arrendador'?'selected':''}>Arrendador</option></select></div><div class="campo"><label for="nombre">Nombre ficticio</label><input id="nombre" name="nombre" value="${e(s.borradorRegistro.nombre||'')}" required><div class="error" id="error-nombre" aria-live="polite"></div></div><div class="campo"><label for="correo">Correo ficticio</label><input id="correo" name="correo" type="email" value="${e(s.borradorRegistro.correo||'')}" required><div class="error" id="error-correo" aria-live="polite"></div></div><button type="submit">${modo==='entrar'?'Iniciar sesión':'Crear sesión'}</button></form><aside class="panel"><h2>Después del acceso</h2><p>La cabecera mostrará tu nombre y función. Podrás cerrar la sesión sin borrar las publicaciones ficticias.</p><a href="${e(urlAlterno)}">${textoAlterno}</a></aside></div>`;
}
