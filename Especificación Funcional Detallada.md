Especificación Funcional Detallada: Pizarra Táctica Interactiva
1. Introducción y Objetivo del Proyecto
El objetivo es desarrollar una aplicación web moderna que sirva como una pizarra táctica de fútbol, permitiendo a los usuarios registrarse, guardar sus formaciones y jugadas, y compartirlas de manera fluida. El sistema debe gestionar ligas y equipos, y operar en modos de uno o dos equipos, con herramientas de dibujo y exportación.

2. Historias de Usuario y Reglas de Negocio
3.1. Gestión de Usuarios y Persistencia de Datos
HU-1: Como usuario nuevo, quiero poder registrarme en la aplicación para tener una cuenta personal donde guardar mi trabajo.

Criterios de Aceptación:

Debe existir un formulario de registro que solicite un correo electrónico y una contraseña.

Debe incluir un campo de confirmación de contraseña para evitar errores.

Se deben realizar validaciones básicas (formato de email válido, contraseña con una longitud mínima).

Tras un registro exitoso, el usuario debe ser redirigido a la pizarra y su sesión debe iniciarse automáticamente.

HU-2: Como usuario registrado, quiero poder iniciar sesión para acceder a mis formaciones guardadas.

Criterios de Aceptación:

Debe existir un formulario de inicio de sesión que pida correo y contraseña.

El sistema debe mostrar un mensaje de error claro si las credenciales son incorrectas.

Un inicio de sesión exitoso debe llevar al usuario a la pizarra principal.

HU-3: Como usuario que ha iniciado sesión, quiero que mi sesión se mantenga activa si cierro y vuelvo a abrir el navegador.

Criterios de Aceptación:

La sesión del usuario debe ser persistente (ej. mediante tokens).

Debe existir un botón o enlace de "Cerrar Sesión" claramente visible para terminar la sesión de forma segura.

HU-4: Como usuario registrado, quiero poder guardar el estado actual de mi pizarra para poder recuperarlo más tarde.

Criterios de Aceptación:

Cuando un usuario ha iniciado sesión, debe aparecer un botón de "Guardar".

Al hacer clic, se le debe pedir al usuario que introduzca un nombre para su formación/pizarra.

El sistema debe guardar el estado completo del tablero asociado a la cuenta del usuario. Esto incluye:

La selección de equipos (local y visitante).

El modo de juego (1 o 2 equipos).

La posición y rol de cada jugador en el campo.

La posición del balón "fantasma".

Todos los dibujos realizados sobre el lienzo.

HU-5: Como usuario registrado, quiero poder ver una lista de mis pizarras guardadas y cargar una en el tablero.

Criterios de Aceptación:

Debe haber una sección en la interfaz (ej. un menú desplegable o un panel lateral) que liste todas las pizarras guardadas por el usuario.

Al hacer clic en el nombre de una pizarra guardada, el estado completo de esa pizarra debe cargarse en el tablero, reemplazando la configuración actual.

3.2. Selección de Equipos y Plantillas
HU-6: Como usuario, quiero poder seleccionar una liga para poder ver solo los equipos que pertenecen a ella.

Criterios de Aceptación:

La aplicación debe presentar un selector o lista de ligas disponibles (ej: Premier League, Champions League) obtenidas de una base de datos.

Al seleccionar una liga, las listas de equipos para "Local" y "Visitante" se deben actualizar para mostrar únicamente los equipos de esa competición.

HU-7: Como usuario, quiero seleccionar un equipo local y visitante para ver sus plantillas y poder usarlas en el tablero.

Criterios de Aceptación:

Deben existir dos selectores, uno para el equipo "Local" y otro para el "Visitante".

Al seleccionar un equipo, su plantilla debe cargarse en un carrusel horizontal debajo del nombre del equipo.

Cada jugador en el carrusel debe mostrarse como un botón estilo "pill" (completamente redondeado) con su posición general (GK, DF, MF, FW) y su nombre.

Los carruseles deben tener flechas de navegación a los lados para facilitar el desplazamiento en escritorio y móvil.

3.3. El Tablero Táctico y sus Modos
HU-8: Como usuario, quiero un interruptor para alternar entre los modos "1 Equipo" y "2 Equipos" para adaptar el tablero a mi necesidad de análisis.

Criterios de Aceptación:

Persistencia de Estado: Al cambiar de modo, los jugadores, el balón y los dibujos no se eliminan.

Recálculo Automático: El rol de cada jugador y la formación mostrada se deben recalcular inmediatamente según las reglas del nuevo modo.

Modo "1 Equipo": El campo se divide lógicamente en 3x3 (3 columnas, 3 filas). El balón "fantasma" es visible y utilizable.

Modo "2 Equipos": El campo se divide en 6x3 (6 columnas, 3 filas). El balón "fantasma" se oculta.

3.4. Gestión de Jugadores en el Campo
HU-9: Como usuario, quiero arrastrar jugadores desde la plantilla al campo para construir mi formación de manera visual e intuitiva.

Criterios de Aceptación:

La acción de arrastrar y soltar debe ser fluida. Se debe detectar una intención de arrastre solo si el cursor/dedo se mueve más de 10 píxeles para evitar conflictos con el "toque".

