# Revisión técnica del prototipo web

## Ciclo 2 · Publicación única y cierre V1 · 26 de noviembre de 2026

**Entrega para QA.** La herramienta de interfaz devolvió `apps: [], browsers: []`. Los resultados siguientes provienen de estado, renderizado y eventos simulados en Node con datos ficticios; no se observaron clics reales, archivos seleccionados en navegador, recarga visual, teclado ni anchos 390/1280 px.

| Caso | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| V1-01, vista previa directa y confirmación | Sin borrador válido, explicar el problema y volver al formulario; confirmar revalida. | La vista previa sin borrador mostró «Completa la publicación» y ningún botón final. Un evento de confirmación invocado directamente no creó unidades y regresó al formulario. Con tres borradores válidos creó V01, V02 y V03, una vivienda cada uno. | Pasa técnica; navegador pendiente. |
| V1-02, resumen directo y envío | Sin borrador, evitar $0 y excepción; conservar opción y fechas. | El resumen sin borrador mostró el regreso al formulario. Un evento final directo no creó oferta ni lanzó excepción; la URL recuperable conservó vivienda y modalidad. | Pasa técnica; navegador pendiente. |
| V1-03, salir de QA | Casos y producto separados; conservar publicaciones normales sin ofertas huérfanas. | Se guardó V01 en producto, se cargó A01 en QA y se cerró sesión. Producto recuperó V01, sin A01 ni unidades A visibles. `qa.html` usa una clave aparte y ofrece «Salir de pruebas». | Pasa estado; navegación real pendiente. |
| Vivienda y modalidades | Una tarjeta/ficha por vivienda; opciones y precios propios. | V01 con habitación y completa, V02 solo habitación y V03 solo completa produjeron tres objetos y tres tarjetas. La ficha ofreció modalidad, precio, capacidad y fechas por opción. La migración v2 agrupó C/C1 en una publicación con alias históricos. | Pasa módulo; navegador pendiente. |
| Bloqueo y contrato | Oferta sola no bloquea; contrato aceptado bloquea opción incompatible solo en fechas solapadas. | Una oferta de habitación dejó disponible la completa. Tras dos aceptaciones, la completa quedó bloqueada en enero–junio de 2028; otra habitación siguió disponible por cupo y la completa lo estuvo en 2029. | Pasa estado; clics pendientes. |
| Oferta válida y dos aceptaciones | Guardar modalidad y términos sin conservar tarjeta/cuenta ficticias. | Un envío simulado creó una oferta de vivienda completa V01 a $515, con dos ocupantes y fechas de 2028. Arrendador y arrendatario aceptaron por separado; el actor pasó a principal, la habitación incompatible quedó bloqueada y los identificadores `DEMO-` no aparecieron en el estado. | Pasa evento; navegador pendiente. |
| Editar, eliminar, retirar | Cambios visibles sin alterar términos anteriores; eliminación sin contrato y retiro con contrato preservan historial. | La edición actualizó nombre, descripción, precio, servicios y foto de tarjeta/ficha; una oferta anterior retuvo nombre y $250. Eliminar marcó V02 como eliminada; V01 con contrato solo admitió Retirar y conservó su oferta. | Pasa estado/evento; navegador pendiente. |
| Oferta de vivienda eliminada | Conservar el historial sin permitir aceptar una oferta de publicación ya eliminada. | La oferta U01 siguió visible, pero el panel no mostró «Aceptar oferta» y un evento de aceptación directo no cambió su estado. | Pasa estado/evento; navegador pendiente. |
| Miniatura | Primera foto aunque preceda un video; alternativa si no hay foto o falla. | Un video seguido de foto produjo miniatura de la foto. El código presenta alternativa si no existe foto y oculta la imagen fallida ante error de carga; estas dos alternativas requieren inspección visual. | Parcial técnica; navegador pendiente. |
| Regresión de vistas | Escenarios agrupados sin excepciones. | Se renderizaron 504 combinaciones de escenario, función y página sin excepción. QA muestra A y B como viviendas agrupadas; las unidades antiguas quedan como alias para contratos de prueba. | Pasa módulo; navegador pendiente. |

