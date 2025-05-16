'use strict';

// Función para mostrar resultados
function mostrarResultado(data, error = false) {
    const resultadoContainer = document.getElementById('resultado');
    
    if (error) {
        resultadoContainer.innerHTML = `<div class="error">${JSON.stringify(data, null, 2)}</div>`;
    } else {
        resultadoContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }
    
    // También mostrar en consola para las pruebas
    if (error) {
        console.error(data);
    } else {
        console.log(data);
    }
}

// ===== FUNCIONES PARA ITEMS =====

// Obtener todos los items
document.getElementById('get-items').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/items');
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Obtener item por ID
document.getElementById('get-item-by-id').addEventListener('click', async () => {
    const id = document.getElementById('get-item-id').value;
    
    if (!id) {
        mostrarResultado({ error: 'Debe proporcionar un ID de item' }, true);
        return;
    }
    
    try {
        const response = await fetch(`/api/items/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Crear nuevo item
document.getElementById('create-item').addEventListener('click', async () => {
    const nombre = document.getElementById('item-nombre').value;
    const tipo = document.getElementById('item-tipo').value;
    const efecto = document.getElementById('item-efecto').value;
    
    if (!nombre || !tipo || !efecto) {
        mostrarResultado({ error: 'Todos los campos son requeridos' }, true);
        return;
    }
    
    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, tipo, efecto })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Actualizar item existente
document.getElementById('update-item').addEventListener('click', async () => {
    const id = document.getElementById('update-item-id').value;
    const nombre = document.getElementById('update-item-nombre').value;
    const tipo = document.getElementById('update-item-tipo').value;
    const efecto = document.getElementById('update-item-efecto').value;
    
    if (!id) {
        mostrarResultado({ error: 'El ID del item es requerido' }, true);
        return;
    }
    
    const itemData = {};
    if (nombre) itemData.nombre = nombre;
    if (tipo) itemData.tipo = tipo;
    if (efecto) itemData.efecto = efecto;
    
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Eliminar item
document.getElementById('delete-item').addEventListener('click', async () => {
    const id = document.getElementById('delete-item-id').value;
    
    if (!id) {
        mostrarResultado({ error: 'El ID del item es requerido' }, true);
        return;
    }
    
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// ===== FUNCIONES PARA USUARIOS =====

// Obtener todos los usuarios
document.getElementById('get-usuarios').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/usuarios');
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Obtener usuario por ID
document.getElementById('get-usuario-by-id').addEventListener('click', async () => {
    const id = document.getElementById('get-usuario-id').value;
    
    if (!id) {
        mostrarResultado({ error: 'Debe proporcionar un ID de usuario' }, true);
        return;
    }
    
    try {
        const response = await fetch(`/api/usuarios/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Crear nuevo usuario
document.getElementById('create-usuario').addEventListener('click', async () => {
    const nombre = document.getElementById('usuario-nombre').value;
    const correo = document.getElementById('usuario-correo').value;
    const itemsInput = document.getElementById('usuario-items').value;
    
    if (!nombre || !correo) {
        mostrarResultado({ error: 'El nombre y correo son requeridos' }, true);
        return;
    }
    
    // Procesar los IDs de items si se proporcionaron
    let items = [];
    if (itemsInput) {
        items = itemsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    
    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, correo, items })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Actualizar usuario existente
document.getElementById('update-usuario').addEventListener('click', async () => {
    const id = document.getElementById('update-usuario-id').value;
    const nombre = document.getElementById('update-usuario-nombre').value;
    const correo = document.getElementById('update-usuario-correo').value;
    const itemsInput = document.getElementById('update-usuario-items').value;
    
    if (!id) {
        mostrarResultado({ error: 'El ID del usuario es requerido' }, true);
        return;
    }
    
    const userData = {};
    if (nombre) userData.nombre = nombre;
    if (correo) userData.correo = correo;
    
    // Procesar los IDs de items si se proporcionaron
    if (itemsInput) {
        userData.items = itemsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }
    
    try {
        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Eliminar usuario
document.getElementById('delete-usuario').addEventListener('click', async () => {
    const id = document.getElementById('delete-usuario-id').value;
    
    if (!id) {
        mostrarResultado({ error: 'El ID del usuario es requerido' }, true);
        return;
    }
    
    try {
        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarResultado(data, true);
            return;
        }
        
        mostrarResultado(data);
    } catch (error) {
        mostrarResultado({ error: error.message }, true);
    }
});

// Inicializar con carga de datos
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar items inicialmente para mostrar que la aplicación funciona
        const response = await fetch('/api/items');
        if (response.ok) {
            const data = await response.json();
            mostrarResultado({ message: "Aplicación inicializada", items: data });
        }
    } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
    }
});
