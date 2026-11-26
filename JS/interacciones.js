import { ACTORES } from './datos.js';
import { errorPublicacion, errorOferta, crearPublicacion, siguienteIdPublicacion } from './publicaciones-modelo.js';
import { destinoSeguro } from './acceso.js';
import { elementosMedios } from './medios.js';
import { respuestaSimulada } from './respuestas-chat.js';
import { procesarComprobante } from './pagos-interacciones.js';
import { estado, guardar, cambiar, reiniciar, cargarEscenario, salirQA, cerrarSesion, tieneSesion, publicacion, aviso, disponibilidad, unidad, siguienteIdOferta, contratoPrincipal, convivenciaDe, convivenciaMutable, interlocutorSoporte, contratoParaSeguimiento, mesDemostracion, pagoDe, pagoMutable, cancelacionDe, cancelacionMutable, pagoSuspendidoPorS02 } from './estado.js';

const ir = url => { location.href = url; };
const valor = (fd,n) => String(fd.get(n)||'').trim();
function error(form,n,m){const el=form.querySelector(`#error-${n}`);if(el)el.textContent=m;const campo=form.elements[n];if(campo){campo.setAttribute('aria-invalid','true');campo.setAttribute('aria-describedby',`error-${n}`);campo.focus();}return false;}
function validarObligatorios(form,campos){for(const n of campos)if(!String(form.elements[n]?.value||'').trim())return error(form,n,'Completa este campo para continuar.');return true;}
function fechaValida(form,inicio='inicio',fin='fin'){if(form.elements[inicio].value>form.elements[fin].value)return error(form,fin,'La fecha final debe ser posterior a la inicial.');return true;}
function posibleFallo(){if(!estado().fallo)return false;cambiar(s=>{s.fallo='';});const caja=document.querySelector('#estadoAccion');if(caja)caja.innerHTML='<div class="aviso errorbox" role="alert">Fallo simulado de conexión. Tus datos se conservaron; vuelve a intentar.</div>';return true;}
function esperar(texto,continuar){const caja=document.querySelector('#estadoAccion');if(caja)caja.innerHTML=`<div class="aviso espera" role="status">${texto}</div>`;document.querySelectorAll('button[type=submit],button[data-act]').forEach(b=>b.disabled=true);setTimeout(continuar,450);}

function mostrarMensajeChat(m,actor){
  const lista=document.querySelector('#mensajesChat');if(!lista)return;
  lista.querySelector('#chatVacio')?.remove();
  const caja=document.createElement('div'),etiqueta=document.createElement('small');
  caja.className='mensaje '+(m.simulada?'simulada':m.actor===actor?'propio':'');
  etiqueta.textContent=(ACTORES[m.actor]||m.actor)+(m.simulada?' · Respuesta automática simulada':'');
  caja.append(etiqueta,document.createTextNode(m.texto));lista.append(caja);
}

