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


module.exports = router