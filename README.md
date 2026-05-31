# 🥗 Daily Diet API

API REST para controle de refeições e acompanhamento de dieta diária, desenvolvida com **Fastify**, **TypeScript** e **SQLite**.

---

## 📋 Sobre o projeto

A **Daily Diet API** permite que usuários registrem e gerenciem suas refeições do dia a dia, acompanhem métricas de desempenho na dieta e identifiquem sua melhor sequência de refeições dentro da dieta.

A identificação do usuário é feita de forma simples via **cookie de sessão** (`sessionId`), sem necessidade de autenticação com senha.

---

## 🚀 Tecnologias

| Tecnologia | Versão | Descrição |
|---|---|---|
| [Node.js](https://nodejs.org/) | v18+ | Ambiente de execução |
| [TypeScript](https://www.typescriptlang.org/) | ^6.0 | Tipagem estática |
| [Fastify](https://www.fastify.io/) | ^5.8 | Framework web |
| [@fastify/cookie](https://github.com/fastify/fastify-cookie) | ^11.0 | Gerenciamento de cookies |
| [Knex.js](https://knexjs.org/) | ^3.2 | Query builder / migrations |
| [SQLite3](https://www.sqlite.org/) | ^6.0 | Banco de dados |
| [Zod](https://zod.dev/) | ^4.4 | Validação de schemas |
| [dotenv](https://github.com/motdotla/dotenv) | ^17.4 | Variáveis de ambiente |

**Dev:**
- `tsx` — execução de TypeScript em desenvolvimento
- `ESLint` + `Prettier` — linting e formatação
- `Husky` — git hooks

---

## ⚙️ Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/euosouza/api-daily-diet.git
cd api-daily-diet

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Execute as migrations do banco de dados
npm run knex -- migrate:latest

# Inicie o servidor em modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor em modo watch (desenvolvimento) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Inicia o servidor a partir do build |
| `npm run lint` | Verifica linting com ESLint |
| `npm run lint:fix` | Corrige problemas de lint automaticamente |
| `npm run format` | Formata o código com Prettier |
| `npm run check` | Executa lint + verificação de formatação |
| `npm run knex -- migrate:latest` | Executa as migrations |
| `npm run knex -- migrate:rollback` | Desfaz a última migration |

---

## 🗂️ Estrutura do projeto

```
api-daily-diet/
├── src/
│   ├── env/                    # Validação das variáveis de ambiente (Zod)
│   ├── middlewares/
│   │   └── check-session-id.middleware.ts  # Verifica cookie de sessão
│   ├── routes/
│   │   └── meals.routes.ts     # Rotas de refeições
│   ├── database.ts             # Configuração do Knex
│   └── server.ts               # Inicialização do Fastify
├── db/
│   └── migrations/             # Arquivos de migration do banco
├── .env                        # Variáveis de ambiente (não versionado)
├── .env.example                # Exemplo de variáveis de ambiente
├── knexfile.ts                 # Configuração do Knex CLI
└── api-daily-diet.postman_collection.json  # Collection do Postman
```

---

## 🔐 Autenticação

A API utiliza **cookie de sessão** (`sessionId`) para identificar o usuário. O cookie é criado automaticamente na **primeira requisição** de criação de refeição e deve ser mantido nas requisições subsequentes.

> ⚠️ Endpoints marcados com 🔒 requerem que o cookie `sessionId` esteja presente.

---

## 📡 Endpoints

Base URL: `http://localhost:3000`

### Refeições — `/meals`

#### `POST /meals` — Criar refeição

Cria uma nova refeição. Se o cookie `sessionId` não existir, ele será criado automaticamente.

**Request Body:**
```json
{
  "name": "Almoço saudável",
  "description": "Frango grelhado com arroz integral e salada",
  "date_time": "2026-05-31T12:00:00.000Z",
  "on_diet": true
}
```

**Response:** `201 Created` (sem corpo)

---

#### `GET /meals` 🔒 — Listar refeições

Retorna todas as refeições do usuário da sessão atual.

**Response `200 OK`:**
```json
{
  "meals": [
    {
      "id": "uuid-da-refeicao",
      "session_id": "uuid-da-sessao",
      "name": "Almoço saudável",
      "description": "Frango grelhado com arroz integral e salada",
      "date_time": "2026-05-31T12:00:00.000Z",
      "on_diet": 1
    }
  ]
}
```

---

#### `GET /meals/:id` 🔒 — Buscar refeição por ID

Retorna os dados de uma refeição específica pelo ID.

**Response `200 OK`:**
```json
{
  "meal": {
    "id": "uuid-da-refeicao",
    "session_id": "uuid-da-sessao",
    "name": "Almoço saudável",
    "description": "Frango grelhado com arroz integral e salada",
    "date_time": "2026-05-31T12:00:00.000Z",
    "on_diet": 1
  }
}
```

**Response `404 Not Found`:**
```json
{ "error": "Refeição não encontrada" }
```

---

#### `PUT /meals/:id` — Atualizar refeição

Atualiza todos os dados de uma refeição existente. O usuário só pode editar suas próprias refeições (verificado pelo `sessionId`).

**Request Body:**
```json
{
  "name": "Almoço atualizado",
  "description": "Salmão grelhado com batata-doce",
  "date_time": "2026-05-31T12:30:00.000Z",
  "on_diet": true
}
```

**Response:** `200 OK` (sem corpo) ou `404 Not Found`

---

#### `DELETE /meals/:id` — Deletar refeição

Remove uma refeição pelo ID.

**Response:** `200 OK` (sem corpo) ou `404 Not Found`

---

#### `GET /meals/summary` 🔒 — Resumo da dieta

Retorna um resumo estatístico da dieta do usuário.

**Response `200 OK`:**
```json
{
  "summary": {
    "totalMeals": 10,
    "totalOnDiet": 7,
    "totalNotOnDiet": 3,
    "bestSequence": 5
  }
}
```

| Campo | Descrição |
|---|---|
| `totalMeals` | Total de refeições registradas |
| `totalOnDiet` | Total de refeições dentro da dieta |
| `totalNotOnDiet` | Total de refeições fora da dieta |
| `bestSequence` | Melhor sequência consecutiva de refeições dentro da dieta |

---

## 📌 Regras da Aplicação

### Usuários

- Deve ser possível **criar um usuário** (via primeira refeição criada)
- Deve ser possível **identificar o usuário** entre as requisições (via cookie de sessão)

### Refeições

> As refeições são vinculadas ao `sessionId` do usuário.

- Deve ser possível **registrar uma refeição** com: nome, descrição, data/hora e status de dieta
- Deve ser possível **editar uma refeição**, podendo alterar todos os dados
- Deve ser possível **apagar uma refeição**
- Deve ser possível **listar todas as refeições** de um usuário
- Deve ser possível **visualizar uma única refeição**
- O **usuário só pode visualizar, editar e apagar** as refeições que ele próprio criou

### Métricas

- Deve ser possível **recuperar as métricas** de um usuário:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência consecutiva de refeições dentro da dieta

---

## 🧪 Testando a API

A collection do Postman está disponível no arquivo [`api-daily-diet.postman_collection.json`](./api-daily-diet.postman_collection.json).

Para importar no Postman:
1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `api-daily-diet.postman_collection.json`
4. A variável `baseUrl` já está configurada como `http://localhost:3000`

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
