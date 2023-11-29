var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

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
    res.render("pages/1-home-user", {autenticado: req.session.autenticado})
})

router.get("/dashboard", function(req, res){
  res.render("pages/2-dashboard-seller", {autenticado:req.session.autenticado})
})

router.get("/catalogo", function(req, res){
  res.render("pages/3-catalogo-seller", {autenticado:req.session.autenticado})
})

router.get("/informacoes", function(req, res){
  res.render("pages/4-informacoes-seller", {autenticado:req.session.autenticado})
})

router.get("/chat", function(req, res){
  res.render("pages/5-chat-seller", {autenticado:req.session.autenticado})
})

router.get("/vendas", function(req, res){
  res.render("pages/6-vendas-seller", {autenticado:req.session.autenticado})
})

router.get("/assinatura", function(req, res){
  res.render("pages/7-assinatura-seller", {autenticado:req.session.autenticado})
})

router.get("/configuracoes", function(req, res){
  res.render("pages/8-configuracoes-seller", {autenticado:req.session.autenticado})
})

router.get("/login", function(req, res){
  res.render("pages/9-login-seller", {autenticado:req.session.autenticado})
})

router.get("/cadastro", function(req, res){
  res.render("pages/10-cadastro-seller", {autenticado:req.session.autenticado})
})


// funcções

router.post("/cadastrar",
  body("nome_parceira")
    .isLength({ min: 3, max: 50 }).withMessage("Mínimo de 3 letras e máximo de 50!"),
  body("email_parceira")
    .isEmail().withMessage("Digite um e-mail válido!"),
  body("senha_parceira")
    .isStrongPassword()
    .withMessage("A senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 caractere especial e 1 número"),
  async function (req, res) {
    var dadosForm = {
      nome_parceira: req.body.nome_parceira,
      email_parceira: req.body.email_parceira,
      senha_parceira: bcrypt.hashSync(req.body.senha_parceira, salt),
    };
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.render("pages/10-cadastro-seller", { listaErros: erros, dadosNotificacao: null, valores: req.body })
    }
    try {
      let insert = await usuarioDAL.create(dadosForm);
      console.log(insert);
      res.render("pages/10-cadastro-seller", {
        listaErros: null, dadosNotificacao: {
          titulo: "Cadastro realizado!", mensagem: "Usuário criado com o id " + insert.insertId + "!", tipo: "success"
        }, valores: req.body
      })
    } catch (e) {
      res.render("pages/10-cadastro-seller", {
        listaErros: erros, dadosNotificacao: {
          titulo: "Erro ao cadastrar!", mensagem: "Verifique os valores digitados!", tipo: "error"
        }, valores: req.body
      })
    }
  });

  
router.post(
  "/logar",
  body("email_parceira")
    .isLength({ min: 4, max: 45 })
    .withMessage("O nome de usuário/e-mail esta incorreto!"),
  body("senha_parceira")
    .isStrongPassword()
    .withMessage("Verifique novamente a senha digitada!"),

  gravarUsuAutenticado(usuarioDAL, bcrypt),
  function (req, res) {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.render("pages/9-login-seller", { listaErros: erros, dadosNotificacao: null })
    }
    if (req.session.autenticado != null) {
      res.render("pages/9-login-seller", {
        listaErros: null, dadosNotificacao: {
          titulo: "Login realizado!", mensagem: "Usuário logado com sucesso", tipo: "success"
        }, valores: req.body
      })
    } else {
      res.render("pages/9-login-seller", { listaErros: erros, dadosNotificacao: { titulo: "Erro ao logar!", mensagem: "Usuário e/ou senha inválidos!", tipo: "error" } })
    }
  });


module.exports = router