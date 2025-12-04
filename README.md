# 💰 Meu Controle Financeiro

Sistema completo de controle financeiro pessoal desenvolvido com Node.js + Express (backend) e frontend estático em HTML/CSS/JavaScript.

## 📋 Funcionalidades

- ✅ **Autenticação completa** (registro e login com JWT)
- 💸 **Gestão de transações** (entradas e saídas)
- 👥 **Controle de devedores** (quem te deve dinheiro)
- 📈 **Acompanhamento de investimentos**
- 📊 **Dashboard com visão geral**
- ⚙️ **Configurações personalizáveis**
- 📜 **Histórico de alterações**

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- bcrypt (hash de senhas)
- jsonwebtoken (autenticação JWT)
- Banco de dados JSON (arquivo store.json)

### Frontend
- HTML5
- CSS3 (design responsivo)
- JavaScript vanilla (sem frameworks)

## 📁 Estrutura do Projeto

```
MeuControle/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── jsonStore.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── debtHistoryController.js
│   │   ├── debtorsController.js
│   │   ├── investmentsController.js
│   │   ├── settingsController.js
│   │   └── transactionsController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── debtHistoryModel.js
│   │   ├── debtorModel.js
│   │   ├── investmentsModel.js
│   │   ├── transactionsModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── debtHistory.js
│   │   ├── debtors.js
│   │   ├── investments.js
│   │   ├── settings.js
│   │   └── transactions.js
│   ├── tools/
│   │   ├── inspect_store.js
│   │   └── import_actions.js
│   ├── check_db.js
│   ├── test_login.js
│   ├── test_register.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── css/
│   │   ├── dashboard.css
│   │   ├── debtors.css
│   │   ├── index.css
│   │   ├── investments.css
│   │   ├── login.css
│   │   ├── settings.css
│   │   └── transactions.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── debtors.js
│   │   ├── header.js
│   │   ├── investments.js
│   │   ├── settings.js
│   │   └── transactions.js
│   ├── pages/
│   │   ├── dashboard.html
│   │   ├── debtors.html
│   │   ├── investments.html
│   │   ├── login.html
│   │   ├── settings.html
│   │   └── transactions.html
│   ├── index.html
│   └── header.html
└── database/
    └── store.json
```

## 🔧 Instalação

### 1. Clone ou extraia o projeto

```bash
cd MeuControle
```

### 2. Configure o backend

```bash
cd backend
npm install
```

### 3. Crie o arquivo .env

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
```

**⚠️ IMPORTANTE**: Altere o `JWT_SECRET` para uma string aleatória e segura em produção!

## 🎯 Executando o Projeto

### Modo Desenvolvimento (com auto-reload)

```bash
cd backend
npm run dev
```

### Modo Produção

```bash
cd backend
npm start
```

O servidor estará disponível em: **http://localhost:3000**

## 👤 Usuários de Exemplo

O banco de dados já vem com 2 usuários de exemplo:

**Usuário 1:**
- Email: `admin@teste.com`
- Senha: `123456`

**Usuário 2:**
- Email: `demo@teste.com`
- Senha: `123456`

> **Nota**: As senhas estão com hash bcrypt no banco de dados.

## 📡 Endpoints da API

### Autenticação
```
POST   /api/auth/register    - Registrar novo usuário
POST   /api/auth/login       - Fazer login
GET    /api/auth/verify      - Verificar token
```

### Transações
```
GET    /api/transactions           - Listar transações
GET    /api/transactions/:id       - Buscar transação
POST   /api/transactions           - Criar transação
PUT    /api/transactions/:id       - Atualizar transação
DELETE /api/transactions/:id       - Deletar transação
GET    /api/transactions/balance   - Obter saldo
```

### Devedores
```
GET    /api/debtors       - Listar devedores
GET    /api/debtors/:id   - Buscar devedor
POST   /api/debtors       - Criar devedor
PUT    /api/debtors/:id   - Atualizar devedor
DELETE /api/debtors/:id   - Deletar devedor
```

### Investimentos
```
GET    /api/investments         - Listar investimentos
GET    /api/investments/:id     - Buscar investimento
POST   /api/investments         - Criar investimento
PUT    /api/investments/:id     - Atualizar investimento
DELETE /api/investments/:id     - Deletar investimento
GET    /api/investments/total   - Total investido
```

### Histórico e Configurações
```
GET    /api/debt-history                    - Histórico de dívidas
GET    /api/debt-history/debtor/:debtorId   - Histórico por devedor
GET    /api/settings                        - Obter configurações
PUT    /api/settings                        - Atualizar configurações
```

## 🧪 Testes

### Executar todos os testes

```bash
cd backend
npm test
```

### Executar testes específicos

```bash
# Teste de registro
npm test test_register.js

# Teste de login
npm test test_login.js
```

### Ferramentas de Diagnóstico

**Verificar integridade do banco:**
```bash
node check_db.js
```

**Inspecionar dados do banco:**
```bash
node tools/inspect_store.js
```

## 📝 Exemplos de Uso da API

### Registro de Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Usuário",
    "email": "novo@example.com",
    "password": "123456"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "password": "123456"
  }'
```

### Criar Transação (requer token)

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "type": "entrada",
    "category": "Salário",
    "amount": 5000,
    "description": "Salário mensal",
    "date": "2025-12-01"
  }'
```

### Listar Devedores (requer token)

```bash
curl -X GET http://localhost:3000/api/debtors \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🎨 Usando o Frontend

1. Inicie o servidor backend
2. Abra o navegador em **http://localhost:3000**
3. Você verá a página inicial
4. Clique em "Acessar Sistema"
5. Faça login ou registre-se
6. Navegue pelas funcionalidades:
   - **Dashboard**: Visão geral
   - **Transações**: Gerenciar entradas/saídas
   - **Devedores**: Controlar dívidas
   - **Investimentos**: Acompanhar aplicações
   - **Configurações**: Personalizar

## 🔒 Segurança

- ✅ Senhas com hash bcrypt (salt rounds: 10)
- ✅ Autenticação JWT com expiração de 1 hora
- ✅ Middleware de validação em rotas protegidas
- ✅ Validação de dados no backend
- ✅ Operações atômicas no banco JSON

## 📦 Banco de Dados

O sistema usa um banco de dados em JSON (`database/store.json`) com as seguintes tabelas:

- `users` - Usuários do sistema
- `transactions` - Transações financeiras
- `debtors` - Devedores
- `investments` - Investimentos
- `debtHistory` - Histórico de alterações de dívidas
- `settings` - Configurações por usuário

## 🐛 Solução de Problemas

### Porta 3000 já em uso

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Ou altere a porta no .env
PORT=3001
```

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Banco de dados corrompido

```bash
# Deletar e deixar recriar
rm database/store.json
node server.js
```

## 📄 Licença

MIT License - Sinta-se livre para usar este projeto!

## 👨‍💻 Desenvolvimento

Desenvolvido como sistema completo de controle financeiro pessoal.

---

**🎉 Pronto para usar! Basta seguir os passos de instalação e executar o projeto.**
