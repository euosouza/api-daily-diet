# 🥗 Daily Diet API

API REST para controle de refeições e acompanhamento de dieta diária.

---

## 📋 Sobre o projeto

A **Daily Diet API** permite que usuários registrem e gerenciem suas refeições do dia a dia, acompanhem métricas de desempenho na dieta e identifiquem sua melhor sequência de refeições dentro da dieta.

---

## ⚙️ Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/euosouza/api-daily-diet.git
cd api-daily-diet

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Inicie o servidor em modo desenvolvimento
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

---

## 📌 Regras da Aplicação

### Usuários

- Deve ser possível **criar um usuário**
- Deve ser possível **identificar o usuário** entre as requisições (via cookie de sessão)

### Refeições

> As refeições devem ser relacionadas a um usuário.

- Deve ser possível **registrar uma refeição** com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- Deve ser possível **editar uma refeição**, podendo alterar todos os dados acima
- Deve ser possível **apagar uma refeição**
- Deve ser possível **listar todas as refeições** de um usuário
- Deve ser possível **visualizar uma única refeição**
- O **usuário só pode visualizar, editar e apagar** as refeições que ele próprio criou

### Métricas

- Deve ser possível **recuperar as métricas** de um usuário:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
