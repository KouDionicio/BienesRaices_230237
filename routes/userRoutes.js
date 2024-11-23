import express from 'express';
import { formularioLogin, formularioRegister, formularioPasswordRecovery , registrar, confirm} from '../controllers/userController.js';
const router = express.Router();  


//? EndPoints: Rutas para acceder a las funciones o secciones de nuestra aplicación
//? " : " en una ruta definen de manera posicional los parametros de entrada
router.get("/findByID/:id", function(request, response){  //una peticion esta compuesto por 2 elementos 1:la ruta y 2:la función callback 
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`)  //request es una peticion y response es la respuesta
})
//? GET se utiliza para obtener datos de una manera predeterminada

//?POST se utiliza para el envio de datos e informacion del cliente al servidor
router.post("/newUser/:name/:email/:password",function(req, res){
    res.send(`Se esta solicitando crear un nuevo usuario con nombre: ${req.params.name}, asociado al email:
    ${req.params.email},con un password: ${req.params.password}`)
})

//? PUT se utiliza para actualizar totalmente los datos existentes del cliente al servidor 
router.put("/replaceUserByEmail/:name/:email/:password",function(req, res){
    res.send(`Se esta solicitando el remplazo de toda información del usuario: ${req.params.name}
    ,con correo: ${req.params.email}, y contraseña: ${req.params.password}`)
})


//? PATCH se utiliza para actualizar parcialmente los datos existentes en la base de datos 
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm",function(req, res){

    const {email, newPassword, newPasswordConfirm} = req.params; //? Desestructuración de un objeto
    
    if(newPassword === newPasswordConfirm){
        res.send(`Se esta solicitando la actualización de la contraseña del usuario con correo: ${email},
        se aceptan los cambios ya que la contraseña y confirmacion son iguales`)
    } else {
        res.send(`Se esta solicitando la actualización de la contraseña del usuario con correo: ${email},
        con la nueva contraseña: ${newPassword}, pero se rechaza el cambio debido ya que la nueva contraseña y su confirmación no coinciden`)
    }
   
})


//? DELETE se utiliza para eliminar datos existentes en la base de datos
router.delete("/deleteUser/:email",function(req, res){
    res.send(`Se esta solicitando el borrado de toda información del usuario asociado al correo: ${req.params.email}`)
})



/*router.get("/login", function(req, res){  //este es una petición callback
res.render('auth/login', {
    autenticado: false
  })
});*/


 router.get('/login', formularioLogin) //Middleware
 router.get('/createAccount', formularioRegister) //Middleware
 router.post('/createAccount', registrar);
 router.get('/passwordRecovery', formularioPasswordRecovery) //Middleware
 router.get('/createConfirm/:token', confirm);



export default router; //?Esta palabra reservada de JS me permirte exportar los elementos que estan dentro de este archivo