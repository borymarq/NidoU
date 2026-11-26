import { estado, cambiar } from './estado.js';
import { escapeHTML as e } from './datos.js';

const leer = a => new Promise((ok,no) => { const r=new FileReader(); r.onload=()=>ok(r.result); r.onerror=()=>no(new Error('lectura')); r.readAsDataURL(a); });
export const elementosMedios = m => m?.items || [...(m?.fotos||[]).map(x=>({...x,tipo:'foto'})),...(m?.video?[{...m.video,tipo:'video'}]:[])];

export function galeria(m, editable=false, activo=0) {
  const items=elementosMedios(m);
  if(!items.length) return '<p class="muted">Todavía no hay medios ficticios seleccionados.</p>';
  const i=Math.max(0,Math.min(activo,items.length-1)), x=items[i];
  const grande=x.tipo==='video'?`<video controls preload="metadata" src="${x.datos}" aria-label="Video ficticio ${e(x.nombre)}"></video>`:`<img src="${x.datos}" alt="Foto ficticia ${i+1}: ${e(x.nombre)}">`;
  return `<div class="galeria" data-activo="${i}"><div class="medio-grande">${grande}</div><div class="galeria-barra"><button type="button" class="secundario" data-galeria="anterior" ${i===0?'disabled':''}>← Anterior</button><span>${i+1} de ${items.length}: ${e(x.nombre)}</span><button type="button" class="secundario" data-galeria="siguiente" ${i===items.length-1?'disabled':''}>Siguiente →</button></div><div class="galeria-puntos" aria-label="Posición en galería">${items.map((y,n)=>`<button type="button" data-galeria="${n}" aria-label="Ver ${y.tipo} ${n+1}" aria-current="${n===i?'true':'false'}">${n+1}</button>`).join('')}</div>${editable?`<div class="media-edicion"><button type="button" class="secundario" data-media="subir" ${i===0?'disabled':''}>Mover antes</button><button type="button" class="secundario" data-media="bajar" ${i===items.length-1?'disabled':''}>Mover después</button><button type="button" class="peligro" data-media="quitar">Quitar medio</button></div>`:''}</div>`;
}

export function iniciarMedios() {
  document.addEventListener('error',ev=>{
    if(!ev.target.matches?.('img[data-miniatura]'))return;
    ev.target.hidden=true;
    const alternativa=ev.target.parentElement?.querySelector('.respaldo-miniatura');
    if(alternativa)alternativa.hidden=false;
  },true);
  document.addEventListener('change',async ev=>{
    if(ev.target.id!=='mediosArchivo')return;
    const archivos=[...ev.target.files],error=document.querySelector('#error-medios'),estadoUI=document.querySelector('#estadoMedios');
    if(error)error.textContent='';if(!archivos.length)return;
    if(estadoUI)estadoUI.textContent='Leyendo medios de demostración…';
    const actual=elementosMedios(estado().borradorMedios);
    try {
      const tamanoActual=actual.reduce((n,x)=>n+(x.datos?.length||0),0);
      const tamanoNuevo=archivos.reduce((n,x)=>n+Math.ceil(x.size*4/3),0);
      if(actual.length+archivos.length>12||tamanoActual+tamanoNuevo>3500000||archivos.some(a=>!(a.type.startsWith('image/')&&a.size<=500000||a.type.startsWith('video/')&&a.size<=1000000))){
        if(error)error.textContent='Usa hasta 12 fotos o videos ficticios. Cada foto debe ocupar menos de 500 KB, cada video menos de 1 MB y el conjunto menos de 3,5 MB.';
        if(estadoUI)estadoUI.textContent='';return;
      }
      const nuevos=await Promise.all(archivos.map(async a=>({nombre:a.name,tipo:a.type.startsWith('video/')?'video':'foto',datos:await leer(a)})));
      if(tamanoActual+nuevos.reduce((n,x)=>n+x.datos.length,0)>3500000)throw new Error('tamaño');
      cambiar(s=>{s.borradorMedios={items:[...actual,...nuevos]};});
      document.querySelector('#vistaMedios').innerHTML=galeria(estado().borradorMedios,true,actual.length);
      if(estadoUI)estadoUI.textContent='Medios listos. Puedes añadir más archivos y cambiar el orden.';
    } catch (fallo) {
      estado().borradorMedios={items:actual};
      if(error)error.textContent=fallo.message==='lectura'?'No se pudo leer un archivo. Vuelve a seleccionarlo.':'No se pudieron guardar los medios. Prueba con archivos más pequeños o vuelve a seleccionarlos.';
      if(estadoUI)estadoUI.textContent='';
    } finally { ev.target.value=''; }
  });
  document.addEventListener('click',ev=>{
    const b=ev.target.closest('[data-galeria],[data-media]');if(!b)return;
    const cont=b.closest('.galeria'),i=+(cont?.dataset.activo||0);
    if(b.dataset.galeria!==undefined){
      const n=b.dataset.galeria==='anterior'?i-1:b.dataset.galeria==='siguiente'?i+1:+b.dataset.galeria;
      const m=cont.closest('#vistaMedios')?estado().borradorMedios:window.__nidouMediosFicha;
      cont.outerHTML=galeria(m,!!cont.closest('#vistaMedios'),n);return;
    }
    if(!cont.closest('#vistaMedios'))return;
    const items=[...elementosMedios(estado().borradorMedios)];
    if(b.dataset.media==='quitar')items.splice(i,1);
    else{const j=i+(b.dataset.media==='subir'?-1:1);if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];}
    cambiar(s=>{s.borradorMedios={items};});
    document.querySelector('#vistaMedios').innerHTML=galeria(estado().borradorMedios,true,b.dataset.media==='quitar'?i:i+(b.dataset.media==='subir'?-1:1));
  });
}
