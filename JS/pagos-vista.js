import { estado, contratoParaSeguimiento, pagoDe, mesDemostracion, cancelacionDe, unidad } from './estado.js';
import { escapeHTML as e, dinero, fecha } from './datos.js';
import { link, chip, boton, aviso, campo, restringido, p } from './vistas.js';

export function pagos() {
  const s=estado(),o=contratoParaSeguimiento(p.get('id'));
  if(!o)return '<h1>Mensualidades</h1>'+aviso('Acepta un contrato o carga el escenario de pago.','espera')+link('index.html','Elegir escenario');
  if(!['arrendatario','principal','arrendador','soporte'].includes(s.actor))return restringido('arrendatario, arrendador o soporte');
  const u=unidad(o.unidad),mes=mesDemostracion(o),pago=pagoDe(o.id),caso=cancelacionDe(o.id);
  const s02=caso.s02&&caso.estado==='resuelta';
  const estadoPago=s02?'En revisión por soporte':o.finalizado?'Estancia finalizada':pago.estado==='proxima'?'Próxima mensualidad':pago.estado==='pendiente'?(pago.duplicado?'Duplicado en revisión':'Pendiente de verificación'):pago.estado==='pagada'?'Pago confirmado':'Comprobante rechazado';
  const paso=pago.estado==='proxima'?1:pago.estado==='pendiente'?3:pago.estado==='pagada'?4:2;
  const pasos=['Mensualidad','Transferencia directa','Comprobante y verificación','Decisión de soporte'];
  const progreso='<ol class="progreso-pago" aria-label="Progreso del pago">'+pasos.map((n,i)=>'<li class="'+(i+1<paso?'hecho':i+1===paso?'actual':'')+'"><span>'+(i+1)+'</span>'+n+'</li>').join('')+'</ol>';
  const resumen='<section class="panel resumen-pago"><div><p class="eyebrow">Contrato</p><strong>'+e(o.id)+' · '+e(u?.nombre||o.unidad)+'</strong></div><div><p class="eyebrow">Mes de ejemplo</p><strong>'+e(mes?.texto||'Fuera de plazo')+'</strong></div><div><p class="eyebrow">Importe</p><strong>'+dinero(o.precio)+'</strong></div><div><p class="eyebrow">Vencimiento</p><strong>Pendiente de definir</strong></div></section>';
  const detalle='<section class="panel"><h2>Transferencia directa</h2><p>Transfiere al arrendador por fuera de NidoU. Cuenta de demostración: <strong>DEMO-000-000</strong>.</p><p>El pago es anticipado. El día exacto de vencimiento sigue pendiente de decisión. Solo se muestra el primer mes del contrato como ejemplo provisional.</p><p class="muted">El comprobante solicita una revisión; no acredita por sí mismo que el dinero haya llegado.</p></section>';
  let siguiente='';
  if(s02)siguiente=aviso('Caso S02: la mensualidad está en revisión por soporte. No se infiere pago ni reembolso.','espera');
  else if(o.finalizado)siguiente=aviso('La estancia terminó. No se ofrece un nuevo pago desde este contrato.','espera');
  else if(!mes)siguiente=aviso('No hay una mensualidad dentro del plazo de este contrato.','espera');
  else if(pago.estado==='proxima'&&['arrendatario','principal'].includes(s.actor)){
    siguiente='<section class="panel"><h2>Solicitar verificación</h2><p>Adjunta un comprobante ficticio de la transferencia directa.</p><form id="comprobante">'+campo('referencia','Referencia ficticia',s.borradorComprobante[o.id]?.referencia||'','text','required')+campo('monto','Monto declarado',s.borradorComprobante[o.id]?.monto||o.precio,'number','min="1" required')+campo('fechaTransferencia','Fecha indicada en el comprobante',s.borradorComprobante[o.id]?.fechaTransferencia||'','date','required')+'<div class="campo"><label for="archivo">Archivo ficticio de imagen o PDF</label><input id="archivo" name="archivo" type="file" accept="image/*,.pdf" aria-describedby="ayuda-archivo error-archivo" required><p class="muted" id="ayuda-archivo">Máximo 1 MB. La vista previa solo aparece en este navegador y no se guarda.</p><div id="error-archivo" class="error" aria-live="polite"></div></div><div id="vistaComprobante" class="vista-comprobante" role="status">Aún no hay archivo seleccionado.</div><button type="submit">Solicitar verificación</button></form></section>';
  } else if(pago.estado==='pendiente'){
    siguiente=aviso(pago.duplicado?'Referencia o archivo marcado como duplicado. Soporte debe contrastarlo; no hay pago confirmado.':'Comprobante recibido para revisión. Aún no se confirma la llegada del dinero.','espera');
  } else if(pago.estado==='rechazada'){
    siguiente='<section class="panel"><h2>Comprobante rechazado</h2><p><strong>Motivo:</strong> '+e(pago.observacion||'Consulta a soporte para conocer el motivo.')+'</p>'+(['arrendatario','principal'].includes(s.actor)?boton('Enviar otro comprobante','nuevo-comprobante'):'')+'</section>';
  } else if(pago.estado==='pagada')siguiente=aviso('Pago confirmado después de un contraste ficticio favorable de soporte.');
  if(s.actor==='arrendador'&&pago.estado!=='pagada')siguiente+=aviso('No hay pago confirmado para informar al arrendador.','espera');
  if(s.actor==='soporte')siguiente+=link('soporte.html?id='+e(o.id),'Revisar como soporte');
  const evidencia=pago.estado==='proxima'?'':'<section class="panel"><h2>Comprobante enviado</h2><p>Referencia: '+e(pago.referencia||'—')+' · archivo: '+e(pago.archivo||'—')+'</p><p>Fecha declarada: '+e(pago.fechaTransferencia?fecha(pago.fechaTransferencia):'—')+' · monto declarado: '+dinero(pago.monto)+'</p><p>'+e(pago.observacion||'Sin observaciones registradas.')+'</p></section>';
  return '<p class="eyebrow">Mensualidades · '+e(u?.nombre||o.unidad)+'</p><h1>Siguiente mensualidad</h1>'+chip(estadoPago,pago.estado==='rechazada'?'alerta':'')+resumen+progreso+'<div class="split seccion"><div class="stack">'+detalle+evidencia+'</div><aside class="stack">'+siguiente+link('contrato.html?id='+e(o.id),'Volver al contrato')+'</aside></div>';
}
