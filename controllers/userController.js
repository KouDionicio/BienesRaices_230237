import Usuario from '../models/Usuario.js';
import { check, validationResult } from 'express-validator';
import { generatedId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/email.js';
import csrf from 'csurf';

const formularioLogin = (req, res) => {
    res.render('auth/login', { autenticado: false });
};

const formularioRegister = (req, res) => {
    // renderiza el formulario de registro con el CSRF token
    res.render('auth/register', {
        page: 'Crea una nueva Cuenta...',
        csrfToken: req.csrfToken()
    });
};

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', { page: 'Recuperar Contraseña' });
};

const registrar = async (req, res) => {
    // Validar campos usando express-validator
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('El correo electrónico es un campo obligatorio').run(req);
    await check('password').notEmpty().withMessage('La contraseña es un campo obligatorio').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(req);
    await check('password2').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    
    let resultado = validationResult(req);
    
    if (!resultado.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear una nueva cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            },
            csrfToken: req.csrfToken()
        });
    }
    
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ where: { email } });

    if (existingUser) {
        return res.render('auth/register', {
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
        res.render('templates/message', {
            page: 'Cuenta creada satisfactoriamente',
            csrfToken: req.csrfToken(),
            msg: `${email}`
        });
        
    }
};

const confirm = async (req, res) => {
    const { token } = req.params;

    // Buscar al usuario con el token proporcionado
    const userWithToken = await Usuario.findOne({ where: { token } });

    if (!userWithToken) {
        return res.render('auth/createConfirm', {
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
    res.render('auth/createConfirm', {
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
            error: result.array(),
            csrfToken: request.csrfToken()
        })
    }

    //Desestructurar los parametros del request
    const {correro_usuario:email} = request.body

    //validacion de Backend
    //verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({where: {email, confirm:1}})

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
    existingUser.password = "";
    existingUser.token = generatedId();
    existingUser.save();


    //enviar el correo de confirmacion
    emailChangePassword({
        name: existingUser.name,
        email: existingUser.email,
        token: existingUser.token
    })

    response.render('templates/message',{
        page: 'Cuenta creada satisfactoriamente',
        
    })

}

const verifyToken = async (req, res) =>{
    const {token} = req.params;
    const userTokenOwner = await User.findOne({where: {token}})

    if(!userTokenOwner){
        return response.render('templates/message',{
            page: 'Lo siento este token este ya no esta disponible',
            csrfToken: request.csrfToken(),
            msg: 'El token ha expirado o no existe',
            
           
        })
    }
    
    res.render('auth/resetPassword',{

    })
}

const updatePassword = async (req, res) =>{
    return 0;
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

