var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);


const multer = require('multer');
const path = require('path');
// ****************** Versão com armazenamento em diretório
// Definindo o diretório de armazenamento das imagens
var storagePasta = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './app/public/img/produto/') // diretório de destino  
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    //renomeando o arquivo para evitar duplicidade de nomes
  }
})

var upload = multer({ storage: storagePasta });



var fabricaDeConexao = require("../../config/connection-factory");
var conexao = fabricaDeConexao();


var { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");

var UsuarioDAL = require("../models/UsuarioDAL");
var usuarioDAL = new UsuarioDAL(conexao);

var ProdutoDAL = require("../models/ProdutoDAL");
var produtoDAL = new ProdutoDAL(conexao);

const { body, validationResult } = require("express-validator");

router.get("/", function(req, res){
    res.render("pages/1-home-user", {autenticado: req.session.autenticado})
})

router.get("/dashboard", verificarUsuAutenticado ,verificarUsuAutorizado([2, 3], ("/login")), function(req, res){
  res.render("pages/2-dashboard-seller", {autenticado:req.session.autenticado, retorno: null, erros: null})
})

// router.get("/catalogo", verificarUsuAutenticado , verificarUsuAutorizado([2, 3], ("/login")), async function(req, res){
//   try {
//     // Lógica para buscar os produtos associados ao ID do usuário logado
//     let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
//     console.log(pagina)
//     const usuarioID = req.session.autenticado.id_parceira; // ID do usuário logado
//     console.log(usuarioID)
//     inicio = parseInt(pagina - 1) * 5;
//     const totReg = await produtoDAL.TotalRegByUserId(usuarioID);
//     console.log('Total de registros:', totReg); // Verifique se o valor retornado parece correto
//     resultsprod = await produtoDAL.FindPageByUserId(usuarioID, inicio, 5); // Busca produtos pelo ID do usuário
//     console.log(resultsprod)
//     totPaginas = Math.ceil(totReg[0].total / 5);
//     var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas }
  
//     res.render("pages/3-catalogo-seller", {produtos: resultsprod, paginador: paginador, autenticado:req.session.autenticado, retorno: null, erros: null})    
//   } catch (e) {
//     console.log(e);
//     res.json({ erro: "Falha ao acessar dados" });
//   }
  
  
// })

router.get("/catalogo", verificarUsuAutenticado, verificarUsuAutorizado([2, 3], ("/login")), async function(req, res){
  if (req.session.autenticado == null) {
    res.redirect("/login");
  } else {
    try {
      // Buscar postagens do usuário com base no ID
      const idUsuario = req.session.autenticado.id_parceira;
      const sqlProdutos = 'SELECT * FROM produtos WHERE id_parceira = ?';
      const sqlNotificacoes = 'SELECT * FROM notificacoes';
      const sqlNotificacoesUsuario = 'SELECT * FROM notificacoesusuario WHERE id_usuario_destino = ?';
    
      conexao.query(sqlProdutos, [idUsuario], (errProdutos, resultProdutos) => {
        if (errProdutos) {
          res.status(500).json({ error: 'Erro ao buscar produtos' });
        } else {
          // Buscar todas as notificações
          conexao.query(sqlNotificacoes, (errNotificacoes, resultNotificacoes) => {
            if (errNotificacoes) {
              res.status(500).json({ error: 'Erro ao buscar notificações' });
            } else {
              // Buscar notificações do usuário no id_usuario_destino
              conexao.query(sqlNotificacoesUsuario, [idUsuario], (errNotificacoesUsuario, resultNotificacoesUsuario) => {
                if (errNotificacoesUsuario) {
                  res.status(500).json({ error: 'Erro ao buscar notificações do usuário no id_usuario_destino' });
                } else {
                  res.render('pages/3-catalogo-seller', {
                    produtos: resultProdutos || [],
                    notificacoes: resultNotificacoes || [],
                    notificacoesUsuario: resultNotificacoesUsuario || [],
                    autenticado: req.session.autenticado
                  });
                }
              });
            }
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados' });
    }
  }
  
  
  
})

router.get("/editarproduto/:id_produto", verificarUsuAutenticado, verificarUsuAutorizado([2, 3], ("/catalogo")), async function (req, res) {
  try {
    result = await produtoDAL.findID(req.params.id_produto)
    console.log(result)
    res.render("pages/11-catalogo-edit", { produtos: result, autenticado: req.session.autenticado, login: req.res.autenticado })

  } catch {
    res.redirect("/catalogo")
  }
})

router.get("/informacoes", verificarUsuAutenticado , verificarUsuAutorizado([2, 3], ("/login")), function(req, res){
  res.render("pages/4-informacoes-seller", {autenticado:req.session.autenticado, retorno: null, erros: null})
})

router.get("/chat", verificarUsuAutenticado , verificarUsuAutorizado([2, 3], ("/login")), function(req, res){
  res.render("pages/5-chat-seller", {autenticado:req.session.autenticado, retorno: null, erros: null})
})

router.get("/vendas", verificarUsuAutenticado , verificarUsuAutorizado([2, 3], ("/login")), function(req, res){
  res.render("pages/6-vendas-seller", {autenticado:req.session.autenticado, retorno: null, erros: null})
})

router.get("/assinatura", verificarUsuAutenticado , verificarUsuAutorizado([2, 3], ("/login")), function(req, res){
  res.render("pages/7-assinatura-seller", {autenticado:req.session.autenticado, retorno: null, erros: null})
})

router.get("/configuracoes", verificarUsuAutenticado , verificarUsuAutorizado([2, 3], ("/login")), function(req, res){
  res.render("pages/8-configuracoes-seller", {autenticado:req.session.autenticado, retorno: null, erros: null})
})

router.get("/login", function(req, res){
  res.render("pages/9-login-seller", {autenticado:req.session.autenticado, listaErros: null, dadosNotificacao: null, valores: req.body})
})

router.get("/cadastro", function(req, res){
  res.render("pages/10-cadastro-seller", {autenticado:req.session.autenticado, listaErros: null, dadosNotificacao: null, valores: req.body})
})


// funcções

router.get("/sair", limparSessao, function (req, res) {
  res.redirect("/");
});

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

  
router.post("/publicarproduto",
upload.single('img_produto'),
async function (req, res) {
  const formProduto = {
    id_parceira: req.session.autenticado.id_parceira,
    img_produto: req.body.img_produto,
    nome_produto: req.body.nome_produto,
    descricao_produto: req.body.descricao_produto,
    preco_produto: req.body.preco_produto,
    categoria_produto: req.body.categoria_produto
    

  }
  if (!req.file) {
    console.log("Falha no carregamento");
  } else {
    caminhoArquivo = "img/produto/" + req.file.filename;
    formProduto.img_produto = caminhoArquivo
  }
  try {
    let insert = await produtoDAL.create(formProduto);
    console.log(insert);
    res.redirect("/catalogo")
    // res.render("pages/anunciar", {
    //   listaErros: null, dadosNotificacao: {
    //     titulo: "Produto Publicado!", mensagem: "Produto publicado com o id " + insert.insertId + "!", tipo: "success"
    //   }, valores: req.body
    // })
  } catch (e) {
    res.redirect("/catalogo")
    // res.render("pages/anunciar", {
    //   listaErros: erros, dadosNotificacao: {
    //     titulo: "Erro ao publicar!", mensagem: "Verifique os valores digitados!", tipo: "error"
    //   }, valores: req.body
    // })
  }
}
)

router.post("/editarproduto/:id_produto",
async function(req, res){
  var dadosProduto = {
    nome_produto: req.body.nome_produto,
    descricao_produto: req.body.descricao_produto,
    preco_produto: req.body.preco_produto,
    categoria_produto: req.body.categoria_produto
  }
  var id_produto = req.params.id_produto
  console.log(dadosProduto)
  let resultUpdate = await produtoDAL.update(dadosProduto, id_produto);
  
  if (!resultUpdate.isEmpty) {
    if (resultUpdate.changedRows == 1) {
      var result = await produtoDAL.findID(id_produto);
      res.redirect("/catalogo")
    }
  }

})

router.get("/deletarproduto/:id_produto", function (req, res) {
  var query = conexao.query(
    "DELETE FROM produtos WHERE ?",
    { id_produto: req.params.id_produto },
    function (error, results, fields) {
      if (error) throw error;
    }
  );  
  res.redirect("/catalogo");
});



module.exports = router