// configuração inicial do servidor local
const express = require("express");
const app = express();
const port = 3000
var session = require("express-session");

// configurando local dos complementos 
app.use(express.static("app/public"));

// configurando a vizualização
app.set("view engine", "ejs");
app.set("views", "./app/views");

// Configura a sessão
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'athenashop',
  resave: true,
  saveUninitialized: true
}));

//configurando as rotas
var rotas   = require("./app/routes/router");
app.use("/", rotas);

//configurando a porta local
app.listen(port, () =>{
    console.log(`O site esta online`)
});