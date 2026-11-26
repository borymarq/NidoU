const PAGINAS = new Set(['index','explorar','ficha','publicar','oferta','ofertas','contrato','convivencia','chat','pagos','soporte','cancelacion','resenas']);

export function destinoSeguro(valor, defecto='index.html') {
  if (!valor || /[\r\n#]/.test(valor)) return defecto;
  const coincidencia = /^([a-z-]+)\.html(?:\?([^#]*))?$/.exec(valor);
  return coincidencia && PAGINAS.has(coincidencia[1]) ? valor : defecto;
}

export function destinoActual() {
  const archivo = location.pathname.split('/').at(-1) || 'index.html';
  return destinoSeguro(archivo + location.search);
}

export function urlAcceso(tipo, destino=destinoActual(), modo='crear') {
  const q = new URLSearchParams({tipo, volver: destinoSeguro(destino), modo});
  return 'registro.html?' + q.toString();
}

export function pantallaAcceso(tipo, destino=destinoActual(), sesion=false) {
  const nombre=tipo==='arrendador'?'arrendador':'arrendatario';
  const cambiar=sesion?'&cambiar=1':'';
  const crear=urlAcceso(tipo,destino,'crear')+cambiar;
  const entrar=urlAcceso(tipo,destino,'entrar')+cambiar;
  return `<div class="panel acceso-contextual"><p class="eyebrow">Acceso necesario</p><h1>Continúa como ${nombre}</h1><p>${sesion?'Tu sesión actual tiene otra función. Elige explícitamente la función '+nombre+' para continuar.':'Crea o inicia una sesión ficticia con datos básicos. Después volverás al paso que elegiste.'}</p><div class="acciones"><a class="boton" href="${crear}">${sesion?'Cambiar a':'Crear sesión de'} ${nombre}</a><a class="boton secundario" href="${entrar}">Iniciar sesión de ${nombre}</a></div></div>`;
}