QA debe repetir primero V1-01 a V1-03 con clics, incluidos acceso contextual y regreso desde `qa.html`. Después crear tres viviendas con solo habitación, solo completa y ambas, subir medios ficticios, comprobar miniatura tras recarga, ofertar cada opción, aceptar contrato por ambas partes, editar y retirar o eliminar con confirmación. Revisar producto y QA a 390 y 1280 px, teclado, foco, enlace de retorno y estados de error. P-10 continúa provisional. No se hizo commit ni se tocó `NidoU/`.

## Ciclo 1 · Visitante y acceso contextual · 26 de noviembre de 2026

**Entrega para QA; ciclo 2 no iniciado.** La herramienta de interfaz devolvió `apps: [], browsers: []`. Se probaron módulos, estado y eventos simulados con datos ficticios. No se observaron clics reales, recarga real del navegador ni diseños a 390/1280 px.

| Caso | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| Estado limpio y legado | Inicio y Explorar abren como visitante sin actor, caso ni unidades A1/A2/A/B precargadas, incluso si existe el estado v1. | Con una clave v1 que guardaba Arrendador, X y A01, el estado v2 inició `visitante`, sin sesión, ofertas ni publicaciones. Inicio mostró Buscar viviendas y Publicar una vivienda; Explorar mostró el vacío útil y no renderizó unidades base. | Pasa módulo; navegador pendiente. |
| Publicar desde visitante | Solicitar sesión de arrendador y regresar al formulario. | La vista directa `publicar.html` mostró crear/iniciar sesión con retorno `publicar.html`; con sesión de arrendador mostró el formulario. | Pasa módulo; clics pendientes. |
| Oferta desde visitante y cambio explícito | Conservar vivienda, modalidad representada por unidad y fechas; requerir sesión de arrendatario. | `oferta.html?id=C&inicio=2028-01-01&fin=2028-06-30` mantuvo todos los parámetros en el enlace de acceso. Con sesión de arrendador ofreció cambio explícito; con sesión de arrendatario mostró el formulario. | Pasa módulo; clics pendientes. |
| Registro ficticio y retorno | Solo datos básicos; sesión activa y vuelta al punto original. | Envío simulado de nombre, correo y perfil estudiante creó sesión arrendataria y volvió a la URL completa de C. No se pidieron ni guardaron tarjeta o cuenta. | Pasa evento; navegador pendiente. |
| Cabecera con sesión | Mostrar identidad y cierre, sin acceso ni QA repetidos. | Con una sesión ficticia persistida, el montaje de Inicio mostró «Persona ficticia · Arrendador» y «Cerrar sesión», sin formulario de acceso ni «Probar casos». | Pasa módulo; navegador pendiente. |
| Salida y persistencia | Cerrar sesión revoca acceso sin borrar publicaciones. | Una publicación C ficticia se guardó en la clave v2, apareció en Explorar como visitante y permaneció tras cerrar sesión. | Pasa estado; recarga real pendiente. |
| Herramientas de QA | URL directa sin enlace en producto; escenarios conservados. | La cabecera e Inicio simulados no mostraron «Probar casos», selector de actores ni unidades de prueba. `qa.html` conserva el panel y los escenarios se cargan solo desde allí. | Pasa módulo; navegador pendiente. |

QA debe comprobar con clics: navegador limpio y clave local v1 con Arrendador; publicar y ofertar desde visitante; registro e inicio de sesión ficticios, retorno y cambio explícito de función; cabecera y salida; recarga y navegación con una publicación nueva; `qa.html` por URL directa; teclado y anchos 390/1280 px. La publicación aún conserva dos unidades C/C1 hasta el ciclo 2. No se hizo commit ni se tocó `NidoU/`.

## Cierre C3-01 y C3-02 · 26 de noviembre de 2026

**Entrega para retest de QA.** Se usaron contratos, vivienda, referencias y archivos ficticios. La herramienta de interfaz devolvió `apps: [], browsers: []`; las comprobaciones siguientes simulan estado y eventos en Node, sin clics ni medición visual en navegador.

