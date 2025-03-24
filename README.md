# 🐦‍🔥 GASTAIL BOT [acesse aqui](https://t.me/GasTail_bot) 

## 💡 [Visualizar Board](https://whimsical.com/gastail-bot-C5Pf2PrrrYgAQMaoXXVUEg)

[![image](https://github.com/user-attachments/assets/9683edc5-1768-4f74-8075-b2329cd2eb8a)](https://samuelvictorol.github.io/portfolio/portfolio)


# 🏯 Arquitetura
- <strong>Models</strong>: esboçam as entidades que serão persistidas no banco;
- <strong>Controllers</strong>: recebem e retornam as requisições além de redirecioná-las para interação com o Bot e Managers;
- <strong>Managers</strong>: processam as requisições e interagem com as Models e Classes (regras de negócios);
- <strong>Classes</strong>: declarações do objetos que serão instanciados para executar funções específicas mas não necessariamente serão persistidos na base;
- <strong>Enums</strong>: dicionários contendo strings que são utilizadas para retornar mensagens (erro, sucesso, menus etc) padronizadas de acordo com a necessidade;

# 📚 Requisitos do Projeto
## Bot [Telegram]
 - [ ] O Gastail deverá cadastrar o usuário;
 - [ ] O Gastail deverá permitir o usuário registrar suas compras de cripto;
 - [ ] O Gastail deverá permitir o usuário configurar alertas de preços das moedas;
 - [ ] O Gastail deverá gerar o token para acesso do perfil web do usuário;
 - [ ] O Gastail deverá mostrar o valor em Real das cripto moedas: BTC, ETH e USDT;

## Servidores [Frontend e Backend]
- [ ] O servidor deverá acessar o perfil do usuário a partir do token;
- [ ] O servidor deverá ter um gráfico mostrando dados da carteira do usuário;
- [ ] O servidor deverá permitir o usuário registrar a venda do bloco de ação;
- [ ] O servidor deverá sinalizar no bloco de ação se está lucrando ou perdendo;
- [ ] O servidor deverá permitir o usuário remover alertas cadastrados;
- [ ] O servidor deverá se integrar à base para persistir os dados que serão posteriormente recuperados;


# 🌍 Ambiente de Produção

## Backend - Render

> Linguagem: Javascript<br>
> Framework: Node + Express<br>
> O Backend do Projeto está em produção na url: https://gastaill-bot.onrender.com<br>

## Frontend - Netlify

> Linguagem: Javascript<br>
> Framework: Quasar + Vue3<br>
> O Frontend do Projeto está em produção na url: <br>

## Banco de Dados - Mongodb

> Linguagem: NoSql<br>
> Framework:  Mongo<br>
> Para acessar a base diretamente pode ser necessário autorização prévia<br>
> A base de dados do Projeto está em produção na url: [Gastail Database](https://cloud.mongodb.com/v2/67aa609b61c70d27b71fcc76#/metrics/replicaSet/67aa6181f84ff70f87a7315d/explorer/Projeto-1-db/acaos/find)<br>


# 🏗️ Ambiente de Desenvolvimento
## 🐋 Rodando o projeto com Docker
- [ ] Configure as variáveis de ambiente.
- [ ] Docker instalado e rodando na máquina.
- [ ] NGROK instalado e com arquivo ngrok.exe na raíz do projeto.
- [ ] rode o ngrok com o comando ngrok http 5000, copie a url forwarding e coloque na variavel de ambiente BOT_BACKEND_URL.
- [ ] docker build -t gastail-bot .
- [ ] docker run -p 5000:5000 gastail-bot

## 📍 Rodando o projeto local
- [ ] Configure as variáveis de ambiente.
- [ ] Docker instalado e rodando na máquina.
- [ ] NGROK instalado e com arquivo ngrok.exe na raíz do projeto.
- [ ] rode o ngrok com o comando ngrok http 5000, copie a url forwarding e coloque na variavel de ambiente BOT_BACKEND_URL.
- [ ] Node Versão 16++ utilize o comando npm install e em seguida npm run dev

## ⚙️ Variáveis de Ambiente
 > Crie um arquivo .env na raíz do projeto e preencha as configurações de ambiente:
<br>

 - TELEGRAM_BOT_TOKEN
 - BOT_BACKEND_URL
 - CONNECTION_STRING (mongodb)
 - PORT (5000 padrão)
<br>

> Por: [Samuel Victor](https://samuelvictorol.github.io/portfolio/)<br>

