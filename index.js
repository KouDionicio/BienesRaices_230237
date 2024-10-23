//? Ejemplo de activacion de Hot Reload
//console.log("Hola desde NodeJS,como estas");

//*const express = require('express');   //?importar la libreria para crear un servidor web - CommonJS / ECMA Script 6
//? Instanciar nuestra aplicacion web*//


import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

const port = 3000; //? configuramos nuestro servidor web,

app.listen(port, ()=>{
  console.log(`La aplicación ha iniciado en el puerto: ${port}`)
})


app.use('/',generalRoutes); //? Routing - Enrutamiento para peticiones
app.use('/usuario/',userRoutes);  //usar rutas diferentes, no nos marcara error pero solo nos leera la primera que encuentre
















//? Routing - Enrutamiento para peticiones

/*app.get("/", function(req, res){
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
})*/