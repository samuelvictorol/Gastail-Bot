# Usar uma imagem base com Node.js
FROM node:16

# Criar o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar todos os arquivos do projeto para dentro do contêiner
COPY . .

# Instalar as dependências do projeto
RUN npm install

# Expor a porta 5000, que é onde o Express irá rodar
EXPOSE 5000

# Rodar o servidor Express
CMD npm start
