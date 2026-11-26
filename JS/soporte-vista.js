import { estado, contratoParaSeguimiento, cancelacionDe, pagoDe, pagoSuspendidoPorS02, mesDemostracion, unidad } from './estado.js';
import { escapeHTML as e, dinero, fecha } from './datos.js';
import { link, chip, boton, aviso, textarea, restringido, p } from './vistas.js';

export function soporte() {
  const s=estado();if(s.actor!=='soporte')return restringido('atención al cliente');
  const casos=s.ofertas.filter(x=>x.aceptaArrendador&&x.aceptaArrendatario);
  const selector='<div class="vistas">'+casos.map(x=>link('soporte.html?id='+e(x.id),'Contrato '+e(x.id))).join('')+'</div>';
  const o=contratoParaSeguimiento(p.get('id'));
  if(!o)return '<p class="eyebrow">Atención al cliente</p><h1>Casos para revisar</h1>'+selector+aviso('No hay contratos para revisar.','espera');
  const u=unidad(o.unidad),mes=mesDemostracion(o),pago=pagoDe(o.id),c=cancelacionDe(o.id);
  const suspendido=pagoSuspendidoPorS02(o.id);
  const nombreEstado=suspendido?'En revisión por soporte':pago.estado==='pendiente'?(pago.duplicado?'Duplicado en revisión':'Pendiente de verificación'):pago.estado==='pagada'?'Pago confirmado':pago.estado==='rechazada'?'Comprobante rechazado':'Sin comprobante';
  const resumen='<section class="panel resumen-pago"><div><p class="eyebrow">Contrato</p><strong>'+e(o.id)+' · '+e(u?.nombre||o.unidad)+'</strong></div><div><p class="eyebrow">Mes de ejemplo</p><strong>'+e(mes?.texto||'Fuera de plazo')+'</strong></div><div><p class="eyebrow">Importe acordado</p><strong>'+dinero(o.precio)+'</strong></div><div><p class="eyebrow">Vencimiento</p><strong>Pendiente de definir</strong></div></section>';
  let accionPago='';
  if(suspendido){
    accionPago=aviso('S02 aceptada: abril sigue en revisión por soporte. La decisión ordinaria del comprobante está suspendida; aún no hay resolución de pago ni de reembolso.','espera')+(pago.contraste?'<p>Contraste ficticio previo: <strong>'+e(pago.contraste)+'</strong>. '+e(pago.observacion||'')+'</p>':'');
  } else if(pago.estado==='pendiente'&&!pago.contraste){
    accionPago=(pago.duplicado?'':boton('Marcar duplicado para revisión','duplicado'))+
      '<form id="contraste"><div class="campo"><label for="resultadoContraste">Contraste ficticio del movimiento</label><select id="resultadoContraste" name="resultadoContraste" required><option value="">Selecciona un resultado</option><option value="favorable">Movimiento recibido y coincidente</option><option value="no_acreditado">Movimiento no acreditado</option><option value="discrepancia">Datos discordantes</option></select><div class="error" id="error-resultadoContraste" aria-live="polite"></div></div>'+textarea('observacion','Evidencia ficticia o motivo de revisión',pago.observacion||'')+'<button type="submit">Registrar contraste</button></form>';
  } else if(pago.estado==='pendiente'){
    accionPago='<p>Contraste ficticio registrado: <strong>'+e(pago.contraste)+'</strong>. '+e(pago.observacion||'')+'</p>'+(pago.contraste==='favorable'?boton('Confirmar pago','decidir-pago','pagada'):boton('Rechazar con motivo','decidir-pago','rechazada','peligro'));
  } else if(pago.estado==='pagada')accionPago=aviso('Pago confirmado tras contraste ficticio favorable.');
  else if(pago.estado==='rechazada')accionPago=aviso('Comprobante rechazado. Motivo: '+e(pago.observacion||'No registrado.'),'errorbox');
  else accionPago=aviso('Aún no hay comprobante. No se puede confirmar el pago.','espera');
  const comprobante='<section class="panel"><h2>Revisión del comprobante</h2>'+chip(nombreEstado,pago.estado==='rechazada'?'alerta':'')+'<p>Referencia: '+e(pago.referencia||'—')+' · archivo: '+e(pago.archivo||'—')+'</p><p>Fecha declarada: '+e(pago.fechaTransferencia?fecha(pago.fechaTransferencia):'—')+' · monto declarado: '+dinero(pago.monto)+'</p><p class="muted">El archivo no prueba recepción. La evidencia de movimiento y la decisión son simuladas.</p>'+accionPago+'</section>';
  const cancelacion='<section class="panel"><h2>Cancelación '+(c.s02?'S02':e(o.id))+'</h2>'+chip(c.estado)+'<p>Causa: '+e(c.causa||'Sin solicitud todavía')+'.</p>'+(c.estado==='revision'&&c.s02?boton('Aceptar cancelación S02','resolver-s02',o.id):c.estado==='revision'?aviso('Solicitud en revisión. La resolución general no está definida.','espera'):'')+(c.estado==='resuelta'&&c.s02?aviso('S02: contrato cancelado y mensualidad en revisión; sin reembolso automático.'):'')+'<div class="acciones">'+link('chat.html?tema=soporte&id='+e(o.id),'Abrir conversación')+link('cancelacion.html?id='+e(o.id),'Ver caso')+'</div></section>';
  return '<p class="eyebrow">Atención al cliente</p><h1>Casos para revisar</h1>'+selector+resumen+'<div class="grid dos seccion">'+comprobante+cancelacion+'</div>';
}
