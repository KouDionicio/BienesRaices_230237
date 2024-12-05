import Usuario from '../models/Usuario.js';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generatedId } from '../helpers/tokens.js';
import { emailRegistro, emailChangePassword } from '../helpers/email.js';
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
    response.render('auth/passwordRecovery', { 
        page: 'Recuperar Contraseña',
        csrfToken: request.csrfToken() // Generar y pasar el token CSRF
    });
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
            csrfToken: request.csrfToken(),
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
            error: true,
            csrfToken: request.csrfToken()
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
        error: false,
        csrfToken: request.csrfToken()
    });
};

const passwordReset = async (request, response) => {
    console.log("Validando los datos para la recuperación de la contraseña");

    // Validación de los campos que se reciben del formulario
    await check('email').notEmpty().withMessage("El correo electrónico es un campo obligatorio.")
        .isEmail().withMessage("El correo electrónico no tiene el formato correcto.").run(request);

    let result = validationResult(request);

    // Verificamos si hay errores de validación
    if (!result.isEmpty()) {
        return response.render('auth/passwordRecovery', {
            page: 'Error al intentar resetear la contraseña',
            csrfToken: request.csrfToken(),
            error: result.array()
        });
    }

    // Desestructuramos los parámetros del request
    const { email } = request.body;

    // Validación de Backend: verificar que el usuario existe
    const existingUser = await Usuario.findOne({ where: { email } });

    if (!existingUser) {
        return response.render('auth/passwordRecovery', {
            page: 'Error, no existe una cuenta asociada al correo electrónico ingresado',
            csrfToken: request.csrfToken(),
            error: [{ msg: `Por favor revisa los datos e inténtalo de nuevo.` }],
            user: { email: email }
        });
    }

    console.log("El usuario sí existe en la BD");
    
    // Generar un nuevo token para la recuperación
    existingUser.password = "";
    existingUser.token = generatedId();
    await existingUser.save();

    // Enviar el correo con instrucciones para resetear la contraseña
    emailChangePassword({
        nombre: existingUser.nombre,
        email: existingUser.email,
        token: existingUser.token
    });

    response.render('templates/message', {
        csrfToken: request.csrfToken(),
        page: 'Recuperación de Contraseña',
        msg: 'Se ha enviado un correo con las instrucciones para recuperar tu contraseña.'
    });
};

const verifyToken = async (request, response) => {
    const { token } = request.params;
    const userTokenOwner = await Usuario.findOne({ where: { token } });

    if (!userTokenOwner) {
        return response.render('auth/createConfirm', {
            page: 'Lo siento, este token ya no está disponible',
            msg: 'El token ha expirado o no existe',
            error: true,
            csrfToken: request.csrfToken()
        });
    }

    response.render('auth/resetPassword', {
        csrfToken: request.csrfToken(),
        page: 'Restablece tu Contraseña',
        msg: 'Por favor ingresa tu nueva contraseña',
        csrfToken: request.csrfToken()
    });
};

const updatePassword = async (request, response) => {
    await check('new_password').notEmpty().withMessage('La contraseña es un campo obligatorio')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(request);
    
    await check('new_confirm_password').equals(request.body.new_password)
        .withMessage('Las contraseñas no coinciden').run(request);

    let resultado = validationResult(request);

    if (!resultado.isEmpty()) {
        return response.render('auth/resetPassword', {
            page: 'Error al restablecer la contraseña',
            csrfToken: request.csrfToken(),
            errores: resultado.array(),
        });
    }

    const { token } = request.params;
    const { new_password } = request.body;

    const usuario = await Usuario.findOne({ where: { token } });
    
    if (!usuario) {
        return response.render('auth/createConfirm', {
            page: 'Token no válido',
            msg: 'El token proporcionado no es válido',
            error: true,
            csrfToken: request.csrfToken()
        });
    }

    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(new_password, salt);
    usuario.token = null;

    await usuario.save();

    response.render('auth/createConfirm', {
        page: 'Contraseña Restablecida',
        msg: 'La contraseña se actualizó correctamente.',
        csrfToken: request.csrfToken()
    });
};

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