CREATE DATABASE roteiro;
DROP DATABASE roteiro;

CREATE TABLE usuarios (
	id serial primary key,
  nome varchar(100) not null,
  email varchar(70) not null unique,
  senha text not null
);
DROP TABLE usuarios;


INSERT INTO roteiro
    (nome, email, senha)
VALUES
    ('gobis', 'gobis@gmail.com', '123');

SELECT 
	* 
FROM 
	usuarios
WHERE
	email = 'caldeira@gmail.com' AND id <> 2;
  
SELECT * FROM usuarios WHERE id = 1;