| Caso | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| C3-01: contraste favorable antes de aceptar S02 | Tras aceptar S02, abril sigue en revisión; Soporte no ofrece confirmar ni rechazar y un evento de decisión no cambia el pago ni avisa al arrendador. | Antes de aceptar S02 se mostró la acción ordinaria. Después, la vista mostró «En revisión por soporte», explicación de suspensión y contraste previo como dato histórico; no hubo botones ni formulario ordinarios. Eventos simulados de confirmar, rechazar, duplicado y contraste conservaron el estado pendiente y no crearon aviso al arrendador. | Pasa prueba técnica; navegador pendiente. |
| C3-01: contraste después de aceptar S02 | No registrar contraste ni habilitar decisión ordinaria durante la revisión. | Con S02 ya aceptada y sin contraste, un envío simulado del formulario de contraste no cambió el estado. | Pasa prueba técnica; navegador pendiente. |
| C3-01: pago normal de otro contrato | La suspensión de A01 no bloquea C01. | C01 mantuvo «Confirmar pago» tras contraste favorable; el evento lo confirmó y avisó al arrendador. A01 siguió pendiente y aislado. | Pasa prueba técnica; navegador pendiente. |
| C3-02: catálogo y filtro Agua | Explorar ofrece los nueve servicios publicables; Agua encuentra C publicada con Agua. | El selector renderizó los nueve servicios de la lista compartida con Publicar. Aplicar Agua conservó la selección y mostró solo Vivienda C ficticia. | Pasa prueba técnica; navegador pendiente. |
| C3-02: servicio ausente y limpiar | Un servicio sin coincidencias muestra vacío; limpiar restaura la lista. | Aplicar Parqueo mostró «Sin resultados»; Limpiar borró los filtros y devolvió las viviendas. | Pasa prueba técnica; navegador pendiente. |

QA debe repetir en navegador las dos secuencias S02, incluida la revisión desde arrendador y soporte; confirmar un pago independiente C01; publicar C con Agua; aplicar Agua y un servicio ausente; limpiar desde el formulario y desde el estado vacío. Revisar escritorio y móvil. No se decidió el desenlace posterior de abril, no se hizo commit y no se inició código de producción.

## Ciclo 3 y correcciones C2 · 26 de noviembre de 2026

**Entrega para QA; sin aprobación visual.** La herramienta de UI volvió a mostrar `apps: [], browsers: []`. Se comprobaron módulos, estado y eventos simulados con datos ficticios en Node. No se afirma haber pulsado la interfaz, adjuntado archivos en un navegador ni medido el diseño a 390 o 1280 px.

| Caso | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| C2-01, A01 y C01 completos | Entrar desde C01 mantiene Vivienda C; solicitud, chat, decisión y contribución no alteran A01. | El renderizado de `?id=C01` mostró Vivienda C, C01 y enlace de regreso a C01. Eventos simulados de elección, contacto, delegación, dos mensajes, aceptación y contribución $120 quedaron en C01; A01 siguió «sin contacto», sin mensajes ni contribución. | Pasa técnica; navegador pendiente. |
| C2-02, primera respuesta de soporte | Principal en vivienda completa; Arrendatario en habitación; Candidato en su caso. | Envíos simulados desde Soporte atribuyeron la primera respuesta a Principal en A01 completo, Arrendatario en A02 habitación y Candidato con contexto de solicitud. Todas quedaron marcadas como respuestas simuladas. | Pasa técnica; navegador pendiente. |
| Pago pendiente y duplicado | Subir archivo no equivale a pagado ni avisa al arrendador. | Al enviar un archivo ficticio simulado para C01, el estado fue «pendiente», la referencia repetida quedó marcada para revisión, $515 y enero de 2028 se conservaron, A01 siguió «próxima» y no apareció aviso al arrendador. | Pasa técnica; archivo real pendiente. |
| Contraste, confirmación y rechazo | Solo contraste favorable permite confirmar; el rechazo conserva motivo. | La vista de soporte no ofreció «Confirmar pago» antes del contraste. Tras contraste favorable con observación, el evento cambió C01 a pagada y avisó al Principal y al Arrendador. Con contraste «no acreditado» cambió a rechazada y conservó «No acreditado en movimiento ficticio». | Pasa técnica; recorrido de clics pendiente. |
| Vista previa y error | Imagen o PDF ficticio pequeño visible antes del envío; exceso recuperable. | El evento de cambio simulado creó una vista previa de imagen. Un archivo de más de 1 MB mostró error, limpió la selección y revocó la URL temporal. El contenido no se guarda en el estado. | Pasa técnica; PDF y archivo real pendientes. |
| Vistas y enlaces | Módulos sin excepción y destinos locales existentes. | Se renderizaron 504 combinaciones de escenario, función y página sin excepción. Se encontraron 14 destinos HTML distintos y ninguno faltante. | Pasa módulo. |
| Diseño móvil, escritorio y teclado | Sin desbordamiento, foco visible, lectura clara y pasos comprensibles. | CSS y estructura revisados, pero sin navegador no se observó el resultado visual ni la secuencia de foco. | **Pendiente de QA.** |

