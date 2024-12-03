import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const emailRegistro = async (datos) => {

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos;

  await transport.sendMail({
    from: 'BienesRaices.com <no-reply@bienesraices.com>',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #333333; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
          <tr>
            <td style="background-color: #0056b3; padding: 20px; text-align: center;">
              <!-- Logo de la empresa -->
              <a href="https://ibb.co/rp0P6X3"><img src="https://i.ibb.co/pKwDzkQ/logo.png" alt="logo" border="0"></a>
              <h2 style="color: white; margin: 0;">Bienvenido a BienesRaices.com</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <p style="font-size: 16px;">Hola ${nombre},</p>
              <p style="font-size: 16px;">Gracias por registrarte en <strong>BienesRaices.com</strong>. Nos complace tenerte con nosotros, y estamos seguros de que podrás encontrar la mejor propiedad que se adapte a tus necesidades.</p>
              <p style="font-size: 16px;">Tu cuenta está casi lista, solo necesitamos que confirmes tu dirección de correo electrónico para asegurarnos de que todo está correcto y que eres tú quien está registrando la cuenta.</p>
              <p style="font-size: 16px;">Haz clic en el siguiente enlace para confirmar tu cuenta y comenzar a explorar nuestra plataforma:</p>
              <p style="text-align: center;">
                <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/createConfirm/${token}" style="background-color: #28a745; color: white; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">Confirmar cuenta</a>
              </p>
              <p style="font-size: 16px;">Si no solicitaste esta cuenta, por favor ignora este correo. No se realizarán cambios en tu cuenta.</p>
              <p style="font-size: 16px;">Una vez confirmada tu cuenta, podrás empezar a explorar propiedades disponibles, crear alertas personalizadas y contactar a nuestros agentes inmobiliarios para obtener más detalles sobre las propiedades que te interesen.</p>
              <p style="font-size: 16px;">Te agradecemos por confiar en nosotros. En <strong>BienesRaices.com</strong> nos esforzamos por ofrecerte el mejor servicio para ayudarte a encontrar el hogar de tus sueños.</p>
              <p style="font-size: 16px;">Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte. Estaremos encantados de ayudarte en todo lo que necesites.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f4; padding: 10px; text-align: center;">
              <p style="font-size: 14px; color: #888888;">&copy; ${new Date().getFullYear()} BienesRaices.com. Todos los derechos reservados.</p>
            </td>
          </tr>
          <!-- Pie de firma -->
          <tr>
            <td style="background-color: #ffffff; padding: 10px; text-align: center; font-size: 14px; color: #888888; border-top: 1px solid #ddd;">
              <p><strong>Bienes Raíces 230237</strong></p>
              <!-- Firma digital (si es una firma textual) -->
              <p style="color: #0056b3; font-style: italic;">Firma digital: <span style="color: #666;">citlalli</span></p>
              <a href="https://imgbb.com/"><img src="https://i.ibb.co/yR3GmBh/firma.png" alt="firma" border="0"></a>
              <!-- Iconos de redes sociales -->
              <div style="text-align: center; margin-top: 10px;">
                <a href="https://facebook.com/BienesRaices" target="_blank">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style="width: 24px; margin: 0 10px;">
                </a>
                <a href="https://twitter.com/BienesRaices" target="_blank">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/X_logo_2012.svg" alt="Twitter" style="width: 24px; margin: 0 10px;">
                </a>
                <a href="https://instagram.com/BienesRaices" target="_blank">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram" style="width: 24px; margin: 0 10px;">
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  console.log(datos);
};

const emailChangePassword = async (datos) => {

  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { email, nombre, token } = datos;

  await transport.sendMail({
    from: 'BienesRaices.com <no-reply@bienesraices.com>',
    to: email,
    subject: 'Solicitar actualización de contraseña de BienesRaices.com',
    text: 'Por favor actualiza tu contraseña para ingresar a la plataforma de BienesRaices.com',
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #333333; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
          <tr>
            <td style="background-color: #0056b3; padding: 20px; text-align: center;">
              <!-- Logo de la empresa -->
              <a href="https://ibb.co/rp0P6X3"><img src="https://i.ibb.co/pKwDzkQ/logo.png" alt="logo" border="0"></a>
              <h2 style="color: white; margin: 0;">Bienvenido a BienesRaices.com</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <p style="font-size: 16px;">Hola ${nombre},</p>
              <p style="font-size: 16px;">Gracias por registrarte en <strong>BienesRaices.com</strong>. Nos complace tenerte con nosotros, y estamos seguros de que podrás encontrar la mejor propiedad que se adapte a tus necesidades.</p>
              <p style="font-size: 16px;">Tu cuenta está casi lista, solo necesitamos que confirmes tu dirección de correo electrónico para asegurarnos de que todo está correcto y que eres tú quien está registrando la cuenta.</p>
              <p style="font-size: 16px;">Haz clic en el siguiente enlace para reestablecer tu contraseña:</p>
              <p style="text-align: center;">
                <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/reserPassword/${token}" style="background-color: #28a745; color: white; padding: 10px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">Confirmar cuenta</a>
              </p>
              <p style="font-size: 16px;">Si no solicitaste esta cuenta, por favor ignora este correo. No se realizarán cambios en tu cuenta.</p>
              <p style="font-size: 16px;">Una vez confirmada tu cuenta, podrás empezar a explorar propiedades disponibles, crear alertas personalizadas y contactar a nuestros agentes inmobiliarios para obtener más detalles sobre las propiedades que te interesen.</p>
              <p style="font-size: 16px;">Te agradecemos por confiar en nosotros. En <strong>BienesRaices.com</strong> nos esforzamos por ofrecerte el mejor servicio para ayudarte a encontrar el hogar de tus sueños.</p>
              <p style="font-size: 16px;">Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte. Estaremos encantados de ayudarte en todo lo que necesites.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f4; padding: 10px; text-align: center;">
              <p style="font-size: 14px; color: #888888;">&copy; ${new Date().getFullYear()} BienesRaices.com. Todos los derechos reservados.</p>
            </td>
          </tr>
          <!-- Pie de firma -->
          <tr>
            <td style="background-color: #ffffff; padding: 10px; text-align: center; font-size: 14px; color: #888888; border-top: 1px solid #ddd;">
              <p><strong>Bienes Raíces 230237</strong></p>
              <!-- Firma digital (si es una firma textual) -->
              <p style="color: #0056b3; font-style: italic;">Firma digital: <span style="color: #666;">citlalli</span></p>
              <a href="https://imgbb.com/"><img src="https://i.ibb.co/yR3GmBh/firma.png" alt="firma" border="0"></a>
              <!-- Iconos de redes sociales -->
              <div style="text-align: center; margin-top: 10px;">
                <a href="https://facebook.com/BienesRaices" target="_blank">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style="width: 24px; margin: 0 10px;">
                </a>
                <a href="https://twitter.com/BienesRaices" target="_blank">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/X_logo_2012.svg" alt="Twitter" style="width: 24px; margin: 0 10px;">
                </a>
                <a href="https://instagram.com/BienesRaices" target="_blank">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" alt="Instagram" style="width: 24px; margin: 0 10px;">
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  console.log(datos);
};
export {
  emailRegistro,emailChangePassword
};
