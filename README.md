# UA Asset Manager

_Plataforma centralizada donde los usuarios pueden **explorar y descargar** recursos digitales para sus proyectos de videojuegos._

_La aplicación permite el registro y login seguro de usuarios mediante JWT. Cualquier visitante puede explorar los assets publicados, mientras que los usuarios registrados pueden subir sus propios recursos, comentarlos, darles "like" y descargarlos. Se admiten múltiples tipos de assets: gráficos (PNG, JPG, SVG...), multimedia (vídeos y animaciones), código fuente (C++, JavaScript...), modelos 3D (mallas, texturas, objetos), y audio (música y efectos de sonido)._

## Empezando

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### Pre-requisitos

_Se debe tener instalado **Node.js** en el equipo de desarrollo. Las siguientes líneas muestran cómo hacerlo con líneas de comando para **Ubuntu**:_

```sh
sudo apt update
sudo apt install nodejs npm
sudo npm i -g n
sudo n stable
```

_Utilizamos **MongoDB Atlas** como servicio de base de datos en la nube, eliminando la necesidad de configuración local de MongoDB._

### Instalacion

_Clonar el repositorio:_

```sh
git clone https://github.com/danilokev/ua-mern-2425.git
cd ua-mern-2425
```

_Instalar dependencias del backend:_

```sh
npm i
```

_Instalar dependencias del frontend:_

```sh
npm i
```

_Iniciar backend y frontend a la vez (backend en el puerto 5000, frontend en el 3000):_

```sh
npm run dev
```

_Solo backend / solo frontend:_

```sh
npm run server --prefix backend   # API con nodemon
npm start --prefix frontend       # servidor de desarrollo de React
```

## API Reference

|                             Verbo HTTP | Ruta                      | Descripcion                                  |
| -------------------------------------: | :------------------------ | :------------------------------------------- |
| <span style="color:yellow">POST</span> | /api/users                | Registra un nuevo usuario                    |
| <span style="color:yellow">POST</span> | /api/users/login          | Autentica un usuario y genera JWT            |
|   <span style="color:green">GET</span> | /api/users/me             | Obtiene datos del usuario logueado           |
|    <span style="color:blue">PUT</span> | /api/users/me             | Actualiza nombre/email del usuario           |
|    <span style="color:blue">PUT</span> | /api/users/password       | Actualiza contrasena del usuario             |
|    <span style="color:blue">PUT</span> | /api/users/avatar         | Actualiza el avatar del usuario              |
|  <span style="color:red">DELETE</span> | /api/users/me             | Elimina la cuenta del usuario                |
|   <span style="color:green">GET</span> | /api/assets/latest        | Obtiene ultimos 20 assets publicos           |
|   <span style="color:green">GET</span> | /api/assets/search?tag=   | Busca assets publicos por tipo (query `tag`) |
|   <span style="color:green">GET</span> | /api/assets               | Obtiene los assets del usuario logueado      |
| <span style="color:yellow">POST</span> | /api/assets               | Crea un nuevo asset con archivos/imagenes    |
|   <span style="color:green">GET</span> | /api/assets/{id}          | Obtiene un asset por ID                      |
|    <span style="color:blue">PUT</span> | /api/assets/{id}          | Actualiza un asset existente                 |
|   <span style="color:green">GET</span> | /api/assets/{id}/download | Descarga los archivos del asset (ZIP)        |
|   <span style="color:green">GET</span> | /api/assets/{id}/comments | Lista comentarios de un asset                |
| <span style="color:yellow">POST</span> | /api/assets/{id}/comments | Anade comentario a un asset                  |
| <span style="color:yellow">POST</span> | /api/assets/{id}/likes    | Alterna like/unlike en un asset              |

_Todas las rutas de `/api/assets` requieren cabecera `Authorization: Bearer <token>`, excepto `/latest` y `/search`. `/api/users/me`, `/password`, `/avatar` y el `DELETE /me` tambien requieren token._

## Construido con

- [MongoDB](https://www.mongodb.com/) - Base de datos NoSQL en la nube (Atlas)
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [Express](https://expressjs.com/) - Framework backend para Node.js
- [express-async-handler](https://www.npmjs.com/package/express-async-handler) - Manejo de errores en controladores asincronos
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Autenticacion basada en tokens (JWT)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Hashing de contrasenas
- [multer](https://github.com/expressjs/multer) - Subida de archivos (multipart)
- [Cloudinary](https://cloudinary.com/) - Almacenamiento de archivos e imagenes de assets
- [archiver](https://github.com/archiverjs/node-archiver) - Generacion de ZIP en la descarga de assets
- [React 19](https://react.dev/) - Frontend (Create React App)
- [Redux Toolkit](https://redux-toolkit.js.org/) - Estado de autenticacion
- [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - Visualizacion 3D
- [concurrently](https://www.npmjs.com/package/concurrently) / [nodemon](https://nodemon.io/) - Ejecucion y recarga en desarrollo

## Autores

- **Marcos López Mira** - [MarcosLopezMira](https://github.com/MarcosLopezMira)
- **Mario Giménez López-Torres** - [mgl126](https://github.com/mgl126)
- **Alfonso López Laforet** - [AlfonsoLafo](https://github.com/AlfonsoLafo)
- **Kevin D. Analuisa Ortiz** - [danilokev](https://github.com/danilokev)