El vencimiento se muestra como **pendiente de definir**, conforme a P-05; el prototipo no inventa un día de cobro. QA debe repetir C1-01, C1-02, C2-01, C2-02 y el pago completo con archivos ficticios en navegador, en 390 y 1280 px, incluyendo teclado y los tres actores. No se hizo commit ni se inició código de producción.

## Ciclo 2 y correcciones C1 · 26 de noviembre de 2026

**Entrega para QA; pruebas de navegador pendientes.** El inventario de la herramienta de UI volvió a mostrar apps y navegadores vacíos. Las comprobaciones siguientes son de módulo, estado y eventos simulados en Node. No sustituyen clics, archivos reales ni inspección visual a 1280 y 390 px.

| Caso | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| C1-01: foto, video y varias selecciones | Sin excepción; orden y borrador conservados. | El evento de cambio simulado aceptó una foto, un video y tres archivos adicionales; mantuvo el orden de selección y limpió el control. Un fallo de lectura y otro de almacenamiento conservaron el medio anterior y mostraron error recuperable. | Pasa prueba técnica; navegador pendiente. |
| C1-01: límites | 12 medios permitidos; 13 y exceso de tamaño rechazados. | Se aceptaron 12; el decimotercero mostró el límite sin cambiar la lista. El cálculo usa medios leídos y tamaños de archivos nuevos, sin leer datos de un archivo aún no procesado. | Pasa prueba técnica; límites con archivos reales pendientes. |
| C1-02: A01 y C/C1 | IDs propios y únicos; precio y mes del contrato correcto. | Con A01 presente, el envío simulado de C a $515 creó C01, enero de 2028 y pago de $515. C1 obtuvo C02 y pago separado. Mensualidad y soporte mostraron $515 y enero de 2028. El estado no guardó el identificador ficticio de tarjeta. | Pasa prueba técnica; recorrido de clics pendiente. |
| Convivencia | Decisión del principal antes del contacto; delegación y decisión por función. | El escenario inicia como principal sin elección. El candidato no pudo contactar antes de «Admitir». Después se reprodujo contacto → delegación → rechazo. «Vivir solo» cerró la solicitud y bloqueó el contacto. Las vistas de cada función mostraron permisos distintos. | Pasa prueba técnica; navegador pendiente. |
| Chat | Mensaje propio, espera y respuesta contextual simulada. | En el envío simulado, el mensaje propio apareció primero y el botón quedó deshabilitado durante la espera. La segunda entrada quedó marcada como simulada en convivencia, arriendo y soporte. Oferta, contrato, admisión y pago no cambiaron por el chat. | Pasa prueba técnica; navegador pendiente. |
| Sintaxis | Módulos editados cargan sin error. | Todos los módulos JS pasaron análisis sintáctico como ES modules. | Pasa. |

**QA debe repetir en navegador** C1-01 y C1-02 antes de evaluar el ciclo 2. Luego recorrer admisión, rechazo y vivir solo desde cada función; comprobar chat de arriendo, compañero y soporte, orden de mensajes, espera, rótulo de simulación, foco y controles a 1280 y 390 px. No se inició el ciclo 3.

## Ciclo 1 · 25 de noviembre de 2026

**Estado: listo para revisión de QA, con prueba de navegador pendiente.** La herramienta de navegador devolvió `Browser is not available: iab` y el inventario quedó vacío (`apps: [], browsers: []`). No se pudo cargar archivos ni inspeccionar las vistas a ancho móvil o de escritorio con clics en esta sesión.

