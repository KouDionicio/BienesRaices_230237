import Sequelize from 'sequelize';
import dotenv from 'dotenv';  //añadimos la libreria
dotenv.config({path: '.env'}); // se añadio las variables de entorno

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: 3307,
    dialect: 'mysql',
    logging: false,
    define:{
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db; 