"use strict"

import express from 'express'
import fs from 'fs'

// Data
let items = [
    { id: 1, name: 'Healing Potion', type: 'Potion', effect: 'Restores 50 HP' },
    { id: 2, name: 'Mana Potion', type: 'Potion', effect: 'Restores 30 MP' },
    { id: 3, name: 'Iron Sword', type: 'Weapon', effect: 'Basic melee weapon' }
];

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', items: [1, 2] },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', items: [3] }
];

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.static('./public'))

// Routes definition and handling
app.get('/', (request,response) => {
    fs.readFile('./public/html/index.html', 'utf8', (err, html) => {
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading page...')
        response.send(html)
    })
})

app.get('/dom', (request, response) => {
    fs.readFile('./public/html/dom.html', 'utf8', (err, html) => {
        if(err) response.status(500).send('There was an error: ' + err)
        console.log('Loading DOM page...')
        response.send(html)
    })
})

// ITEM ENDPOINTS //

// GET endpoint to retrieve all items
app.get('/api/items', (req, res) => {
  try {
    res.json(items);
    console.log("Items Fetched");
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// GET endpoint to retrieve a specific item
app.get('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({ message: `Item with ID ${id} not found` });
    }
    
    res.json(item);
    console.log(`Item ${id} fetched`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// POST endpoint to create a new item
app.post('/api/items', (req, res) => {
  try {
    const newItem = req.body;
    
    // Generate new ID (max ID + 1)
    const maxId = items.reduce((max, item) => item.id > max ? item.id : max, 0);
    newItem.id = maxId + 1;
    
    items.push(newItem);
    res.status(201).json(newItem);
    console.log(`New item created with ID: ${newItem.id}`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// PUT endpoint to update an item
app.put('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: `Item with ID ${id} not found` });
    }
    
    // Update only the fields that are provided
    const updatedItem = { ...items[itemIndex], ...req.body };
    updatedItem.id = id; // Ensure ID doesn't change
    items[itemIndex] = updatedItem;
    
    res.json(updatedItem);
    console.log(`Item ${id} updated`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// DELETE endpoint to delete an item
app.delete('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: `Item with ID ${id} not found` });
    }
    
    const deletedItem = items[itemIndex];
    items.splice(itemIndex, 1);
    
    res.json({ message: `Item ${id} deleted`, item: deletedItem });
    console.log(`Item ${id} deleted`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// USER ENDPOINTS //

// GET endpoint to retrieve all users
app.get('/api/users', (req, res) => {
  try {
    // Fill in detailed item information for each user
    const usersWithItems = users.map(user => {
      const userCopy = { ...user };
      userCopy.items = userCopy.items.map(itemId => {
        return items.find(item => item.id === itemId) || itemId;
      });
      return userCopy;
    });
    
    res.json(usersWithItems);
    console.log("Users fetched");
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// GET endpoint to retrieve a specific user
app.get('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    
    // Fill in detailed item information
    const userWithItems = { ...user };
    userWithItems.items = userWithItems.items.map(itemId => {
      return items.find(item => item.id === itemId) || itemId;
    });
    
    res.json(userWithItems);
    console.log(`User ${id} fetched`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// POST endpoint to create a new user
app.post('/api/users', (req, res) => {
  try {
    const newUser = req.body;
    
    // Generate new ID (max ID + 1)
    const maxId = users.reduce((max, user) => user.id > max ? user.id : max, 0);
    newUser.id = maxId + 1;
    
    // Ensure items is an array
    if (!newUser.items) {
      newUser.items = [];
    }
    
    users.push(newUser);
    res.status(201).json(newUser);
    console.log(`New user created with ID: ${newUser.id}`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// PUT endpoint to update a user
app.put('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    
    // Update only the fields that are provided
    const updatedUser = { ...users[userIndex], ...req.body };
    updatedUser.id = id; // Ensure ID doesn't change
    users[userIndex] = updatedUser;
    
    res.json(updatedUser);
    console.log(`User ${id} updated`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// DELETE endpoint to delete a user
app.delete('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    res.json({ message: `User ${id} deleted`, user: deletedUser });
    console.log(`User ${id} deleted`);
  }
  catch(error) {
    res.status(500).json({message: "Error on the server"});
  }
});

// Run the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});