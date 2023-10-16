CREATE DATABASE roteiro;

CREATE TABLE usuarios (
	id serial primary key,
    nome varchar(100) not null,
    email varchar(70) not null unique,
    senha text not null
);


INSERT INTO roteiro
    (nome, email, senha)
VALUES
    ('gobis', 'gobis@gmail.com', '123');
