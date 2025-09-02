FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Instalar Node.js 18.x e ferramentas essenciais
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y nodejs git

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@16

# Configurar usuário vscode
USER vscode
WORKDIR /workspace

# Copia os arquivos de dependência ANTES do resto do código para aproveitar o cache do Docker.
COPY --chown=vscode:vscode package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY --chown=vscode:vscode . .