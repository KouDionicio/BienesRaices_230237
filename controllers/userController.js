import Usuario from '../models/Usuario.js'
import { check, validationResult} from 'express-validator'
import { generatedId } from '../db/helpers/tokens.js';
import { response } from 'express';
import { emailRegistro } from '../db/helpers/email.js';
//import { where } from 'sequelize';
//import csrf from 'csrf';


const formularioLogin = (req, res) =>{
    res.render('auth/login', {
        autenticado: false
    })
};

const formularioRegister = (req, res) =>{

    //console.log(req.csrfToken())

    res.render('auth/register', {
       page: 'Crea una nueva Cuenta...',
       csrfToken: req.csrfToken()
    })
};

const formularioPasswordRecovery = (req, res) =>{
    res.render('auth/passwordRecovery', {
       page: 'Recuperar Contraseña'
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
            },
            csrfToken: req.csrfToken()
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
        console.log("Registrando a un nuevo usuario");

        //? Almacenar un usuario
        const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generatedId()
        });

        //? Envia un email de confirmación
        emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
        }) 
    }
    
    //? Mostarr mensajes de confirmación
    res.render('templates/message',{
        page: 'Cuenta creada satisfactoriamente',
        msg: `${email}`
    })
        
}

const confirm = async(req, res)=>{

    const {token} = req.params
    const userWithToken = await Usuario.findOne({where: {token}})

    if(!userWithToken){
        
        res.render('auth/createConfirm',{
            page: 'El token no existe o ya fue utilizado',
            msg: 'Por favor verifica la liga',
            error: true
        })
        
    }else{
        userWithToken.token= null
        userWithToken.confirm=true
        await userWithToken.save();

        res.render('auth/createConfirm',{
            page: 'Excelente',
            msg: 'Tu cuenta ha sido confirmada de manera existosa',
            error: false
        })
    }
}


export{
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery,
    registrar,
    confirm
};