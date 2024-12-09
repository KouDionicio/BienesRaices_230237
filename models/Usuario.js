import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt';
import db from '../db/config.js'

const Usuario = db.define('tbb_users',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    hooks:{
        beforeCreate: async function(Usuario){

          //generamos la clave para el hasheo, se recomiendan 10 rondas de aleaterización pra no consumir demadiados recursos de hardware y hacer lento el proceso
          const salt = await bcrypt.genSalt(10)
          Usuario.password = await bcrypt.hash(Usuario.password, salt);
        },
        beforeUpdate: async function(Usuario){

            if(Usuario.confirmado != null && Usuario.token == null){
                //generamos la clave para el hasheo, se recomiendan 10 rondas de aleaterización pra no consumir demadiados recursos de hardware y hacer lento el proceso
                const salt = await bcrypt.genSalt(10)
                Usuario.password = await bcrypt.hash(Usuario.password, salt);
            }
        }
    }
});

// Dentro del modelo Usuario (ejemplo con bcrypt)
Usuario.prototype.passwordVerify = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default Usuario;