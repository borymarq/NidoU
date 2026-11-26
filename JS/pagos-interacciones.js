import { cambiar, aviso, contratoParaSeguimiento, pagoDe, pagoMutable, mesDemostracion, cancelacionDe } from './estado.js';

let urlPrevia;
export function iniciarVistaComprobante() {
  document.addEventListener('change',ev=>{
    if(ev.target.id!=='archivo')return;
    const archivo=ev.target.files[0],vista=document.querySelector('#vistaComprobante'),error=document.querySelector('#error-archivo');
    if(urlPrevia){URL.revokeObjectURL(urlPrevia);urlPrevia=null;}
    if(error)error.textContent='';
    if(!vista)return;
    vista.replaceChildren();
    if(!archivo){vista.textContent='Aún no hay archivo seleccionado.';return;}
    const valido=(archivo.type.startsWith('image/')||archivo.type==='application/pdf'||archivo.name.toLowerCase().endsWith('.pdf'))&&archivo.size<=1000000;
    if(!valido){if(error)error.textContent='Elige una imagen o PDF ficticio de menos de 1 MB.';vista.textContent='Selecciona otro archivo para reintentar.';ev.target.value='';return;}
    try {
      urlPrevia=URL.createObjectURL(archivo);
      const titulo=document.createElement('p');titulo.textContent='Vista previa local: '+archivo.name;vista.append(titulo);
      const medio=document.createElement(archivo.type.startsWith('image/')?'img':'object');
      if(medio.tagName==='IMG'){medio.src=urlPrevia;medio.alt='Vista previa del comprobante ficticio '+archivo.name;}
      else{medio.data=urlPrevia;medio.type='application/pdf';medio.setAttribute('aria-label','Vista previa del PDF ficticio '+archivo.name);}
      vista.append(medio);
    } catch {
      if(error)error.textContent='No se pudo mostrar la vista previa. Elige otro archivo.';
      vista.textContent='Vista previa no disponible.';
      ev.target.value='';
    }
  });
}

export function procesarComprobante(form,fd,{error,posibleFallo,esperar}) {
  const oid=new URLSearchParams(location.search).get('id')||contratoParaSeguimiento()?.id;
  const contrato=contratoParaSeguimiento(oid),caso=cancelacionDe(oid);
  if(!contrato||contrato.finalizado||!mesDemostracion(contrato)||pagoDe(oid).estado!=='proxima'||(caso.s02&&caso.estado==='resuelta'))return error(form,'archivo','Este contrato no tiene una mensualidad disponible para enviar.');
  for(const n of ['referencia','monto','fechaTransferencia'])if(!String(form.elements[n]?.value||'').trim())return error(form,n,'Completa este campo para continuar.');
  const archivo=form.elements.archivo.files[0];
  if(!archivo)return error(form,'archivo','Selecciona un archivo ficticio.');
  if(archivo.size>1000000||!(archivo.type.startsWith('image/')||archivo.type==='application/pdf'||archivo.name.toLowerCase().endsWith('.pdf')))return error(form,'archivo','Elige una imagen o PDF ficticio de menos de 1 MB.');
  if(posibleFallo())return;
  esperar('Enviando solicitud de verificación…',()=>{
    cambiar(s=>{
      const o=s.ofertas.find(x=>x.id===oid),mes=mesDemostracion(o),pago=pagoMutable(s,oid);
      const referencia=String(fd.get('referencia')||'').trim(),fecha=String(fd.get('fechaTransferencia')||'');
      const usados=[s.pago,...Object.values(s.pagosPorContrato)].filter(Boolean);
      const duplicado=usados.some(p=>(p.referencia&&p.referencia===referencia)||(p.archivo&&p.archivo===archivo.name));
      const notas=[];
      if(duplicado)notas.push('Referencia o archivo repetido: revisar con evidencia ficticia.');
      if(+fd.get('monto')!==o.precio)notas.push('Monto distinto al contrato: revisar.');
      if(mes&&fecha.slice(0,7)!==mes.clave)notas.push('Fecha distinta al mes de ejemplo: revisar; el pago anticipado puede explicarla.');
      Object.assign(pago,{estado:'pendiente',referencia,monto:+fd.get('monto'),fechaTransferencia:fecha,archivo:archivo.name,duplicado,contraste:'',observacion:notas.join(' ')});
      delete s.borradorComprobante[oid];
      aviso('soporte','Comprobante ficticio de '+(mes?.texto||'mensualidad')+' para '+oid+' pendiente de contraste.');
    });
    location.reload();
  });
}
