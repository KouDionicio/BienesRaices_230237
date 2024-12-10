import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const generatedJWT = datos => jwt.sign({
        id: datos.id,
        developer_name: datos.nombre,
        empresa: datos.empresa,
        software: datos.software
},process.env.JWT_SECRET,{expiresIn: '1d'}) 

const generatedId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generatedJWT,
    generatedId
};
