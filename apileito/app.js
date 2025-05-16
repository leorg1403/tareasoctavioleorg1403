"use strict";

import express from "express";
import fs from 'fs';

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static("./public"));

// Definición de clases
class item {
    constructor (id, nombre, tipo, efecto){
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.efecto = efecto;
    }
}

class usuario {
    constructor (id, nombre, correo, items){
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.items = items;
    }
}

// Datos iniciales
let items = [
    new item(1, "Poción Curativa", "Poción", "Restaura 50 PV"),
    new item(2, "Poción de Maná", "Poción", "Restaura 30 PM"),
    new item(3, "Espada de Hierro", "Arma", "Arma cuerpo a cuerpo básica")
];

let usuarios = [
    new usuario(1, "Juan Pérez", "juan@ejemplo.com", [1, 2]),
    new usuario(2, "María García", "maria@ejemplo.com", [3])
];

// RUTAS PRINCIPALES

// Carga la página web principal
app.get('/', (req, res) => {
    fs.readFile('./public/html/helloleito.html', 'utf8', (err, html) => {
        if(err) {
            res.status(500).send('Hubo un error: ' + err);
            return;
        }
        console.log("Enviando página...");
        res.send(html);
        console.log("¡Página enviada!");
    });
});

// ENDPOINTS PARA ITEMS

