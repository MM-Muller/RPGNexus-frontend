
<p align="center">
  <img src="src/assets/images/logo.png" alt="RPGNexus Logo" width="150"/>
</p>

<h1 align="center">RPGNexus Interface</h1>

<p align="center">
  <strong>Interface de usuário para o jogo de RPG textual com IA "RPGNexus".</strong><br>
  Parte do Projeto 2 do Programa Trainee em Inteligência Artificial (Wise Intelligence).
</p>

---

## 🚀 Sobre o Projeto

Este repositório contém o front-end do projeto RPGNexus, uma aplicação web rica e interativa construída com Angular. A interface foi projetada para proporcionar uma experiência de jogo imersiva, permitindo que os jogadores criem personagens, embarquem em aventuras e interajam com um mundo dinâmico gerado por IA.

## 🛠️ Tecnologias Principais

- **Framework:** Angular 16
- **Linguagem:** TypeScript
- **Estilização:** SCSS
- **Autenticação:** Interceptores HTTP para JWT
- **Containerização:** Docker e VS Code Dev Container

## ✨ Funcionalidades

- **Interface Reativa:** Componentes dinâmicos que se atualizam em tempo real com base nas respostas da API.
- **Telas de Autenticação:** Páginas dedicadas para Login e Cadastro de usuários.
- **Gerenciamento de Personagens:**
    - Visualização em grade dos personagens criados.
    - Formulário completo para criação de novos personagens com personalização de atributos.
    - Modal para visualização de detalhes e exclusão de personagens.
- **Tela de Jogo (Campanha):**
    - Exibição da narrativa, status do personagem e opções de ação.
    - Input para que o jogador envie suas ações para a API.
- **Rotas Protegidas:** Utilização de `AuthGuard` para proteger as rotas do jogo, garantindo que apenas usuários autenticados possam acessá-las.

---

## 🏁 Começando

Estas instruções permitirão que você tenha uma cópia do projeto em operação na sua máquina local para desenvolvimento e testes.

### Pré-requisitos

- Docker e Docker Compose
- Visual Studio Code com a extensão [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### 🐳 Executando com Dev Container (Recomendado)

O projeto é configurado para ser executado de forma simples e rápida com o Dev Container.

1.  Clone o repositório:
    ```bash
    git clone https://github.com/MM-Muller/RPGNexus-frontend
    cd rpgnexus-frontend
    ```
2.  Abra o projeto no VS Code.
3.  Clique em **"Reopen in Container"** quando o VS Code sugerir.
4.  Aguarde a construção do container. As dependências (npm install) serão instaladas e o servidor de desenvolvimento (`ng serve`) será iniciado automaticamente.

A aplicação estará disponível em `http://localhost:4200`.

---

## 🗂️ Estrutura de Pastas

O front-end segue a estrutura padrão de projetos Angular, com uma organização modular para cada funcionalidade principal.
```
/
├── src/
│   ├── app/
│   │   ├── core/             # Serviços globais, guardas (guards) e interceptores
│   │   ├── features/         # Módulos de funcionalidades da aplicação (auth, game, home, etc.)
│   │   │   ├── auth/         # Componentes de login e cadastro
│   │   │   └── game/         # Componentes do jogo (personagens, campanha, etc.)
│   │   ├── layouts/          # Componentes de layout (ex: GameLayout, MainLayout)
│   │   ├── models/           # Interfaces e modelos de dados (Character, User, etc.)
│   │   ├── shared/           # Componentes, diretivas e pipes compartilhados
│   │   └── styles/           # Arquivos de estilo globais (variáveis, mixins)
│   ├── assets/               # Imagens, ícones e outros recursos estáticos
│   └── environments/         # Configurações de ambiente (desenvolvimento/produção)
├── .devcontainer/            # Configurações do Dev Container
└── angular.json              # Configuração do projeto Angular e seus builds
```
