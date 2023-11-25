create database cardapio;
use cardapio;


create table loja_parceira (
	id_parceira int auto_increment primary key not null,
    nome_parceira varchar (255) not null,
	email_parceira varchar (255) not null,
    senha_parceira varchar (255) not null,
    cpf_parceira varchar (55),
    img_parceira varchar (255) default 'img/user.png'
);