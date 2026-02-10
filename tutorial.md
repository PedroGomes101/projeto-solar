# Tutorial Rápdo

Planejar
Implementar
Entender o código
Testar


# Tarefa 1📘 Tutorial: Construindo um Front-end + API em Node.js (do zero)

## 🎯 Objetivo do projeto

Criar uma aplicação simples onde:

* O **Front-end (HTML)** possui um formulário com **nome e e-mail**
* O **Back-end (API Node.js)** gerencia usuários (CRUD)
* Tudo organizado seguindo uma **arquitetura clara e didática**

---

**Arquitetura**: 

## 🏗️ Arquitetura escolhida

### 👉 Arquitetura MVC (Model–View–Controller)

Mesmo sendo um projeto simples, vamos usar **MVC**, porque:

* Facilita o aprendizado
* Organiza responsabilidades
* É base para projetos profissionais

### 📦 Como fica o MVC aqui?

| Camada         | Responsabilidade                       |
| -------------- | -------------------------------------- |
| **View**       | HTML (index.html)                      |
| **Controller** | Regras da API (`userController.js`)    |
| **Model**      | Dados simulados (`data.js`)            |
| **Server**     | Configuração do servidor (`server.js`) |


Prompt 1: explique rapidamente a arquitetura escolhida (MVC) e mostre a estrutura de pastas do projeto. 

Estrutura final do projeto:

```
meu-projeto/
│
├── public/
│   └── index.html
│
├── controllers/
│   └── userController.js
│
├── data/
│   └── data.js
│
├── server.js
├── package.json
└── node_modules/
```

**Parte 1 – Front-end**: 

**Criar o front end**
Prompt 1(plan): Crie a pasta public e dentro da pasta public crie o arquivo `index.html`. 
Crie um formulário com **nome e email**

**Inicialize o repositorio git**
Prompt 2(plan):Inicialize o repositório git

**Conectar o formulário à API**
Prompt 3: crie o arquivo `script.js`. Capture o envio do formulário, use `fetch` com método POST para enviar `name` e `email` em JSON para a API e exiba uma mensagem de sucesso ou erro na tela. o servidor rodará na porta http://localhost:3000/api/users

**Conectar o formulário à API**
Prompt 4: No arquivo `index.html` e `script.js`. No script.js, liste os usuários da api, use `fetch` com método Get para listar `name` e `email` em JSON para a API e exiba a lista na tela no arquivo index.html. o servidor rodará na porta http://localhost:3000/api/users

dica: verificar futuramente qual a porta o servidor

**Parte 2 – Back-end (API Node.js)**: 

**Criar o servidor**
Prompt 1: Inicialize o package.json e instale as dependências `express` e `cors`. Configure o `package.json` com o script `"start": "node server.js"`. Configure ES Modules (ESM).Crie o arquivo .gitignore

