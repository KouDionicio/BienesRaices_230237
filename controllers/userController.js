import Usuario from '../models/Usuario.js'
import { check, validationResult} from 'express-validator'

const formularioLogin = (req, res) =>{
    res.render('auth/login', {
        autenticado: false
    })
};

const formularioRegister = (req, res) =>{
    res.render('auth/register', {
       page: "Crea una nueva Cuenta..."
    })
};

const formularioPasswordRecovery = (req, res) =>{
    res.render('auth/passwordRecovery', {
       
    })
};

const registrar = async (req, res) =>{
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('El correo electronico es un campo obligatorio').isEmail().withMessage('El correo no tiene el formato correcto').run(req);
    await check('password').notEmpty().withMessage('La contraseña  es un campo obligatorio').isLength({min: 8}).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);
    await check('password2').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    
    let resultado = validationResult(req);

    //verifica que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/register',{
            page: 'Crear una nueva cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    } 
    
    const{ nombre: nombre, email: email, password: password} = req.body;


    //verifica que ell usuario no existe en la base de datos
    const existingUser= await Usuario.findOne({where: {email}});
    console.log(existingUser);

    if(existingUser){
        return res.render('auth/register', {
            page: 'Crear una nueva cuenta',
            errores: [{msg: `El usuario con el correo ${email} ya esta registrado`}],
            usuario: {
                nombre: nombre
            }
        })
    }else{
        console.log("Regsitrando a un nuevo usuario");

        const nuevoUsuario = await Usuario.create({
            nombre: nombre,
            email: email,
            password: password
        })
        res.json(nuevoUsuario);
    }
    return;
    
}

export{
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery,
    registrar
};