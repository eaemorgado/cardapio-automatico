const { validationResult } = require("express-validator");


function verificarUsuAutenticado(req, res, next) {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null };
    }
    req.session.autenticado = autenticado;
    console.log(req.session.autenticado);
    next();
}

function limparSessao(req, res, next) {
    req.session.destroy();
    next()
}

function gravarUsuAutenticado(usuarioDAL, bcrypt) {
    return async (req, res, next) => {
        erros = validationResult(req)
        if (erros.isEmpty()) {
            var dadosForm = {
                email_parceira: req.body.email_parceira,
                senha_parceira: req.body.senha_parceira,
            };
            var results = await usuarioDAL.findUserEmail(dadosForm);
            var total = Object.keys(results).length;
            if (total == 1) {
                if (bcrypt.compareSync(dadosForm.senha_parceira, results[0].senha_parceira)) {
                    var autenticado = {
                        autenticado: results[0].nome_parceira,
                        id_parceira: results[0].id_parceira,
                        email_parceira: results[0].email_parceira,
                        senha_parceira: results[0].senha_parceira,
                        cpf_parceira: results[0].cpf_parceira,
                        telefone_parceira: results[0].telefone_parceira,
                        categoria_parceira: results[0].categoria_parceira,
                        cep_parceira: results[0].cep_parceira,
                        endereco_parceira: results[0].endereco_parceira,
                        cidade_parceira: results[0].cidade_parceira,
                        estado_parceira: results[0].estado_parceira,
                        numero_parceira: results[0].numero_parceira,
                        tipo: results[0].tipo_usuario,
                        img_parceira: results[0].img_parceira
                    };
                }
            } else {
                var autenticado =  null ;
            }
        } else {
            var autenticado = null ;
            //tratar os erros no campo do formulário
        }
        req.session.autenticado = autenticado;
        next();
    }
}

function verificarUsuAutorizado(tipoPermitido, destinoFalha){
    return (req, res, next) => {
        if (req.session.autenticado != null && tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined ) {
            next();
        } else {
            res.redirect(destinoFalha);
        }
    };
}

module.exports = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}