export function iniciarInteracciones(){
  document.addEventListener('change',ev=>{if(ev.target.id==='actorDemo'&&document.body.dataset.pagina==='qa'){cambiar(s=>{s.actor=ev.target.value;s.sesionActiva=ev.target.value!=='visitante';});location.reload();}});
  document.addEventListener('input',ev=>{const form=ev.target.closest('form');if(!form)return;ev.target.removeAttribute('aria-invalid');const er=form.querySelector(`#error-${ev.target.name}`);if(er)er.textContent='';if(form.id==='publicacion'){const fd=new FormData(form),data=Object.fromEntries(fd.entries());data.servicios=fd.getAll('servicios');data.modalidades=fd.getAll('modalidades');cambiar(s=>{s.borradorPublicacion={...s.borradorPublicacion,...data};});}if(form.id==='oferta'){const id=form.dataset.id,data=Object.fromEntries(new FormData(form).entries());cambiar(s=>{s.borradorOferta[id]={...s.borradorOferta[id],...data};});}if(form.id==='registro'){cambiar(s=>{s.borradorRegistro={...s.borradorRegistro,...Object.fromEntries(new FormData(form).entries())};});}if(form.id==='cancelacion'){cambiar(s=>{s.borradorCancelacion=form.elements.causa.value;});}if(form.id==='comprobante'){cambiar(s=>{const id=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;s.borradorComprobante[id]={...s.borradorComprobante[id],referencia:form.elements.referencia.value,monto:form.elements.monto.value,fechaTransferencia:form.elements.fechaTransferencia.value,archivo:form.elements.archivo.files[0]?.name||s.borradorComprobante[id]?.archivo};});}if(form.id==='chat'){const tema=form.dataset.tema,key=['contrato','soporte'].includes(tema)?(new URLSearchParams(location.search).get('id')||estado().ofertas[0]?.id):tema;cambiar(s=>{s.borradorChat[tema==='convivencia'?tema+':'+(new URLSearchParams(location.search).get('id')||contratoPrincipal()?.id):key]=form.elements.mensaje.value;});}});
  document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id,s=estado();if(a==='reiniciar'){if(confirm('¿Reiniciar todos los datos ficticios de esta demostración?')){reiniciar();ir('index.html');}return;}
    if(a==='salir-qa'){ev.preventDefault?.();salirQA();ir('index.html');return;}
    if(a==='cerrar-sesion'){cerrarSesion();ir('index.html');return;}
    if(a==='escenario'){if(document.body.dataset.pagina!=='qa')return;const [tipo,url]=id.split('|');if(!confirm('Cargar este caso reemplazará los datos ficticios actuales. ¿Continuar?'))return;cargarEscenario(tipo);ir(url);return;}
    if(a==='simular-fallo'){cambiar(x=>{x.fallo='1';});document.querySelector('#estadoAccion').innerHTML='<div class="aviso espera" role="status">El próximo envío mostrará un fallo de conexión simulado.</div>';return;}
    if(a==='limpiar-filtros'){cambiar(x=>{x.filtros={};});location.reload();return;}
    if(a==='confirmar-publicacion'){
      if(!tieneSesion('arrendador'))return;
      if(s.borradorPublicacion.id&&new URLSearchParams(location.search).get('editar')!==s.borradorPublicacion.id){ir('publicar.html?editar='+encodeURIComponent(s.borradorPublicacion.id)+'&error=1');return;}
      const fallo=errorPublicacion(s.borradorPublicacion,s.borradorMedios);
      if(fallo){ir('publicar.html?error=1'+(s.borradorPublicacion.id?'&editar='+encodeURIComponent(s.borradorPublicacion.id):''));return;}
      if(posibleFallo())return;
      esperar('Guardando vivienda ficticia…',()=>{cambiar(x=>{
        const b=x.borradorPublicacion,id=b.id||siguienteIdPublicacion(x),anterior=x.publicaciones.find(y=>y.id===id);
        const pub=crearPublicacion(id,b);if(anterior){pub.estado=anterior.estado;pub.legacyIds=anterior.legacyIds;}
        x.mediosPublicados[id]=structuredClone(x.borradorMedios);
        if(anterior)x.publicaciones[x.publicaciones.indexOf(anterior)]=pub;else x.publicaciones.push(pub);
        x.borradorPublicacion={};x.borradorMedios={items:[]};aviso('arrendador',`Vivienda ${id} guardada.`);
      });ir('ofertas.html');});return;
    }
    if(a==='eliminar-publicacion'||a==='retirar-publicacion'){
      if(!tieneSesion('arrendador'))return;
      const pub=s.publicaciones.find(x=>x.id===id);if(!pub)return;
      const aceptado=s.ofertas.some(o=>(o.publicacionId||unidad(o.unidad)?.publicacionId)===id&&o.aceptaArrendador&&o.aceptaArrendatario);
      if(a==='eliminar-publicacion'&&aceptado||a==='retirar-publicacion'&&!aceptado)return;
      const mensaje=aceptado?'¿Retirar la vivienda de Explorar y conservar contratos y ofertas?':'¿Eliminar la vivienda de Explorar? Las ofertas anteriores quedarán en el historial ficticio.';
      if(!confirm(mensaje))return;
      cambiar(x=>{x.publicaciones.find(y=>y.id===id).estado=aceptado?'retirada':'eliminada';});location.reload();return;
    }
    if(a==='enviar-oferta'){
      if(!tieneSesion('arrendatario'))return;
      const u=unidad(id),b=s.borradorOferta[id],fallo=errorOferta(b,u),pub=publicacion(u?.publicacionId);
      if(fallo||!pub||pub.estado!=='publicada'){
        const q=new URLSearchParams({id:pub?.id||id.split('|')[0],modalidad:u?.modalidad||id.split('|')[1]||'',error:'1'});
        ir('oferta.html?'+q.toString());return;
      }
      for(const campo of ['cedulaOferta','tarjetaOferta','cuentaOferta']){
        const el=document.querySelector('#'+campo),v=el?.value.trim()||'';
        if(!/^DEMO-[A-Z0-9-]+$/i.test(v)){document.querySelector('#error-'+campo).textContent='Usa un identificador ficticio que comience por DEMO-.';el.focus();return;}
      }
      if(!disponibilidad(u,b).disponible){document.querySelector('#estadoAccion').innerHTML='<div class="aviso errorbox" role="alert">Esa modalidad ya no está disponible para las fechas propuestas.</div>';return;}
      if(posibleFallo())return;
      esperar('Enviando oferta de demostración…',()=>{cambiar(x=>{
        const idOferta=siguienteIdOferta(x,u.publicacionId||u.vivienda);
        x.ofertas.push({id:idOferta,unidad:u.id,publicacionId:pub.id,modalidad:u.modalidad,nombreVivienda:b.nombreVivienda||pub.nombre,capacidadModalidad:u.capacidad,precio:+b.precio,ocupantes:+b.ocupantes,condiciones:b.condiciones,inicio:b.inicio,fin:b.fin,estado:'enviada',datosDemoRegistrados:true,aceptaArrendador:false,aceptaArrendatario:false});
        aviso('arrendador',`Nueva oferta ${idOferta} para ${pub.nombre}.`);
      });ir('ofertas.html');});return;
    }
    if(a==='aceptar-oferta'){const o=s.ofertas.find(x=>x.id===id),u=unidad(o?.unidad),pub=publicacion(o?.publicacionId||u?.publicacionId);if(!o||pub?.estado!=='publicada')return;if(!disponibilidad(u,o).disponible){document.querySelector('#estadoAccion').innerHTML='<div class="aviso errorbox" role="alert">Hay un contrato incompatible para estas fechas.</div>';return;}if(posibleFallo())return;esperar('Preparando contrato pendiente…',()=>{cambiar(x=>{x.ofertas.find(o=>o.id===id).estado='contrato';aviso('arrendatario',`La oferta ${id} fue aceptada. El contrato espera ambas aceptaciones.`);});ir(`contrato.html?id=${id}`);});return;}
    if(a==='rechazar-oferta'){cambiar(x=>{x.ofertas.find(o=>o.id===id).estado='rechazada';aviso('arrendatario',`La oferta ${id} fue rechazada.`);});location.reload();return;}
    if(a==='aceptar-contrato'){const o=s.ofertas.find(x=>x.id===id),u=unidad(o?.unidad),pub=publicacion(o?.publicacionId||u?.publicacionId);if(!o||o.estado!=='contrato'||pub?.estado!=='publicada')return;if(!disponibilidad(u,o).disponible){document.querySelector('#estadoAccion').innerHTML='<div class="aviso errorbox" role="alert">La modalidad quedó ocupada por otro contrato solapado.</div>';return;}if(posibleFallo())return;esperar('Registrando aceptación de demostración…',()=>{cambiar(x=>{const target=x.ofertas.find(y=>y.id===id);if(x.actor==='arrendador')target.aceptaArrendador=true;else target.aceptaArrendatario=true;if(target.aceptaArrendador&&target.aceptaArrendatario){aviso('arrendador',`Contrato ${id} vigente; revisar disponibilidad.`);aviso('arrendatario',`Contrato ${id} vigente.`);if(u.modalidad==='completa')x.actor=x.actor==='arrendatario'?'principal':x.actor;}});location.reload();});return;}
    if(a.startsWith('convivencia-')||a==='guardar-contribucion'){
      const cid=new URLSearchParams(location.search).get('id')||contratoPrincipal()?.id,c=convivenciaDe(cid);
      if(!contratoPrincipal(cid))return;
      if(a==='convivencia-eleccion'){
        if(s.actor!=='principal'||c.estado!=='sin contacto'||c.eleccion==='solo'||!['solo','admitir'].includes(id))return;
        cambiar(x=>{const actual=convivenciaMutable(x,cid);actual.eleccion=id;if(id==='solo')actual.estado='cerrada';});location.reload();return;
      }
      if(a==='convivencia-contacto'){
        if(s.actor!=='candidato'||c.eleccion!=='admitir'||c.estado!=='sin contacto')return;
        if(posibleFallo())return;
        esperar('Enviando solicitud…',()=>{cambiar(x=>{convivenciaMutable(x,cid).estado='contactó al arrendador';aviso('arrendador',`Un candidato contactó por convivencia de ${cid}.`);});location.reload();});return;
      }
      if(a==='convivencia-delegar'){
        if(s.actor!=='arrendador'||c.eleccion!=='admitir'||c.estado!=='contactó al arrendador')return;
        cambiar(x=>{convivenciaMutable(x,cid).estado='delegado';aviso('principal',`El arrendador delegó una solicitud de compañero para ${cid}.`);aviso('candidato',`Puedes conversar con el principal de ${cid}.`);});location.reload();return;
      }
      if(a==='convivencia-decision'){
        if(s.actor!=='principal'||c.estado!=='delegado'||c.eleccion!=='admitir'||!['aceptado','rechazado'].includes(id))return;
        cambiar(x=>{convivenciaMutable(x,cid).estado=id;aviso('candidato',`El principal ha ${id} tu solicitud de ${cid}.`);});location.reload();return;
      }
      if(a==='guardar-contribucion'){
        if(s.actor!=='principal'||c.estado!=='aceptado')return;
        const n=document.querySelector('#contribucion')?.value;if(n===''||n==null||+n<0)return;
        cambiar(x=>{convivenciaMutable(x,cid).contribucion=n;});location.reload();return;
      }
    }
    if(a==='nuevo-comprobante'){const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;if(pagoDe(oid).estado!=='rechazada')return;cambiar(x=>{const pago=pagoMutable(x,oid),o=x.ofertas.find(y=>y.id===oid);Object.assign(pago,{estado:'proxima',referencia:'',archivo:'',fechaTransferencia:'',monto:o?.precio||pago.monto,duplicado:false,contraste:'',observacion:''});});location.reload();return;}
    if(a==='duplicado'){const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;if(pagoSuspendidoPorS02(oid)||pagoDe(oid).estado!=='pendiente')return;cambiar(x=>{const pago=pagoMutable(x,oid);pago.duplicado=true;pago.observacion='Referencia o archivo repetido: marcado para revisión; requiere contraste externo ficticio.';});location.reload();return;}
    if(a==='decidir-pago'){const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id,pago=pagoDe(oid);if(pagoSuspendidoPorS02(oid)||pago.estado!=='pendiente'||!['pagada','rechazada'].includes(id)||!['favorable','no_acreditado','discrepancia'].includes(pago.contraste)||!pago.observacion?.trim())return;const permitido=id==='pagada'?pago.contraste==='favorable':pago.contraste!=='favorable';if(!permitido)return;cambiar(x=>{pagoMutable(x,oid).estado=id;const contrato=x.ofertas.find(o=>o.id===oid),mes=mesDemostracion(contrato)?.texto||'Mensualidad',destino=unidad(contrato?.unidad)?.modalidad==='completa'?'principal':'arrendatario';aviso(destino,id==='pagada'?`Pago de ${mes} del contrato ${oid} confirmado tras contraste ficticio.`:`Comprobante de ${oid} rechazado; consulta el motivo.`);if(id==='pagada')aviso('arrendador',`Pago de ${mes} del contrato ${oid} confirmado tras contraste ficticio de soporte.`);});location.reload();return;}
    if(a==='resolver-s02'){const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;if(!cancelacionDe(oid).s02||cancelacionDe(oid).estado!=='revision')return;cambiar(x=>{cancelacionMutable(x,oid).estado='resuelta';cancelacionMutable(x,oid).decision='Cancelación S02 aceptada tras revisión manual.';aviso('arrendatario','S02 resuelto: contrato cancelado, abril en revisión por soporte.');});location.reload();return;}
  });
  document.addEventListener('submit',ev=>{const form=ev.target;if(!(form instanceof HTMLFormElement)||!['filtros','registro','publicacion','oferta','chat','comprobante','contraste','cancelacion','resena'].includes(form.id))return;ev.preventDefault();const fd=new FormData(form),s=estado();form.querySelectorAll('.error').forEach(x=>x.textContent='');
    if(form.id==='filtros'){cambiar(x=>{x.filtros={precio:valor(fd,'precio'),servicio:valor(fd,'servicio'),regla:valor(fd,'regla'),habitaciones:valor(fd,'habitaciones'),disponibles:fd.has('disponibles')};});location.reload();}
    if(form.id==='registro'){if(!validarObligatorios(form,['nombre','correo']))return;if(posibleFallo())return;esperar('Abriendo sesión ficticia…',()=>{cambiar(x=>{x.perfil=Object.fromEntries(fd.entries());x.borradorRegistro={};x.actor=valor(fd,'tipoPerfil')==='arrendador'?'arrendador':'arrendatario';x.sesionActiva=true;});ir(destinoSeguro(form.dataset.volver));});}
    if(form.id==='publicacion'){
      if(!tieneSesion('arrendador'))return;
      const data={...Object.fromEntries(fd.entries()),id:s.borradorPublicacion.id,servicios:fd.getAll('servicios'),modalidades:fd.getAll('modalidades')};
      const fallo=errorPublicacion(data,s.borradorMedios);
      if(fallo){const caja=form.querySelector('#error-publicacion');if(caja)caja.textContent=fallo;else document.querySelector('#estadoAccion').innerHTML='<div class="aviso errorbox" role="alert">'+fallo+'</div>';return;}
      cambiar(x=>{x.borradorPublicacion=data;});
      ir('publicar.html?vista=previa'+(data.id?'&editar='+encodeURIComponent(data.id):''));return;
    }
    if(form.id==='oferta'){
      if(!tieneSesion('arrendatario'))return;
      const id=form.dataset.id,u=unidad(id),pub=publicacion(u?.publicacionId),b={...Object.fromEntries(fd.entries()),unidadId:id,publicacionId:pub?.id,modalidad:u?.modalidad,nombreVivienda:pub?.nombre};
      const fallo=errorOferta(b,u);
      if(fallo){document.querySelector('#estadoAccion').innerHTML='<div class="aviso errorbox" role="alert">'+fallo+'</div>';return;}
      if(!pub||pub.estado!=='publicada'||!disponibilidad(u,b).disponible){document.querySelector('#estadoAccion').innerHTML='<div class="aviso errorbox" role="alert">La modalidad no está disponible para estas fechas.</div>';return;}
      cambiar(x=>{x.borradorOferta[id]=b;});
      ir(`oferta.html?id=${encodeURIComponent(pub.id)}&modalidad=${u.modalidad}&vista=resumen&inicio=${encodeURIComponent(b.inicio)}&fin=${encodeURIComponent(b.fin)}`);return;
    }
    if(form.id==='chat'){
      if(!validarObligatorios(form,['mensaje']))return;
      const tema=form.dataset.tema,id=new URLSearchParams(location.search).get('id')||s.ofertas[0]?.id;
      const permitido=tema==='convivencia'?convivenciaDe(id).eleccion==='admitir'&&convivenciaDe(id).estado==='delegado'&&['principal','candidato'].includes(s.actor):tema==='soporte'?s.actor!=='visitante':['arrendador','arrendatario','principal'].includes(s.actor);
      if(!permitido)return;
      if(posibleFallo())return;
      const m={actor:s.actor,texto:valor(fd,'mensaje'),id};
      cambiar(x=>{if(tema==='soporte'){x.chats.soporte.push(m);if(x.actor!=='soporte')x.interlocutoresSoporte[id]=x.actor;}else if(tema==='convivencia')convivenciaMutable(x,id).mensajes.push(m);else x.chats.contrato.push(m);x.borradorChat[tema==='convivencia'?tema+':'+id:id]='';});
      mostrarMensajeChat(m,s.actor);form.elements.mensaje.value='';
      const botonEnviar=form.querySelector('button[type=submit]');if(botonEnviar)botonEnviar.disabled=true;
      const estadoChat=document.querySelector('#estadoChat');if(estadoChat)estadoChat.textContent='Esperando respuesta automática simulada…';
      setTimeout(()=>{
        const respuesta={...respuestaSimulada(tema,s.actor,tema==='soporte'?cancelacionDe(id).estado:'',interlocutorSoporte(id,s,new URLSearchParams(location.search).get('interlocutor'))),id,simulada:true};
        cambiar(x=>{if(tema==='soporte')x.chats.soporte.push(respuesta);else if(tema==='convivencia')convivenciaMutable(x,id).mensajes.push(respuesta);else x.chats.contrato.push(respuesta);});
        mostrarMensajeChat(respuesta,s.actor);
        if(estadoChat)estadoChat.textContent='Respuesta automática simulada recibida.';
        if(botonEnviar)botonEnviar.disabled=false;
      },700);
      return;
    }
    if(form.id==='comprobante'){procesarComprobante(form,fd,{error,posibleFallo,esperar});return;}
    if(form.id==='contraste'){if(!validarObligatorios(form,['resultadoContraste','observacion']))return;const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;if(pagoSuspendidoPorS02(oid)||pagoDe(oid).estado!=='pendiente')return;cambiar(x=>{const pago=pagoMutable(x,oid);pago.contraste=valor(fd,'resultadoContraste');pago.observacion=valor(fd,'observacion');});location.reload();}
    if(form.id==='cancelacion'){if(!validarObligatorios(form,['causa']))return;if(posibleFallo())return;const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;esperar('Enviando solicitud de demostración…',()=>{cambiar(x=>{const caso=cancelacionMutable(x,oid);caso.estado='revision';caso.causa=valor(fd,'causa');x.borradorCancelacion='';aviso('soporte',`Contrato ${oid}: nueva solicitud de cancelación.`);});location.reload();});}
    if(form.id==='resena'){if(!validarObligatorios(form,['comentario']))return;const o=contratoParaSeguimiento(new URLSearchParams(location.search).get('id')),elegible=s.actor==='arrendador'||s.actor==='principal'||(s.actor==='arrendatario'&&unidad(o?.unidad)?.modalidad==='habitacion')||(s.actor==='candidato'&&convivenciaDe(o?.id).estado==='aceptado');if(!o?.finalizado||!elegible)return;cambiar(x=>{x.resenas.push({contratoId:o.id,actor:x.actor,estrellas:+valor(fd,'estrellas'),comentario:valor(fd,'comentario')});});location.reload();}
  });
}
