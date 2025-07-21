# UA Asset Manager
Una plataforma centralizada donde desarrolladores pueden **explorar y descargar** recursos digitales de alta calidad para sus proyectos de videojuegos.

### 📦 Tipos de Assets Soportados
- **Gráficos**: Imágenes en múltiples formatos (PNG, JPG, SVG, etc.)
- **Multimedia**: Videos y animaciones
- **Código fuente**: Scripts en C++, JavaScript y otros lenguajes
- **Modelos 3D**: Meshes, texturas y objetos tridimensionales
- **Audio**: Música y efectos de sonido

### 👥 Funcionalidades
- **Exploración pública**: Cualquier usuario puede visualizar assets
- **Contribución comunitaria**: Usuarios registrados pueden subir sus propios recursos y descargar los de su interés
- **Sistema de autenticación**: Registro y login seguros

### 👤 Endpoints de Usuarios
Verbo HTTP | Ruta | Descripción
--------: | :------- | :--------
<span style="color:green">GET</span> | /api/users/me | Obtiene datos del usuario logueado
<span style="color:yellow">POST</span> | /api/users | Registra un nuevo usuario
<span style="color:yellow">POST</span> | /api/users/login | Autentica un usuario y genera JWT
<span style="color:blue">PUT</span> | /api/users/me | Actualiza nombre/email del usuario
<span style="color:blue">PUT</span> | /api/users/password |Actualiza contraseña del usuario
<span style="color:red">DELETE</span> | /api/users/me | Elimina la cuenta del usuario

### 📦 Endpoints de Assets
Verbo HTTP | Ruta | Descripción
--------: | :------- | :--------
<span style="color:green">GET</span> | /api/assets/me | Obtiene assets del usuario logueado
<span style="color:green">GET</span> | /api/assets/latest | Obtiene últimos 20 assets públicos
<span style="color:green">GET</span> | /api/assets | Busca assets por tag (query param tag)
<span style="color:green">GET</span> | /api/assets/\{id\} | Obtiene un asset por ID
<span style="color:green">GET</span> | /api/assets/\{id\}/comments | Lista comentarios de un asset
<span style="color:green">GET</span> | /api/assets/\{id\}/download | Descarga archivos del asset (ZIP)
<span style="color:yellow">POST</span> | /api/assets | Crea un nuevo asset con archivos/imágenes
<span style="color:yellow">POST</span> | /api/assets/\{id\}/comments | Añade comentario a un asset
<span style="color:blue">PUT</span> | /api/assets/\{id\}/like | Alterna like/unlike en un asset
<span style="color:blue">PUT</span> | /api/assets/\{id\} | Actualiza un asset existente

## 🚀 Comenzando 

### 📋 Pre-requisitos 

_Se debe tener instalado **Node JS** en el equipo de desarrollo. Las siguientes líneas muestran cómo hacerlo con líneas de comando para **Ubuntu**:_

```sh
sudo apt update
sudo apt install nodejs npm
sudo npm i -g n
sudo n stable
```

_Utilizamos **MongoDB Atlas** como servicio de base de datos en la nube, eliminando la necesidad de configuración local de MongoDB._

### 🔧 Instalación

_En primer lugar, clonamos el proyecto desde el repositorio._

```sh
git clone https://github.com/danilokev/ua-mern-2425.git
```

_Una vez clonado el respositorio, debemos instalar y actualizar todas las bibliotecas de código y dependencias del proyecto._

```sh
cd ua-mern-2425
npm i
cd frontend 
npm i
```

_Para poner el proyecto en marcha, ejecutaremos el siguiente comando:_

```sh
npm run dev
```

## 🛠️ Construido con

Nuestra aplicación ha sido desarrollada con la **pila MERN**, que consiste en:

* **MongoDB**: Como nuestra base de datos NoSQL:
    * [mongoose](https://github.com/Automattic/mongoose) - Biblioteca ODM (Object Data Modeling) para MongoDB, simplificando interacciones con la base de datos mediante esquemas y modelos.
* **Express.js**: El *framework* de aplicaciones web para Node.js, formando el *backend* de nuestra aplicación.
    * [express](https://expressjs.com/es/) - Infraestructura de aplicaciones web Node.js mínima y flexible que proporciona un conjunto sólido de características para el desarrollo de APIs.
    * [express-async-handler](https://www.npmjs.com/package/express-async-handler) - Manejo simplificado de errores en controladores asíncronos.
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Implementación de JWT para autenticación y autorización.
    * [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Hashing de contraseñas.
* **React** (componente *frontend* de la pila MERN): La biblioteca JavaScript para construir interfaces de usuario, encargada del *frontend* interactivo de la aplicación.
* **Node.js**: El entorno de ejecución de JavaScript del lado del servidor que impulsa nuestra aplicación.

## ✒️ Autores

* **Marcos López Mira** - [MarcosLopezMira](https://github.com/MarcosLopezMira)
* **Mario Giménez López-Torres** - [mgl126](https://github.com/mgl126)
* **Alfonso López Laforet** - [AlfonsoLafo](https://github.com/AlfonsoLafo)
* **Kevin D. Analuisa Ortiz** - [danilokev](https://github.com/danilokev)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/danilokev/ua-mern-2425/graphs/contributors) quiénes han participado en este proyecto.
