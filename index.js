//? Ejemplo de activacion de Hot Reload
//console.log("Hola desde NodeJS,como estas");

//*const express = require('express');   //?importar la libreria para crear un servidor web - CommonJS / ECMA Script 6
//? Instanciar nuestra aplicacion web*//


import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js' //Conexion a la base de datos
import csrf from 'csurf'
import cookieParser  from 'cookie-parser'

const app = express();

//? Habilitar cookie parser
app.use( cookieParser())

//? Habilitar CSRF
app.use( csrf({cookie: true}))
app.use(express.urlencoded({extended:true})); //habilita la lectura de datos en los formularios


try{
  await db.authenticate();
  db.sync(); //Crea tablas
  console.log("Conexion exitosa")
 }catch(error){
 
 }


//? Cofigurar Template Engine - PUG
app.set('view engine', 'pug');
app.set('views','./views');

//? Carpeta publica
app.use(express.static('public'));

const port = 3000; //? configuramos nuestro servidor web,

app.listen(port, ()=>{
  console.log(`La aplicación ha iniciado en el puerto: ${port}`)
})

//? Enrutamiento para peticiones
app.use('/',generalRoutes); //? Routing - Enrutamiento para peticiones
app.use('/auth/',userRoutes);  //?usar rutas diferentes, no nos marcara error pero solo nos leera la primera que encuentre


//Routing
//app.use('/auth', userRoutes);















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