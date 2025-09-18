ASUNTO: Creación de un script de Node.js para la sincronización de una base de datos MongoDB con la API externa API-FOOTBALL.
1. Objetivo y Filosofía del Proyecto
El objetivo principal es construir un script de Node.js que sirva como una capa de abstracción robusta entre nuestra aplicación "Pizarra Táctica" y una fuente de datos de fútbol externa. La filosofía central es la desacoplamiento: nuestra aplicación NUNCA se comunicará directamente con la API externa; en su lugar, consultará nuestra propia base de datos MongoDB, la cual este script se encargará de mantener poblada y actualizada.
Este enfoque es fundamental para lograr los siguientes objetivos críticos:
Rendimiento: Las consultas a nuestra propia base de datos son órdenes de magnitud más rápidas que las peticiones HTTP a una API externa.
Fiabilidad: Nuestra aplicación seguirá funcionando incluso si la API externa está temporalmente caída o lenta.
Gestión de Costos: Evitamos agotar el límite de peticiones del plan gratuito de la API, ya que la sincronización se ejecutará de forma controlada y periódica, no por cada usuario.
Integridad de Datos: Nos permite mantener un control total sobre nuestro modelo de datos y, lo más importante, preservar la información guardada por nuestros usuarios.
2. Fuente de Datos Externa
API a Utilizar: API-FOOTBALL
URL de la Documentación Oficial: https://www.api-football.com/documentation-v3
Método de Autenticación: El script debe incluir una clave de API en las cabeceras (headers) de cada petición. El header requerido es x-rapidapi-key.
3. Requisitos Tecnológicos
Entorno: Node.js (última versión LTS).
Base de Datos: MongoDB.
Librería ODM: Mongoose para la modelización de datos y la interacción con MongoDB.
Peticiones HTTP: Utilizar el fetch nativo de Node.js o una librería como node-fetch.
Seguridad de Secretos: Utilizar la librería dotenv para gestionar las variables de entorno.
4. Gestión de Claves y Seguridad
La clave de API-FOOTBALL y la cadena de conexión a MongoDB son datos sensibles. El script debe cargarlos desde un archivo .env que estará excluido del control de versiones a través de un archivo .gitignore. Bajo ninguna circunstancia estas claves deben estar escritas directamente en el código fuente.
5. Arquitectura de la Base de Datos
Debes diseñar tres esquemas de Mongoose interrelacionados. Un principio de diseño no negociable es que cada documento debe almacenar el ID único que le corresponde en la API externa. Este api_id será la clave para toda la lógica de sincronización.
Modelo League: Debe contener el api_id de la liga, su nombre y la URL de su logo.
Modelo Team: Debe contener el api_id del equipo, su nombre, la URL de su logo y una referencia de Mongoose (ObjectId) al documento League al que pertenece.
Modelo Player: Debe contener el api_id del jugador, su nombre, su posición (tanto la específica de la API como una categoría general: 'GK', 'DF', 'MF', 'FW'), la URL de su foto y una referencia de Mongoose (ObjectId) al documento Team en el que juega. Además, debe incluir un campo booleano crucial: isActive.
6. Lógica de Sincronización: Metodología y Flujo
El script debe seguir un flujo jerárquico y una metodología de "Upsert" para garantizar que los datos existentes se actualicen y los nuevos se inserten sin duplicados ni borrados destructivos.
Metodología "Upsert": Para cada entidad (liga, equipo, jugador), el script debe buscar en la base de datos un documento con el api_id correspondiente. Si lo encuentra, actualiza sus campos. Si no lo encuentra, crea un nuevo documento. Esto debe implementarse usando la funcionalidad findOneAndUpdate de Mongoose con la opción { upsert: true }.
Flujo Jerárquico: El orden de las operaciones es importante.
Primero, sincronizar las Ligas: Obtener un conjunto predefinido de ligas importantes desde el endpoint GET /leagues y realizar un "upsert" en nuestra colección Leagues.
Segundo, sincronizar los Equipos: Para cada liga en nuestra base de datos, consultar el endpoint GET /teams (filtrando por el league ID y la temporada actual) y realizar un "upsert" de los equipos en nuestra colección Teams.
Tercero, sincronizar los Jugadores: Para cada equipo en nuestra base de datos, consultar el endpoint GET /players/squads (filtrando por el team ID) y sincronizar la plantilla.
7. Regla de Negocio Crítica: Preservación de Datos de Usuario
Nuestros usuarios guardarán formaciones que contienen referencias a los _id de los jugadores en nuestra base de datos. Si un jugador es borrado, esas formaciones se corrompen.
Por lo tanto, la siguiente regla es de implementación obligatoria:
Cuando un jugador ya no forma parte de la plantilla de un equipo según la API, EL DOCUMENTO DEL JUGADOR NO DEBE SER BORRADO. En su lugar, el script debe actualizar el documento de ese jugador de la siguiente manera:
Establecer su campo isActive a false.
Establecer su referencia de team a null.
Esto asegura la integridad referencial para los datos antiguos de los usuarios, mientras que la interfaz de la aplicación solo mostrará jugadores donde isActive sea true y tengan un equipo asignado.
8. Automatización y Cadencia de Actualización
El script debe ser diseñado para ser ejecutado de forma automática por un planificador de tareas (Cron Job), no manualmente. La frecuencia de ejecución debe ser estratégica para optimizar el uso de la API:
Se recomienda una ejecución diaria durante los mercados de fichajes (julio, agosto, enero).
Se recomienda una ejecución semanal durante el resto de la temporada.
El código debe ser autónomo y no requerir intervención humana. Debes incluir comentarios en el código final que sugieran métodos de automatización como GitHub Actions, Vercel Cron Jobs o el crontab de Linux.