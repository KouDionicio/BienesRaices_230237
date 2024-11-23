import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js' // Conexión a la base de datos
import csrf from 'csurf';
import cookieParser  from 'cookie-parser';

const app = express();

// Configurar el motor de plantillas - Pug
app.set('view engine', 'pug');
app.set('views','./views');

// Habilitar la lectura de datos del cuerpo
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie parser
app.use(cookieParser());

// Habilitar CSRF con cookies
app.use(csrf({ cookie: true }));

// Carpeta pública
app.use(express.static('public'));

// Rutas
app.use('/', generalRoutes);
app.use('/auth/', userRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});



//Routing
//app.use('/auth', userRoute














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