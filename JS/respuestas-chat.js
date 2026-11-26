export function respuestaSimulada(tema, emisor, estadoCaso = '', interlocutor = 'arrendatario') {
  if (tema === 'convivencia') return emisor === 'candidato'
    ? {actor:'principal', texto:'Leí tu mensaje. Conversaremos antes de que el principal registre una decisión.'}
    : {actor:'candidato', texto:'Gracias por conversar. Esperaré la decisión que aparezca en mi solicitud.'};
  if (tema === 'soporte') return emisor === 'soporte'
    ? {actor:interlocutor, texto:'Gracias por la información. Seguiré el estado del caso en la aplicación.'}
    : {actor:'soporte', texto:estadoCaso === 'revision'
      ? 'Recibimos tu consulta sobre el caso en revisión. La respuesta automática no resuelve el caso.'
      : 'Recibimos tu consulta. La respuesta automática no confirma pagos ni resuelve solicitudes.'};
  return emisor === 'arrendador'
    ? {actor:'arrendatario', texto:'Gracias por el mensaje. Revisaré las condiciones de la oferta en la aplicación.'}
    : {actor:'arrendador', texto:'Recibí tu mensaje sobre la oferta. Revisaré sus condiciones en la aplicación.'};
}
