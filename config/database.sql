create database cardapio;
use cardapio;


create table loja_parceira (
	id_parceira int auto_increment primary key not null,
    nome_parceira varchar (255) not null,
	email_parceira varchar (255) not null,
    senha_parceira varchar (255) not null,
    cpf_parceira varchar (55),
    telefone_parceira int,
    cep_parceira int,
    endereco_parceira varchar (255),
    bairro_parceira varchar (255),
    cidade_parceira varchar (255),
    numero_parceira int,
    categoria_parceira varchar (55),
    img_parceira varchar (255) default 'img/user.png',
    tipo_usuario int default '2',
    plano_parceira varchar(55) default 'Bronze'
);

create table produtos (
	id_produto int auto_increment primary key not null,
    id_parceira int not null,
    img_produto varchar (255),
    nome_produto varchar (55) not null,
    descricao_produto varchar (255) not null,
    preco_produto int not null,
    categoria_produto varchar (55)
);

create table notificacoes (
	id_notificacao int auto_increment primary key not null,
    id_usuario_destino int,
    titulo_notificacao varchar (55),
    descricao_notificacao varchar (255),
    categoria_notificacao varchar (55)
);

create table notificacoesUsuario (
	id_notificacao int auto_increment primary key not null,
    id_usuario_destino int,
    titulo_notificacao varchar (55),
    descricao_notificacao varchar (255),
    categoria_notificacao varchar (55)
);

create table carrinho (
	id_carrinho int auto_increment primary key not null,
    id_cliente int
);
