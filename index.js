//? Ejemplo de activacion de Hot Reload
//console.log("Hola desde NodeJS,como estas");

//*const express = require('express');   //?importar la libreria para crear un servidor web - CommonJS / ECMA Script 6
//? Instanciar nuestra aplicacion web*//


import express from 'express';
const app = express();

const port = 3000; //? configuramos nuestro servidor web,

app.listen(port, ()=>{
  console.log(`La aplicación ha iniciado en el puerto: ${port}`)
})

//? Routing - Enrutamiento para peticiones

app.get("/", function(req, res){
    res.send("Hola desde la Web, en NodeJS")
})
//? no debe existir dos acciones con el mismo metodo
app.get("/quienEres", function(req, res){
    res.json(
        {
     "nombre": "Citlalli",
     "carrera": "DSM",
     "grado": "4",
     "grupo": "A"
       }
    )     
})