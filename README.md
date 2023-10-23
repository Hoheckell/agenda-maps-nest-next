# agenda-dev
Agenda feita com nextjs no frontend e nestjs no backend com recursos de mostrar endereço dos contatos no google maps e aniversariantes do mês, pesquisa avançada e mais...

#Para rodar<br/>
Após clonar o repositório execute o comando <code>npm install</code> dentro da pasta do frontend e também do backend<br/>
crie a pasta uploads dentro do backend para armazenar as imagens dos contatos <br/>
configure os .env 
Então:<br/>
 No frontend execute npm run dev<br/>
 No backend execute npm run start:dev<br/>


<hr/>
<strong>Backend .env</strong> <br/>
Aplicação configurada para rodar na porta 3000 <br/>
DB_HOST= <br/>
DB_PORT= <br/>
DB_USERNAME=postgres<br/>
DB_PASSWORD= <br/>
DB_NAME=postgres<br/>
#nest mailer => https://github.com/nest-modules/mailer<br/>
MAIL_SMTP=<br/>
MAIL_FROM= <br/>
MAIL_NAME= <br/>
MAIL_PASSWORD= <br/>
MAIL_TRANSPORT=  <br/>
<hr/>
<strong>Frontend .env</strong><br/>
Aplicação configurada para rodar na porta 4000 <br/>
NEXT_PUBLIC_APP_BACKEND_URL= <br/>
NEXT_PUBLIC_GOOGLE_MAPS_KEY=  <br/>
