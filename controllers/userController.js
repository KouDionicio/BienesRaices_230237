import Usuario from '../models/Usuario.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generatedId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/email.js';
import csrf from 'csurf';
import { request, response } from 'express';


const formularioLogin = (request, response) => {
    response.render('auth/login', { autenticado: false });
};

const formularioRegister = (request, response) => {
    // renderiza el formulario de registro con el CSRF token
    response.render('auth/register', {
        page: 'Crea una nueva Cuenta...',
        csrfToken: request.csrfToken()
    });
};

const formularioPasswordRecovery = (request, response) => {
    response.render('auth/passwordRecovery', { page: 'Recuperar Contraseña' });
};

const registrar = async (request, response) => {
    // Validar campos usando express-validator
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(request);
    await check('email').isEmail().withMessage('El correo electrónico es un campo obligatorio').run(request);
    await check('password').notEmpty().withMessage('La contraseña es un campo obligatorio').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(request);
    await check('password2').equals(request.body.password).withMessage('Las contraseñas no coinciden').run(request);
    
    let resultado = validationResult(request);
    
    if (!resultado.isEmpty()) {
        return response.render('auth/register', {
            page: 'Crear una nueva cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: request.body.nombre,
                email: request.body.email
            },
            csrfToken: request.csrfToken()
        });
    }
    
    const { nombre, email, password } = request.body;

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { email } });

    if (existingUser) {
        return response.render('auth/register', {
            page: 'Crear una nueva cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: `El usuario con el correo ${email} ya está registrado` }],
            usuario: { nombre }
        });
    } else {
        // Crear un nuevo usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            token: generatedId()
        });

        // Enviar el correo de confirmación
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        });

        // Renderizar mensaje de éxito
        response.render('templates/message', {
            page: 'Cuenta creada satisfactoriamente',
            csrfToken: request.csrfToken(),
            msg: `${email}`
        });
        
    }
};

const confirm = async (request, response) => {
    const { token } = request.params;

    // Buscar al usuario con el token proporcionado
    const userWithToken = await Usuario.findOne({ where: { token } });

    if (!userWithToken) {
        return response.render('auth/createConfirm', {
            page: 'El token no existe o ya fue utilizado',
            msg: 'Por favor verifica la liga',
            error: true
        });
    }

    // Desactivar el token y marcar al usuario como confirmado
    userWithToken.token = null;
    userWithToken.confirm = true;
    await userWithToken.save();

    // Renderiza mensaje de confirmación
    response.render('auth/createConfirm', {
        page: 'Excelente',
        msg: 'Tu cuenta ha sido confirmada de manera exitosa',
        error: false
    });
};

const passwordReset = async(request, response)=>{
    console.log("Validando los datos para la recuperacion de la contraseña")

    //validacion de los campos que se reciben del formulario
    //validacion de frontend
    await check('email').notEmpty().withMessage("El correro electronico es un campo obligatorio.").isEmail().withMessage("El correro electronico no tiene el formato de: usuario@dominio.extension").run
    (request)
    let result = validationResult(request)

    //verificamos si hay errores de validacion
    if(!result.isEmpty()){
        return response.render('auth/passwordRecovery', {
            page: 'Error al intentar resetear la contraseña',
            csrfToken: request.csrfToken(),
            error: result.array()
        })
    }

    //Desestructurar los parametros del request
    const {email} = request.body

    //validacion de Backend
    //verificar que el usuario no existe previamente en la bd
    const existingUser = await Usuario.findOne({where: {email}})

    if(!existingUser){
        return response.render('auth/passwordRecovery',{
            page: 'Error no existe una cuenta autentificada asociada al correo electronico ingresado',
            csrfToken: request.csrfToken(),
            error: [{msg: `Por favor revisa los datos e intentalo de nuevo`}],
            user:{
                email: email
            }
           
        })
    }
    console.log("El usuario si existe en la BD");
    //registramos los datos en la bd
    existingUser.token = generatedId();
    await existingUser.save();


    //enviar el correo de confirmacion
    emailChangePassword({
        name: existingUser.name,
        email: existingUser.email,
        token: existingUser.token
    })

    response.render('templates/message',{
        page: 'Cuenta creada satisfactoriamente',
        msg: 'Se envio un email con instrucciones'
    })

}

const verifyToken = async (request, response) =>{
    const {token} = request.params;
    const userTokenOwner = await Usuario.findOne({where: {token}})

    if(!userTokenOwner){
        return response.render('auth/createConfirm',{
           page: 'Lo siento este token este ya no esta disponible',
           msg: 'El token ha expirado o no existe',
           error: true
        })
    }
    
    response.render('auth/resetPassword',{
        csrfToken: request.csrfToken(),
        page: 'Restablece tu contraseña',
        msg: 'Por favor ingrese tu nueva contraseña',
        csrfToken: request.csrfToken(),

    })
}

const updatePassword = async(request, response) =>{
   
    await check('new_password').notEmpty().withMessage('La contraseña es un campo obligatorio').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(request);
    await check('new_confirm_password').equals(request.body.new_password).withMessage('Las contraseñas no coinciden').run(request);

    let resultado = validationResult(request);
    
    if (!resultado.isEmpty()) {
        return response.render('auth/resetPassword', {
            page: 'Error al iniciar',
            csrfToken: request.csrfToken(),
            errores: resultado.array(),
            token: token
        });
    }
    const {token} = request.params
    const {password} = request.body

    const usuario = await Usuario.findOne({where: {token}})
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null;

    await usuario.save();

    response.render('auth/createConfirm',{
        page: 'La contraseña se reestablecio correctamente',
        msg: 'La contraseña se actualizo correctamente'
    })
}

export {
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery,
    registrar,
    confirm,
    passwordReset,
    verifyToken,
    updatePassword
};

