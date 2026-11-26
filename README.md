# Prototipo web de NidoU

Versión de trabajo del **26 de noviembre de 2026**. Solo usa datos ficticios y estado local del navegador. No comprueba identidad, transferencias, rutas ni contenido de medios.

## Abrir

Desde la raíz de este repositorio:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/` (redirige a `HTMLS/index.html`). Se necesita un servidor local para los módulos JavaScript. Inicio abre como visitante, sin viviendas cargadas. **Buscar viviendas** es público. **Publicar una vivienda** pide sesión ficticia de arrendador; preparar una oferta pide sesión de arrendatario. Crear o iniciar sesión requiere solo nombre y correo inventados y devuelve al paso original. La cabecera permite cerrar sesión sin borrar publicaciones.

Los casos de prueba están en `http://localhost:8000/HTMLS/qa.html`, una URL directa sin enlace desde el producto. Usan almacenamiento separado. **Salir de pruebas** vuelve al producto y recupera sus publicaciones y ofertas; cerrar sesión desde un caso también abandona QA. Los datos de QA no sustituyen los del producto. La clave antigua v2 de producto se adapta al modelo agrupado al abrirlo; un escenario v2 antiguo se descarta para evitar unidades ocultas.

## Páginas

| Página | Recorrido |
| --- | --- |
| `HTMLS/index.html` | Inicio de visitante y acciones principales. |
| `HTMLS/explorar.html` | Una tarjeta por vivienda publicada, filtros y vacío útil. |
| `HTMLS/ficha.html?id=V01` | Ficha pública; selección de modalidad y fechas antes de ofertar. |
| `HTMLS/registro.html` | Acceso ficticio contextual y retorno a la acción. |
| `HTMLS/publicar.html` | Crear o editar vivienda, medios y vista previa. |
| `HTMLS/oferta.html?id=V01&modalidad=habitacion` | Formulario y resumen de oferta de una opción. |
| `HTMLS/ofertas.html` | Ofertas; el arrendador también edita, elimina o retira sus viviendas. |
| `HTMLS/contrato.html?id=…` | Aceptaciones, modalidad y términos guardados. |
| `HTMLS/convivencia.html?id=…` | Elección, solicitud, delegación y contribución. |
| `HTMLS/chat.html` | Conversaciones con respuestas automáticas simuladas. |
| `HTMLS/pagos.html?id=…` | Mensualidad y comprobante ficticio. |
| `HTMLS/soporte.html?id=…` | Contraste y cancelación S02. |
| `HTMLS/cancelacion.html?id=…` | Solicitud y seguimiento. |
| `HTMLS/resenas.html` | Reseñas según elegibilidad. |
| `HTMLS/qa.html` | Escenarios, cambio de función y reinicio de pruebas. |

`CSS/estilos.css` es la **única hoja global**. `JS/estado.js` guarda producto y QA por separado; `JS/publicaciones-modelo.js` valida y construye viviendas; `JS/vistas-publicaciones.js` dibuja búsqueda, ficha, publicación, oferta y contrato; `JS/interacciones.js` procesa formularios y decisiones.

## Recorridos principales

1. **Crear tres viviendas.** Entrar como arrendador desde Publicar. Crear V01 solo habitación, V02 solo completa y V03 con ambas. En cada caso completar datos, servicios, fechas, capacidad y precio de las opciones elegidas y al menos una foto o video ficticio. Revisar vista previa y confirmar. Explorar muestra una tarjeta y una ficha por vivienda. La primera foto, aun si aparece después de un video, es la miniatura. Una publicación sin foto usa ilustración neutra.
2. **Elegir y ofertar.** Abrir la ficha mixta como visitante; seleccionar modalidad y fechas, consultar y pulsar Preparar oferta. Crear o iniciar sesión arrendataria y comprobar que conserva vivienda, modalidad y período. Revisar precio, ocupantes y condiciones antes de enviar. El último paso pide identificadores ficticios `DEMO-` de cédula, tarjeta y cuenta. No se realiza cobro ni se guardan esos números.
3. **Comprobar bloqueo.** Enviar ofertas de habitación y completa para fechas iguales: ambas permanecen disponibles. Aceptar una oferta y luego el contrato por ambas partes. La opción incompatible queda bloqueada solo para fechas solapadas; otra habitación libre o un período posterior sigue disponible según cupos.
4. **Gestionar como arrendador.** Desde Publicaciones y ofertas, editar descripción, servicios, precios o medios. La tarjeta y la ficha reflejan el cambio; ofertas y contratos anteriores mantienen precio, modalidad y fechas originales. Sin contrato aceptado, Eliminar pide confirmación y quita la vivienda de Explorar. Con contrato aceptado, Retirar pide confirmación y conserva el historial.
5. **Rutas directas y QA.** Abrir `publicar.html?vista=previa` sin borrador y `oferta.html?id=V01&modalidad=habitacion&vista=resumen` sin oferta preparada: ambas regresan al formulario con explicación, y las acciones finales revalidan. En `qa.html`, cargar A/B/S02 o pagos, salir y comprobar que el producto no muestra esas ofertas. Volver a QA para continuar los casos antiguos, ahora agrupados en una tarjeta A y una B.

## Límites y revisión

Los archivos ficticios se leen localmente y se guardan como datos de demostración en `localStorage`; usa archivos pequeños. La edición no cambia ofertas o contratos anteriores. La política definitiva de cambios y retiros sigue abierta en P-10. La revisión técnica está en `REVISION.md`. Los clics reales, archivos, teclado y aspecto a 390 y 1280 px requieren retest de QA porque el navegador no estuvo disponible en este turno. El usuario aún no ha aprobado el prototipo ni se ha elegido stack de producción.
