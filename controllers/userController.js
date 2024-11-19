import Usuario from '../models/Usuario.js'
import { check, validationResult} from 'express-validator'
import { generatedId } from '../db/helpers/tokens.js';
import { response } from 'express';
import { emailRegistro } from '../db/helpers/email.js';
import { where } from 'sequelize';
import csrf from 'csrf';


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
    
    //? Problemas aqui
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generatedId()
    })

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    }) //? hasta aca
 
    
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
            password: password,
            token: generatedId()
        })
        //res.json(nuevoUsuario);

        response.render('templates/message',{
            page: 'Cuenta creada satisfactoriamente',
            msg: 'Se ha enviado un correro a : <poner el correo aqui>, para la confirmación de cuenta'
        })
    }
    return;
    
}

const confirm = async(req, res)=>{

    const {token} = req.params
    const user = await UserActivation.findOne({where: {token}})

    if(userWithToken){
        
        res.render('templates/message',{
            page: 'El token no existe',
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