import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js'; // Conexión a la base de datos
import Usuario from './models/Usuario.js'; // Modelo de la tabla
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const app = express();

// Configurar el motor de plantillas - Pug
app.set('view engine', 'pug');
app.set('views', './views');

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

// Verificar conexión a la base de datos y sincronizar tablas
const port = 3000;

(async () => {
    try {
        // Verificar la conexión a la base de datos
        await db.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar el modelo con la base de datos
        await Usuario.sync(); // Usa { alter: true } si deseas modificar estructuras existentes sin borrar datos
        console.log('Tabla sincronizada (si no existía, fue creada).');

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`La aplicación ha iniciado en el puerto: ${port}`);
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos o sincronizar tabla:', error);
        process.exit(1); // Salir del proceso si ocurre un error crítico
    }
})();




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