# API de Armazenamento de Fotos (Estilo Google Fotos)

Projeto desenvolvido para a disciplina **Programação Web Back-End** com Node.js e MongoDB. O sistema permite o **armazenamento de fotos** em **álbuns**, com **upload de imagens**, **consulta por fotos** e **log de erros**.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB (via Mongoose)
- Multer (upload de arquivos)
- dotenv (variáveis de ambiente)
- fs (para logs)

## Estrutura de Diretórios

```
foto-album-app/
├── controllers/        # Lógica das requisições
├── models/             # Modelos (Mongoose)
├── routes/             # Endpoints da API
├── middlewares/        # Upload de imagens
├── uploads/            # Pasta onde imagens são salvas
├── utils/              # Logger de erros
├── .env                # Variáveis de ambiente
├── app.js              # Arquivo principal
├── package.json
```


## Como rodar o projeto

### 1. Clone o repositório

git clone https://github.com/ricardoutfpr/programacao-web-backend-projeto1.git

cd foto-album-app


### 2. Instale as dependências

npm install

### 3. Suba o Mongo

mongod

### 4. Inicie o projeto

npm run dev

O servidor estará em: http://localhost:3000

## Endpoints da API

### Criar Álbum

- URL: POST /api/albuns
- Corpo JSON:

json

{
  "nome": "Viagem 2025",
  "descricao": "Fotos da viagem ao Rio de Janeiro"
}


- Resposta: dados do álbum criado

### Listar Álbuns

- URL: GET /api/albuns
- Resposta: array com todos os álbuns

### Enviar Foto

- URL: POST /api/fotos
- Tipo: multipart/form-data
- Campos:
  - foto: arquivo (jpg, jpeg e png)
  - titulo: título da foto
  - album: ID do álbum ao qual a foto pertence

- Resposta: dados da foto criada

### Listar Fotos

- URL: GET /api/fotos
- Resposta: lista com todas as fotos (inclui dados do álbum)

## Logger de Erros

Todos os erros da aplicação são registrados no arquivo:

logs.txt


Inclui mensagens de falha ao conectar com o banco, falhas de validação, uploads, etc.

## Validações

- Campos obrigatórios são verificados nos models do Mongoose
- Todos os erros de execução são tratados com try/catch
- Uploads são salvos apenas se válidos (via Multer)

## Autor

Ricardo França

Projeto Acadêmico para EC48B - Programação Web Back-End  

Professores: Monique Emídio de Oliveira & Willian Massami Watanabe
