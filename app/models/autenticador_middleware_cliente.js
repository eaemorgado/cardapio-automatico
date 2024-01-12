const { validationResult } = require("express-validator");


function verificarUsuAutenticadoCliente(req, res, next) {
    if (req.session.autenticadouser) {
        var autenticadouser = req.session.autenticadouser;
    } else {
        var autenticadouser = { autenticadouser: null };
    }
    req.session.autenticadouser = autenticadouser;
    console.log(req.session.autenticadouser);
    next();
}

function gravarUsuAutenticadoCliente(clienteDAL, bcrypt) {
    return async (req, res, next) => {
        erros = validationResult(req)
        if (erros.isEmpty()) {
            var dadosForm = {
                email_cliente: req.body.email_cliente,
                senha_cliente: req.body.senha_cliente,
            };
            var results = await clienteDAL.findUserEmail(dadosForm);
            var total = Object.keys(results).length;
            if (total == 1) {
                if (bcrypt.compareSync(dadosForm.senha_cliente, results[0].senha_cliente)) {
                    var autenticadouser = {
                        autenticadouser: results[0].nome_cliente,
                        id_cliente: results[0].id_cliente,
                        email_cliente: results[0].email_cliente,
                        senha_cliente: results[0].senha_cliente,
                        telefone_cliente: results[0].telefone_cliente,
                        cep_cliente: results[0].cep_cliente,
                        endereco_cliente: results[0].endereco_cliente,
                        bairro_cliente: results[0].bairro_cliente,
                        cidade_cliente: results[0].cidade_cliente,
                        numero_cliente: results[0].numero_cliente,
                        tipo: results[0].tipo_usuario,
                    };
                }
            } else {
                var autenticadouser =  null ;
            }
        } else {
            var autenticadouser = null ;
            //tratar os erros no campo do formulário
        }
        req.session.autenticadouser = autenticadouser;
        next();
    }
}

function verificarUsuAutorizadoCliente(tipoPermitido, destinoFalha){
    return (req, res, next) => {
        if (req.session.autenticadouser != null && tipoPermitido.find(function (element) { return element == req.session.autenticadouser.tipo }) != undefined ) {
            next();
        } else {
            res.redirect(destinoFalha);
        }
    };
}

module.exports = {
    verificarUsuAutenticadoCliente,
    gravarUsuAutenticadoCliente,
    verificarUsuAutorizadoCliente
}