var express = require("express");
var router = express.Router();

var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao();


var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");
var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(conexao);
const { body, validationResult } = require("express-validator");

router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });

router.get("/", function(req, res){
    res.render("pages/home", {autenticado: req.session.autenticado})
})



module.exports = router