// GET: Obtener todos los items
app.get('/api/items', (req, res) => {
    try {
        if (items.length === 0) {
            return res.status(404).json({ message: "No hay items registrados" });
        }
        res.json(items);
        console.log("Items obtenidos");
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// GET: Obtener un item específico por ID
app.get('/api/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemEncontrado = items.find(i => i.id === id);
        
        if (!itemEncontrado) {
            return res.status(404).json({ message: `No se encontró el item con ID ${id}` });
        }
        
        res.json(itemEncontrado);
        console.log(`Item ${id} obtenido`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// POST: Crear un nuevo item
app.post('/api/items', (req, res) => {
    try {
        const nuevoItem = req.body;
        
        // Verificar que tenga todos los campos requeridos
        if (!nuevoItem.nombre || !nuevoItem.tipo || !nuevoItem.efecto) {
            return res.status(400).json({ message: "Faltan datos del item" });
        }
        
        // Verificar que no exista un item con el mismo nombre y tipo
        const itemExistente = items.find(i => 
            i.nombre.toLowerCase() === nuevoItem.nombre.toLowerCase() && 
            i.tipo.toLowerCase() === nuevoItem.tipo.toLowerCase()
        );
        
        if (itemExistente) {
            return res.status(409).json({ message: "Ya existe un item con ese nombre y tipo" });
        }
        
        // Generar nuevo ID (máximo + 1)
        const maxId = items.reduce((max, i) => i.id > max ? i.id : max, 0);
        const id = maxId + 1;
        
        // Crear nueva instancia de la clase item
        const itemCreado = new item(
            id, 
            nuevoItem.nombre, 
            nuevoItem.tipo, 
            nuevoItem.efecto
        );
        
        items.push(itemCreado);
        res.status(201).json({ 
            message: "Item creado correctamente", 
            item: itemCreado 
        });
        console.log(`Nuevo item creado con ID: ${id}`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// PUT: Actualizar un item existente
app.put('/api/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const actualizacion = req.body;
        const itemIndex = items.findIndex(i => i.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: `No se encontró el item con ID ${id}` });
        }
        
        // Actualizar solo los campos proporcionados
        const itemActualizado = items[itemIndex];
        
        if (actualizacion.nombre) itemActualizado.nombre = actualizacion.nombre;
        if (actualizacion.tipo) itemActualizado.tipo = actualizacion.tipo;
        if (actualizacion.efecto) itemActualizado.efecto = actualizacion.efecto;
        
        res.json({ 
            message: `Item ${id} actualizado correctamente`, 
            item: itemActualizado 
        });
        console.log(`Item ${id} actualizado`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// DELETE: Eliminar un item
app.delete('/api/items/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = items.findIndex(i => i.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: `No se encontró el item con ID ${id}` });
        }
        
        const itemEliminado = items[itemIndex];
        items.splice(itemIndex, 1);
        
        res.json({ 
            message: `Item ${id} eliminado correctamente`, 
            item: itemEliminado 
        });
        console.log(`Item ${id} eliminado`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// ENDPOINTS PARA USUARIOS

// GET: Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    try {
        if (usuarios.length === 0) {
            return res.status(404).json({ message: "No hay usuarios registrados" });
        }
        
        // Añadir información completa de los items a cada usuario
        const usuariosConItems = usuarios.map(usuario => {
            const usuarioCopia = {...usuario};
            usuarioCopia.items = usuarioCopia.items.map(itemId => {
                return items.find(item => item.id === itemId) || itemId;
            });
            return usuarioCopia;
        });
        
        res.json(usuariosConItems);
        console.log("Usuarios obtenidos");
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// GET: Obtener un usuario específico por ID
app.get('/api/usuarios/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const usuarioEncontrado = usuarios.find(u => u.id === id);
        
        if (!usuarioEncontrado) {
            return res.status(404).json({ message: `No se encontró el usuario con ID ${id}` });
        }
        
        // Añadir información completa de los items
        const usuarioConItems = {...usuarioEncontrado};
        usuarioConItems.items = usuarioConItems.items.map(itemId => {
            return items.find(item => item.id === itemId) || itemId;
        });
        
        res.json(usuarioConItems);
        console.log(`Usuario ${id} obtenido`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// POST: Crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
    try {
        const nuevoUsuario = req.body;
        
        // Verificar que tenga todos los campos requeridos
        if (!nuevoUsuario.nombre || !nuevoUsuario.correo) {
            return res.status(400).json({ message: "Faltan datos del usuario" });
        }
        
        // Verificar que no exista un usuario con el mismo correo
        const usuarioExistente = usuarios.find(u => 
            u.correo.toLowerCase() === nuevoUsuario.correo.toLowerCase()
        );
        
        if (usuarioExistente) {
            return res.status(409).json({ message: "Ya existe un usuario con ese correo" });
        }
        
        // Verificar que los items existan en el catálogo
        if (nuevoUsuario.items && nuevoUsuario.items.length > 0) {
            for (const itemId of nuevoUsuario.items) {
                const itemExiste = items.some(item => item.id === itemId);
                if (!itemExiste) {
                    return res.status(400).json({ message: `El item con ID ${itemId} no existe en el catálogo` });
                }
            }
        }
        
        // Generar nuevo ID (máximo + 1)
        const maxId = usuarios.reduce((max, u) => u.id > max ? u.id : max, 0);
        const id = maxId + 1;
        
        // Asegurarse de que items sea un array
        const itemsUsuario = Array.isArray(nuevoUsuario.items) ? nuevoUsuario.items : [];
        
        // Crear nueva instancia de la clase usuario
        const usuarioCreado = new usuario(
            id, 
            nuevoUsuario.nombre, 
            nuevoUsuario.correo, 
            itemsUsuario
        );
        
        usuarios.push(usuarioCreado);
        res.status(201).json({ 
            message: "Usuario creado correctamente", 
            usuario: usuarioCreado 
        });
        console.log(`Nuevo usuario creado con ID: ${id}`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// PUT: Actualizar un usuario existente
app.put('/api/usuarios/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const actualizacion = req.body;
        const usuarioIndex = usuarios.findIndex(u => u.id === id);
        
        if (usuarioIndex === -1) {
            return res.status(404).json({ message: `No se encontró el usuario con ID ${id}` });
        }
        
        // Actualizar solo los campos proporcionados
        const usuarioActualizado = usuarios[usuarioIndex];
        
        if (actualizacion.nombre) usuarioActualizado.nombre = actualizacion.nombre;
        if (actualizacion.correo) usuarioActualizado.correo = actualizacion.correo;
        
        // Verificar que los items existan en el catálogo
        if (actualizacion.items && actualizacion.items.length > 0) {
            for (const itemId of actualizacion.items) {
                const itemExiste = items.some(item => item.id === itemId);
                if (!itemExiste) {
                    return res.status(400).json({ message: `El item con ID ${itemId} no existe en el catálogo` });
                }
            }
            usuarioActualizado.items = actualizacion.items;
        }
        
        res.json({ 
            message: `Usuario ${id} actualizado correctamente`, 
            usuario: usuarioActualizado 
        });
        console.log(`Usuario ${id} actualizado`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// DELETE: Eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const usuarioIndex = usuarios.findIndex(u => u.id === id);
        
        if (usuarioIndex === -1) {
            return res.status(404).json({ message: `No se encontró el usuario con ID ${id}` });
        }
        
        const usuarioEliminado = usuarios[usuarioIndex];
        usuarios.splice(usuarioIndex, 1);
        
        res.json({ 
            message: `Usuario ${id} eliminado correctamente`, 
            usuario: usuarioEliminado 
        });
        console.log(`Usuario ${id} eliminado`);
    }
    catch(error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Endpoint original de ejemplo
app.get('/api/hello', (request, response) => {
    response.json({
        message: "Hello from server"
    });
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
