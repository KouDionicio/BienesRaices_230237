import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: '.env'});

const emailRegistro = async(datos) =>{
   
  // Looking to send emails in production? Check out our Email API/SMTP product!
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
   
  const{ email, nombre, token} = datos;
  
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
     <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

     <p>Tu cuenta ya esta lista, solo debes confirmarlo en el siguiente enlace: 
     <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT} /usuario/createConfirm/${token}"> Confirmar cuenta </a></p>

     <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>

    `
     
      
  })


  console.log(datos)
}




export{
    emailRegistro
}