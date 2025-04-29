"use strict";

import express from "express";


import fs from 'fs';

const port = 3000;

const app = express();

app.use(express.json())

app.use(express.static("./public"))

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
        this.id=id;
        this.nombre=nombre;
        this.correo=correo;
        this.items=items;
    }
}

let usuarios = [
    new usuario(1, "Leito", "hello@gmail.com", [1,2]),
    new usuario(2, "Leito2", "hello2@gmail.com", [1,2])
]

let items = [
    new item(1, "moneda", "dinero", "yenchino"),
    new item(2, "armadura", "proteccion", "mejorar")
]


app.get('/', (req, res) =>{
    fs.readFile('./public/html/helloleito.html', 'utf8',
        (err, html) => {
            if(err){
                res.status(500).send('There was an error: '
                + err)
                return
            }
            console.log("Sending page...")
            res.send(html);
            console.log("Page sent!")
        })
})

app.get('/api/hello', (request, response)=>{
    response.json({
        message: "Hello from server"
    })
})



app.listen(port, ()=>{
    console.log(`App listening on port: ${port}`)
})