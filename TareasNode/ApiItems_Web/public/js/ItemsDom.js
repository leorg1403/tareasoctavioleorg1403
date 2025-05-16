'use strict';

// DOM Elements for Items
const createItemForm = document.getElementById('create-item-form');
const getItemsForm = document.getElementById('get-items-form');
const updateItemForm = document.getElementById('update-item-form');
const deleteItemForm = document.getElementById('delete-item-form');
const itemsResultContainer = document.getElementById('items-result');

// DOM Elements for Users
const createUserForm = document.getElementById('create-user-form');
const getUsersForm = document.getElementById('get-users-form');
const updateUserForm = document.getElementById('update-user-form');
const deleteUserForm = document.getElementById('delete-user-form');
const usersResultContainer = document.getElementById('users-result');

// Helper Functions
function showMessage(container, message, isError = false) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = isError ? 'error' : 'success';
    container.innerHTML = '';
    container.appendChild(messageElement);
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function renderItems(items, container) {
    container.innerHTML = '';
    
    if (!items || items.length === 0) {
        showMessage(container, 'No items found');
        return;
    }
    
    if (!Array.isArray(items)) {
        items = [items]; // Convert single item to array for consistent handling
    }
    
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <h4>ID: ${item.id} - ${item.name}</h4>
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Effect:</strong> ${item.effect}</p>
        `;
        container.appendChild(itemElement);
    });
}

function renderUsers(users, container) {
    container.innerHTML = '';
    
    if (!users || users.length === 0) {
        showMessage(container, 'No users found');
        return;
    }
    
    if (!Array.isArray(users)) {
        users = [users]; // Convert single user to array for consistent handling
    }
    
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-card';
        
        let itemsHtml = '<p><strong>Items:</strong></p>';
        if (user.items && user.items.length > 0) {
            itemsHtml += '<ul>';
            user.items.forEach(item => {
                if (typeof item === 'object') {
                    itemsHtml += `<li>ID: ${item.id} - ${item.name} (${item.type})</li>`;
                } else {
                    itemsHtml += `<li>Item ID: ${item}</li>`;
                }
            });
            itemsHtml += '</ul>';
        } else {
            itemsHtml += '<p>No items assigned</p>';
        }
        
        userElement.innerHTML = `
            <h4>ID: ${user.id} - ${user.name}</h4>
            <p><strong>Email:</strong> ${user.email}</p>
            ${itemsHtml}
        `;
        container.appendChild(userElement);
    });
}

// API Functions for Items
async function createItem(itemData) {
    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
}

async function getItems(id = null) {
    try {
        const url = id ? `/api/items/${id}` : '/api/items';
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
}

async function updateItem(id, updateData) {
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`/api/items/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
}

// API Functions for Users
async function createUser(userData) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function getUsers(id = null) {
    try {
        const url = id ? `/api/users/${id}` : '/api/users';
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Event Listeners for Items
createItemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const itemData = {
        name: document.getElementById('item-name').value,
        type: document.getElementById('item-type').value,
        effect: document.getElementById('item-effect').value
    };
    
    try {
        const result = await createItem(itemData);
        showMessage(itemsResultContainer, 'Item created successfully!');
        createItemForm.reset();
    } catch (error) {
        showMessage(itemsResultContainer, `Error: ${error.message}`, true);
    }
});

getItemsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const itemId = document.getElementById('item-id-get').value;
    
    try {
        const items = await getItems(itemId || null);
        renderItems(items, itemsResultContainer);
    } catch (error) {
        showMessage(itemsResultContainer, `Error: ${error.message}`, true);
    }
});

updateItemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const itemId = document.getElementById('item-id-update').value;
    const updateData = {};
    
    const name = document.getElementById('item-name-update').value;
    const type = document.getElementById('item-type-update').value;
    const effect = document.getElementById('item-effect-update').value;
    
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (effect) updateData.effect = effect;
    
    try {
        if (Object.keys(updateData).length === 0) {
            showMessage(itemsResultContainer, 'Please provide at least one field to update', true);
            return;
        }
        
        const result = await updateItem(itemId, updateData);
        showMessage(itemsResultContainer, 'Item updated successfully!');
        updateItemForm.reset();
    } catch (error) {
        showMessage(itemsResultContainer, `Error: ${error.message}`, true);
    }
});

deleteItemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const itemId = document.getElementById('item-id-delete').value;
    
    try {
        const result = await deleteItem(itemId);
        showMessage(itemsResultContainer, 'Item deleted successfully!');
        deleteItemForm.reset();
    } catch (error) {
        showMessage(itemsResultContainer, `Error: ${error.message}`, true);
    }
});

// Event Listeners for Users
createUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const itemsInput = document.getElementById('user-items').value;
    const items = itemsInput ? itemsInput.split(',').map(id => parseInt(id.trim())) : [];
    
    const userData = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        items: items
    };
    
    try {
        const result = await createUser(userData);
        showMessage(usersResultContainer, 'User created successfully!');
        createUserForm.reset();
    } catch (error) {
        showMessage(usersResultContainer, `Error: ${error.message}`, true);
    }
});

getUsersForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const userId = document.getElementById('user-id-get').value;
    
    try {
        const users = await getUsers(userId || null);
        renderUsers(users, usersResultContainer);
    } catch (error) {
        showMessage(usersResultContainer, `Error: ${error.message}`, true);
    }
});

updateUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const userId = document.getElementById('user-id-update').value;
    const updateData = {};
    
    const name = document.getElementById('user-name-update').value;
    const email = document.getElementById('user-email-update').value;
    const itemsInput = document.getElementById('user-items-update').value;
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (itemsInput) {
        updateData.items = itemsInput.split(',').map(id => parseInt(id.trim()));
    }
    
    try {
        if (Object.keys(updateData).length === 0) {
            showMessage(usersResultContainer, 'Please provide at least one field to update', true);
            return;
        }
        
        const result = await updateUser(userId, updateData);
        showMessage(usersResultContainer, 'User updated successfully!');
        updateUserForm.reset();
    } catch (error) {
        showMessage(usersResultContainer, `Error: ${error.message}`, true);
    }
});

deleteUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const userId = document.getElementById('user-id-delete').value;
    
    try {
        const result = await deleteUser(userId);
        showMessage(usersResultContainer, 'User deleted successfully!');
        deleteUserForm.reset();
    } catch (error) {
        showMessage(usersResultContainer, `Error: ${error.message}`, true);
    }
});

// Initial data load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load items
        const items = await getItems();
        renderItems(items, itemsResultContainer);
        
        // Load users
        const users = await getUsers();
        renderUsers(users, usersResultContainer);
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
});