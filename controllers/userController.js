const formularioLogin = (req, res) =>{
    res.render('auth/login', {
        autenticado: false
    })
};


const formularioRegister = (req, res) =>{
    res.render('auth/register', {
       page: "Crea una nueva Cuenta..."
    })
};

const formularioPasswordRecovery = (req, res) =>{
    res.render('auth/passwordRecovery', {
       
    })
};

export{
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery
};