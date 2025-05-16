# API de Items y Usuarios

Una API para gestionar items y usuarios en un entorno similar a un juego. Permite crear, leer, actualizar y eliminar tanto items como usuarios, con una interfaz web estilizada con temática medieval.

## Características

- Gestión completa de items (CRUD)
- Gestión completa de usuarios (CRUD)
- Interfaz web para interactuar con la API
- Diseño de estilo medieval/RPG

## Instalación

1. Clonar el repositorio
   ```bash
   git clone [url-del-repositorio]
   cd ApiItems_Web

2. Instalar dependecias
```bash
npm install
```

3. Iniciar el servidor
```bash
npm start
```

4. Visitar la web
```bash
http://localhost:5000/dom
```

**Tecnologias Utilizadas**
- Node.js
- Express
- HTML/CSS/JavaScript
- Rest API

**API Endpoints**
Items
- GET /api/items - Obtener todos los items
- GET /api/items/:id - Obtener un item específico
- POST /api/items - Crear un nuevo item
- PUT /api/items/:id - Actualizar un item existente
- DELETE /api/items/:id - Eliminar un item
Usuarios
- GET /api/users - Obtener todos los usuarios
- GET /api/users/:id - Obtener un usuario específico
- POST /api/users - Crear un nuevo usuario
- PUT /api/users/:id - Actualizar un usuario existente
- DELETE /api/users/:id - Eliminar un usuari