| Comprobación | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| Cinco medios en orden mixto | foto1 → foto2 → video1 → video2 → foto3; medio grande, flechas y puntos. | Renderizado de módulo conservó esa secuencia; el video2 se mostró como video al activar la posición 4. | Pasa módulo; navegador pendiente. |
| Publicación C y C1 | Descripción, servicios múltiples y galería en ambas fichas. | Renderizado de ficha C con datos ficticios mostró descripción, Internet y Agua, y galería 1 de 5. C y C1 referencian una sola copia persistida de los medios. | Pasa módulo; recorrido pendiente. |
| Registro y oferta | Registro básico; cédula, tarjeta y cuenta ficticias al enviar. | Formulario de registro renderizó nombre y correo sin tarjeta ni cuenta. El resumen de oferta incluye los tres campos `DEMO-`; el estado de la oferta solo guarda `datosDemoRegistrados`. | Pasa inspección de módulo; interacción pendiente. |
| Sintaxis | Módulos editados cargan sin error. | Cuatro módulos JS pasaron análisis sintáctico como ES modules. | Pasa. |
| Escritorio y móvil | Carga de cinco archivos ficticios, orden, vista previa, ficha, errores y reintento a 1280 y 390 px. | No observado: no había navegador disponible. | Pendiente de QA. |

Se usaron nombres y datos inventados en las pruebas de módulo; no se usaron fotos, videos, tarjetas ni cuentas reales. No se inicia el ciclo 2.


## Correcciones WEB-01 a WEB-07 · 21 de noviembre de 2026

El estado de esta iteración **no equivale a aprobación de QA**. Se probaron con clics los pasos indicados; las demás verificaciones se consignan como revisión de módulo o pendientes.

| Caso y pasos | Esperado | Observado | Estado |
| --- | --- | --- | --- |
| WEB-01: desde inicio cargar «Dos ofertas y aceptación», abrir B, consultar 1 ene–30 jun 2028, enviar B01 y aceptar como arrendador y arrendatario. Abrir contrato y pago. | Mes inicial de ejemplo enero de 2028, $680; no abril de 2027. | `contrato.html?id=B01` mostró «enero de 2028 · $680»; `pagos.html?id=B01` mostró enero de 2028 y el formulario de ese contrato. | **Comprobado con clics** en escritorio. |
| WEB-02: C con 1 ene–30 jun 2028. | Fechas de C en ficha y oferta tras navegación. | Las unidades C/C1 guardan inicio y fin; renderizado de módulo mostró 2028 en ficha y oferta. | **Pendiente de repetir con publicación y archivos en navegador.** |
| WEB-03: abrir y cerrar «Probar casos», cargar ofertas. | Panel accesible y aviso antes de reemplazar datos; inicio de producto despejado. | En navegador, el panel abrió, mostró selector y seis casos; el aviso de reemplazo apareció y «Cerrar» devolvió el foco al botón. En vista móvil el panel fue desplazable. | **Comprobación parcial con clics**; falta auditoría completa de teclado y contraste. |
| WEB-04: en registro elegir Arrendador desde función Arrendatario principal, rellenar nombre y cédula ficticios y dejar cuenta vacía. | Error junto a cuenta, datos conservados. | El formulario quedó en la página, conservó los campos y mostró «Ingresa una cuenta ficticia» con foco en cuenta. | **Comprobado con clics** a ancho móvil. Cambio inverso pendiente. |
| WEB-05: cancelación de A01 habitación y B01 completa. | Solicitud y chat separados por contrato; solo S02 con resolución final. | Vistas y estado por contrato renderizaron sin excepción; B01 mostró «Solicitud de B01». | **Pendiente de recorrido completo con clics.** |
| WEB-06: ficha con fechas alternativas. | La consulta conserva fechas y ofrece oferta si no hay solapamiento. | En ficha B, «Consultar fechas» navegó a `?inicio=2028-01-01&fin=2028-06-30`; «Crear oferta» abrió el formulario con ambas fechas. Se corrigió una interceptación del formulario GET detectada durante la prueba. | **Comprobación parcial con clics**; falta el borde de A1 frente a A completa. |
| WEB-07: escoger fotos y video ficticios, ordenarlos y verlos en C. | Medios coherentes en vista previa y ficha. | Los controles, límites y galería están implementados y pasan sintaxis y renderizado sin archivos. | **Pendiente de prueba con archivos en navegador.** |
| CA-13 a CA-15: adjuntar PNG ficticio de un píxel al pago B01. | Pendiente, duplicado, contraste y decisión por soporte. | El navegador mostró el formulario correcto, pero la herramienta de carga se interrumpió antes de confirmar la selección. No se observó envío ni contraste. | **Pendiente; no cerrado.** |
| Móvil a 390 px: inicio, explorar, contrato B01, pagos B01 y registro. | Sin desbordamiento horizontal; panel usable. | El ancho de documento y contenido coincidió (375 px útiles) en las cuatro vistas medidas. Captura de inicio y panel mostró controles legibles; el panel abre y cierra. | **Muestra móvil comprobada**; faltan otras vistas, foco secuencial y contraste. |
| Módulos JS. | Sintaxis válida y vistas sin excepción. | Ocho módulos pasaron análisis sintáctico; 504 combinaciones de escenario, función y vista renderizaron sin excepción antes del último ajuste de texto. | **Prueba de módulo**, no prueba de navegador. |

