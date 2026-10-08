# StockFlow

Sistema web para **gestão de estoque, produtos, categorias e vendas**, desenvolvido como projeto da **Tech Academy 3**.

## 📦 Funcionalidades

### Categorias

- Cadastro, edição e exclusão
- Listagem de categorias
- Descrição das categorias
- Validação de dados
- Mensagens de sucesso e erro

### Produtos

- Cadastro, edição e exclusão
- Associação com categorias
- Controle de preço e estoque
- Definição de estoque mínimo
- Busca por nome
- Filtro por categoria
- Identificação de estoque crítico
- Validação de dados

### Vendas

- Cadastro, edição e exclusão
- Seleção de produtos
- Controle de estoque disponível
- Validação de quantidade
- Cálculo do valor total
- Busca por produto ou categoria
- Paginação
- Controle de registros por página

## 📊 Dashboard

A dashboard apresenta:

- Total de vendas
- Faturamento total
- Total de produtos
- Produto mais vendido
- Quantidade vendida
- Ranking de produtos
- Faturamento por produto
- Produtos com estoque crítico

O processamento dos dados utiliza:

- `reduce()`
- `filter()`
- `map()`

## 🗃️ Banco de Dados

O sistema utiliza **MySQL** com as tabelas:

- `categoria`
- `produto`
- `venda`

Recursos utilizados:

- **View:** `vw_vendas`
- **CTE:** utilizada no ranking de produtos
- **Stored Procedures:**
  - `sp_dashboard`
  - `sp_dashboard_vendas`
  - `sp_listar_vendas`
  - `sp_produtos_estoque_critico`
  - `sp_ranking_produtos`
- **Function:** `fn_calcular_total`
- **Trigger:** `trg_produto_estoque_positivo`
- Chaves primárias e estrangeiras
- Relacionamentos entre categorias, produtos e vendas

## 🔌 API

A comunicação entre frontend e banco de dados é realizada através de uma **API PHP**.

A API possui operações para:

- Categorias
- Produtos
- Vendas
- Dashboard
- Estoque crítico

Os dados são enviados e recebidos em formato **JSON**.

## 💻 Frontend

O frontend utiliza **TypeScript** para:

- Consumo da API com `fetch()`
- Programação assíncrona com `async/await`
- Tratamento de erros com `try/catch`
- Tipagem através de interfaces
- Manipulação dinâmica do DOM
- Validação dos dados
- Busca e filtros
- Paginação
- Formatação monetária

A interface utiliza **Bootstrap** para:

- Tabelas
- Formulários
- Botões
- Modais
- Alertas
- Badges
- Layout e componentes visuais

## 🛡️ Validações

O sistema possui validações para:

- Campos obrigatórios
- Valores inválidos
- Estoque insuficiente
- Produtos inexistentes
- Dados vazios
- Erros da API
- Exclusão de registros
- Estoque crítico

Um produto é considerado em estoque crítico quando:

estoque <= estoque_minimo


## 🧩 Tecnologias

- PHP
- MySQL / MariaDB
- TypeScript
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Apache
- XAMPP

## 🎯 Objetivo

O StockFlow demonstra a integração entre **banco de dados, backend, API e frontend**, oferecendo um sistema completo de:

- CRUD de categorias
- CRUD de produtos
- CRUD de vendas
- Controle de estoque
- Gerenciamento de vendas
- Dashboard de indicadores
- Ranking de produtos
- Cálculo de faturamento
- Identificação de estoque crítico

## 📋 Checklist da Tech Academy 3

### 🗃️ Banco de Dados

- [x] MySQL / MariaDB
- [x] Tabelas relacionais
- [x] Chaves primárias
- [x] Chaves estrangeiras
- [x] Índices
- [x] CTE
- [x] View
- [x] Stored Procedures
- [x] Function
- [x] Trigger `BEFORE UPDATE`
- [x] `JOIN`
- [x] `GROUP BY`
- [x] `SUM()`
- [x] `COUNT()`

### 🌐 Desenvolvimento Web

- [x] CRUD de categorias
- [x] CRUD de produtos
- [x] CRUD de vendas
- [x] API PHP
- [x] JSON
- [x] Bootstrap
- [x] Separação entre frontend e backend
- [x] Validações
- [x] Mensagens de erro e sucesso
- [x] Busca
- [x] Filtros
- [x] Paginação

### 📘 TypeScript

- [x] Interfaces
- [x] Tipagem
- [x] `reduce()`
- [x] `filter()`
- [x] `map()`
- [x] `fetch()`
- [x] `async/await`
- [x] `try/catch`
- [x] Manipulação do DOM
- [x] Tratamento de dados vazios
- [x] Tratamento de valores inválidos

### 📊 Dashboard

- [x] Total de vendas
- [x] Faturamento
- [x] Total de produtos
- [x] Produto mais vendido
- [x] Ranking de produtos
- [x] Faturamento por produto
- [x] Estoque crítico