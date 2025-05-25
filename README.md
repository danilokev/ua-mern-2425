# UA-2425
_Desarrollo de una Plataforma de Gestión de Assets para una Empresa de Videojuegos._

## Comenzando 🚀

### Pre-requisitos 📋

_Se debe tener instalado **Node JS** en el equipo de desarrollo. Las siguientes líneas muestran cómo hacerlo con líneas de comando para **Ubuntu**:_

```sh
sudo apt update
sudo apt install nodejs npm
sudo npm i -g n
sudo n stable
```

_La DB **MongoDB** se ejecuta en la nube._

### Instalación 🔧

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

## Construido con 🛠️

Nuestra aplicación ha sido desarrollada con la **pila MERN**, que consiste en:

* **MongoDB**: Como nuestra base de datos NoSQL:
    * [`mongodb`](https://www.mongodb.com/docs/drivers/node/current/) - El controlador oficial de MongoDB para Node.js, utilizado para interactuar con la base de datos desde el lado del servidor.
    * [`mongojs`](https://github.com/mongo-js/mongojs#readme) - Un módulo que proporciona una interfaz simplificada para el controlador de MongoDB, facilitando las operaciones con la base de datos.
* **Express.js**: El *framework* de aplicaciones web para Node.js, formando el *backend* de nuestra aplicación.
    * [`express`](https://expressjs.com/es/) - Infraestructura de aplicaciones web Node.js mínima y flexible que proporciona un conjunto sólido de características para el desarrollo de APIs.
    * [`cors`](https://github.com/expressjs/cors#readme) - Middleware para Express que habilita el *Cross-Origin Resource Sharing* (CORS), permitiendo solicitudes de diferentes orígenes.
    * [`helmet`](https://helmetjs.github.io/) - Un conjunto de middlewares para Express que ayudan a proteger la aplicación configurando varias cabeceras HTTP relacionadas con la seguridad.
    * [`morgan`](https://github.com/expressjs/morgan#readme) - Middleware de registro de solicitudes HTTP para Node.js, útil para el *debugging* y el seguimiento de la actividad del servidor.
    * [`nodemon`](https://www.npmjs.com/package/nodemon) - Una herramienta de desarrollo que monitorea los cambios en los archivos de la aplicación y reinicia automáticamente el servidor de Node.js.
* **React** (componente *frontend* de la pila MERN): La biblioteca JavaScript para construir interfaces de usuario, encargada del *frontend* interactivo de la aplicación.
* **Node.js**: El entorno de ejecución de JavaScript del lado del servidor que impulsa nuestra aplicación.

## Autores ✒️

* **Marcos López Mira** - [MarcosLopezMira](https://github.com/MarcosLopezMira)
* **Mario Giménez López-Torres** - [mgl126](https://github.com/mgl126)
* **Alfonso López Laforet** - [AlfonsoLafo](https://github.com/AlfonsoLafo)
* **Kevin D. Analuisa Ortiz** - [danilokev](https://github.com/danilokev)