Para repetir CA-13 a CA-15, crear un PNG ficticio local pequeño, cargar «Comprobante, duplicado y contraste», introducir una referencia `DEMO-REF-01` y seleccionar el archivo. Comprobar «pendiente de verificación» desde arrendatario y arrendador. Como soporte, marcar duplicado, registrar evidencia ficticia favorable y confirmar; repetir el escenario con «movimiento no acreditado» y rechazo con motivo. El comprobante no debe afirmar pago al subirlo. No usar comprobantes ni cuentas reales.

## Revisión anterior · 20 de noviembre de 2026

**20 de noviembre de 2026 · Prototipador.** Las pruebas siguientes comprueban módulos y estado simulado; no sustituyen una sesión de QA con clics y revisión visual a tamaño real.

| Caso | Esperado | Observado | Resultado |
| --- | --- | --- | --- |
| W-01, oferta y primera aceptación | A1, A2 y A completa ofertables. | Las tres devuelven disponible con contrato pendiente de segunda aceptación. | Pasa en prueba de estado. |
| W-01, ambas aceptaciones de A completa | Habitaciones A1/A2 bloqueadas para fechas solapadas; B no afectada. | A1/A2/A bloqueadas y B disponible. | Pasa en prueba de estado. |
| CA-04, contrato de A1 | A completa bloqueada; A2 disponible. | A no disponible, A1 ocupada y A2 disponible. | Pasa en prueba de estado. |
| CA-04, período no solapado | A completa disponible en otro período. | Disponible para enero a abril de 2028. | Pasa en prueba de estado. |
| W-02, ficha A2 y A completa | Nombre, modalidad y precio correctos. | A2 muestra habitación; A completa muestra vivienda completa y $470. | Pasa en renderizado de módulo. |
| Módulos de vista | Sin errores de sintaxis ni excepciones por escenario y función. | Se validó sintaxis de seis módulos y se renderizaron 420 combinaciones de escenario, función y vista sin excepción. | Pasa en prueba de módulo. |
| Enlaces entre páginas | Cada destino local existe. | 14 destinos distintos encontrados; ninguno inexistente. | Pasa en revisión estática. |
| Pagos A01/B01 | El comprobante de B01 no altera A01 ni presenta S02 como resolución de B. | A01 siguió «próxima» mientras B01 estaba «pendiente»; B mostró $680 y su referencia, sin aviso S02. | Pasa en prueba de estado y vista. |
| Navegador escritorio y móvil | Recorridos de clic, foco, contraste, anchos y archivos. | El entorno no expuso un navegador a la herramienta de UI y bloqueó la apertura de un servidor local (`PermissionError` de socket). | **Pendiente de QA en navegador.** |

No se generaron capturas de navegador. QA debe repetir los recorridos de `README.md` en 1280 px y 390 px, comprobar navegación por teclado y registrar hallazgos en `MEJORAS-PROTO.md` antes de solicitar aprobación del usuario.