Al soltar un jugador en el campo, se le asigna un rol táctico por defecto basado en la zona.

HU-10: Como usuario, quiero mover jugadores que ya están en el campo para reajustar mi táctica dinámicamente.

Criterios de Aceptación:

Cualquier jugador (o el balón) en el tablero debe ser arrastrable y poder ser soltado en una nueva posición.

Al soltar un jugador en una nueva zona, su rol táctico y el contador de formación general deben actualizarse instantáneamente.

Regla de Respeto de Zona (Modo 2 Equipos): Un jugador solo puede ser contado para la formación de su equipo si se encuentra en su mitad correspondiente del campo (local en la izquierda, visitante en la derecha). Si un jugador es arrastrado a la mitad del campo rival, no debe sumar para la formación de ninguno de los dos equipos.

HU-11: Como usuario, quiero poder sacar jugadores del tablero para hacer sustituciones o corregir mi alineación.

Criterios de Aceptación:

Gesto de Eliminación: Para eliminar un jugador o el balón del tablero, el usuario debe arrastrar el elemento y soltarlo en cualquier lugar fuera de los límites del área de la cancha.

Actualización Inmediata: Una vez soltado fuera del campo, el elemento debe desaparecer del tablero y la formación táctica debe recalcularse y actualizarse al instante.

HU-12: Como usuario, quiero poder especificar el rol táctico exacto de un jugador una vez que está en el campo.

Criterios de Aceptación:

Interacción en Escritorio: Al hacer clic derecho sobre un jugador, debe aparecer un modal para seleccionar su rol.

Interacción en Móvil: Al hacer un toque suave (tap) sobre un jugador, debe aparecer el mismo modal.

El modal solo debe aparecer si la zona permite más de un rol táctico.

El texto del rol (ej: "DFC") debe aparecer dentro del círculo del jugador, y el nombre del jugador debajo.

Reglas de Lógica de Zonas:

Eje X (Horizontal - Líneas):

Local / Modo 1 Equipo: Izquierda -> Derecha = Defensa, Mediocampo, Ataque.

Visitante (Modo 2 Equipos): Derecha -> Izquierda = Defensa, Mediocampo, Ataque.

Eje Y (Vertical - Flancos):

Local / Modo 1 Equipo: El tercio de arriba es el flanco izquierdo, el del medio es el centro y el de abajo es el flanco derecho.

Visitante (Modo 2 Equipos): La lógica se invierte. El tercio de arriba es el flanco derecho, el del medio es el centro y el de abajo es el flanco izquierdo.

Reglas Específicas de Jugadores:

Regla del Portero (GK):

Un GK siempre tendrá el rol "GK", sin importar la zona.

El modal de selección de rol NUNCA debe aparecer para un GK.

Los GK NUNCA cuentan en el cálculo de la formación (ej: 4-3-3).

Regla del "Equipo Principal" (Solo en Modo 1 Equipo):

El primer jugador puesto en el campo define el "equipo principal".

La formación solo cuenta jugadores de este equipo.

Los jugadores del otro equipo son "fantasmas": no suman a la formación, no se les puede abrir el modal y no muestran el texto de su rol en el círculo.

3.5. Elementos Adicionales y Herramientas
HU-13: Como usuario en modo "1 Equipo", quiero añadir un balón al campo para ejemplificar jugadas.

Criterios de Aceptación:

Debe haber un icono de balón en la barra de herramientas que se pueda arrastrar al campo.

El balón debe usar una imagen PNG realista, ser más grande que antes y tener un borde blanco de 3px para resaltar.

Es un objeto "fantasma": arrastrable pero sin efecto en la lógica de formación.

HU-14: Como usuario, quiero herramientas de dibujo para realizar anotaciones tácticas sobre la pizarra.

Criterios de Aceptación:

La barra de herramientas debe permitir elegir entre modo Mover (por defecto) y modo Dibujar (Lápiz/Borrador).

Debe incluir un selector de color funcional en móvil y escritorio.

Debe incluir un slider para el grosor, un borrador y un botón para limpiar todo.

3.6. Exportación
HU-15: Como usuario, quiero tomar una captura de pantalla de mi jugada para guardarla o compartirla.

Criterios de Aceptación:

Un botón en la barra de herramientas debe iniciar la captura.

La imagen generada debe ser un archivo PNG del área completa de la cancha.

Debe incluir a los jugadores, el balón y todas las anotaciones dibujadas.

La imagen debe descargarse automáticamente en el dispositivo del usuario.

4. Requisitos No Funcionales
Rendimiento: Las interacciones de arrastre y dibujo deben ser fluidas, sin retrasos perceptibles.

Usabilidad: La interfaz debe ser intuitiva, con interacciones claras y diferenciadas para escritorio (clic izquierdo/derecho) y móvil (toque/arrastre).

Diseño Responsivo: Todos los elementos, en especial la barra de herramientas, deben adaptarse a pantallas pequeñas (móviles) sin desbordarse, usando flex-wrap o un diseño similar para reorganizar los botones si es necesario.

Consistencia Visual: El diseño general debe ser moderno, con botones tipo "pill" en los carruseles y una estética profesional.