**Arquivos do projeto**: 
Prompt 2: crie o arquivo `server.js` na raiz do projeto e crie a pasta src e dentro da pasta src crie os arquivos `controllers/userController.js` e `data/data.js`. Não crie o código dentro das pastas userController.js e data.js`

**Simular o banco de dados em memória**: 
Prompt 3: crie no arquivo `data.js` uma lista (array) de usuários (users) com os campos id, name e email. 

**server.js – configuração do servidor**: 
Prompt 3:crie o servidor express dentro do arquivo server.js. importe `express`, `cors`. Instancie o app. Defina `HOST` e `PORT`. Configure os middlewares `cors`, `express.json()` e `express.static('public')`. Crie a rota Get Hello Word! para teste.

dica: rode a aplicação no terminal: node server.js ou npm run start
para para a aplicação:: ctrl+c

**server.js – HTML**: 
Prompt 4 (opicional se não já criou): sirva o arquivo `index.html` usando `res.sendFile` e finalize iniciando o servidor com `app.listen`.

**server.js – rotas da API**: 

Prompt 5: crie a rota GET no arquivo server.js
GET `/api/users`.

Prompt 6: implemente a função `getAllUsers` no arquivo server.js dentro da arota GET `/api/users`

**userController.js**: 
Prompt 7: implemente  a função `getAllUsers` no arquivo userController.js No arquivo server.js, import a a função `getAllUsers userController.js` e ajuste a rota GET `/api/users` para chama-lá.

Mode: ask -> reveja a arquitetura com #backend-dev-guidelines 


# Não profissional:

**Crie as rotas da api**

Prompt :crie as rotas no arquivo server.js
GET `/api/users`,
GET `/api/users/:id`,
POST `/api/users`,
PUT `/api/users/:id`,
DELETE `/api/users/:id`,


**userController.js**: 
Prompt: implemente as funções `getAllUsers`, `getUserByID`, `createUser`, `updateUser` e `deleteUser`, com explicação simples do fluxo no arquivo userController.js

# Profissional


Parte 1: O dev recebe a issue:


# Issue:


Claro 🙂 Segue uma **issue bem estruturada** para **criação de registro de usuários em uma arquitetura MVC**, pronta para usar no GitHub / Jira / GitLab.

---

# Issue002: Criação de Registro de Usuários (Arquitetura MVC)

## Descrição:

Implementar a funcionalidade de **cadastro de usuários** seguindo o padrão **MVC (Model–View–Controller)**.
O objetivo é permitir que novos usuários se registrem no sistema de forma segura, validada e organizada, respeitando as responsabilidades de cada camada da arquitetura.

---

## Funcionalidades requeridas:

* Exibir formulário de cadastro de usuário (Front)
* Receber e validar dados do usuário
* Criar um novo usuário no banco de dados
* Garantir unicidade de e-mail/username
* Agora não precisa de Armazenar a senha de forma segura (hash)
* Retornar mensagens claras de sucesso ou erro

---

## Comportamento esperado:

* O usuário acessa a tela de cadastro
* Preenche os campos obrigatórios
* Ao submeter:

  * Dados válidos → usuário é criado com sucesso
  * Dados inválidos → mensagens de erro são exibidas
* Senhas **não devem** ser armazenadas em texto puro
* Usuários duplicados não devem ser criados

---

## Guia técnico:

**Model**

* Criar modelo `User`
* Campos mínimos:

  * `id`
  * `name`
  * `email`
  * `password`
  * `is_active`
  * `created_at`
  * `updated_at`
  
* Implementar regras de validação e 
* não precisa de hash de senha

**Controller**

* Criar `UserController`
* Método `create` → exibe formulário
* Método `store` → processa o cadastro
* Validar entrada de dados
* Tratar erros e respostas

**View**

* Criar tela de cadastro (`register`)
* Formulário com campos:

  * Nome
  * Email
  * Senha
  * Confirmação de senha
* Exibir mensagens de erro e sucesso

---

## Critérios de aceitação:

* [ ] Usuário consegue acessar a tela de cadastro
* [ ] Campos obrigatórios são validados
* [ ] E-mail duplicado não é permitido
* [ ] Não precisa que a Senha é armazenada com hash
* [ ] Usuário é salvo corretamente no banco
* [ ] Mensagens de erro são claras e objetivas
* [ ] Código segue padrão MVC
* [ ] Cobertura mínima de testes (se aplicável)

---


### **Fase 1: Planejamento** (Claude Sonnet 4.5/4.6)

Prompt 1: Nova janela de contexto Mode: Plan Sonnet 4.5

```text
Crie um plano de implementação para a issue02.
Aguarde revisão antes de escrever qualquer código.
```

Prompt 2: Mode: Agent Sonnet 4.5

```text
Dentro da pasta plan, escreva este plano na raiz do projeto com o título plan_issue002 em markdown.
```


### **Fase 2: Revisão do Plano - Opcional** (GPT-5.2/5.3 Codex) Mode: Agent


Prompt 1: Nova janela de contexto Mode: Agent

```text
Revise #plan_issue002.md de forma aprofundada.
Indique o que está sólido, possíveis riscos e oportunidades claras de melhoria.
Seja objetivo, crítico e não escreva código.
```

Prompt 2: Mode: Agent

```text
Por favor, aplique isso e o restante do seu feedback ao arquivo do plano @plan_issue002.md
Não escreva código.
```

### **Fase 3: Segunda Opinião - Opcional** (Claude Opus 4.6/Claude Sonnet 4.5/4.6) Mode: Agent

Prompt 1: Nova janela de contexto Mode: Agent

```text
Fiz alterações no plano #plan_issue002.md.
Você pode revisar as mudanças que fiz e fornecer feedback?
Validar arquitetura e decisões técnicas
```

Prompt 2: Mode: Agent

```text
Aplique todo o feedback diretamente no plano
#plan_issue0001.md.
Não escreva código.
```

### **Fase 4: Implementação - Build** (Composer / Codex / Sonnet 4.6/4.5) Mode: Agent

Escolha conforme a necessidade:

| Modelo          | Quando Usar         | Velocidade | Qualidade  |
| --------------- | ------------------- | ---------- | ---------- |
| **Composer**    | Prototipagem rápida | ⚡ < 90s   | ⭐⭐⭐     |
| **GPT-5 Codex** | Build de produção   | 🐢 Lento   | ⭐⭐⭐⭐⭐ |
| **Sonnet 4.6**  | Equilíbrio          | 🚀 Médio   | ⭐⭐⭐⭐   |

Prompt 1: Nova janela de contexto Mode: Agent

```text
Implemente o plano #plan_issue0001.md.
Vocẽ não deve utilizar comentários no arquivo.
```

