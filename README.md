# mandou-bem-api

# Módulo 1
## Criar conta

**RF**

- O usuário deve criar sua conta informando o nome da empresa, nome completo, e-mail e senha;

**RN**

- O usuário não pode cadastrar uma conta com o e-mail de um usuário já cadastrado;
- O usuário precisa confirmar a senha ao criar a conta;


## Manter usuários

**RF**

- O usuário admin deve poder criar, alterar, listar e excluir colaboradores;
- Para adicionar um colaborador é preciso informar o nome completo e e-mail do mesmo;
- Os colaboradores adicionados devem receber um e-mail com sua senha;

**RNF**

- Utilizar Ethereal para testar envios em ambiente de dev;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- As senhas enviadas por e-mail devem ser randômicas;
- O usuário admin não pode adicionar um colaborador com o e-mail de um usuário já cadastrado;


## Login

**RF**
- O usuário deve acessar o sistema usando seu e-mail e senha válidos;

**RNF**

- A autenticação deve acontecer usando JWT;

**RN**

- Caso o e-mail ou a senha sejam inválidos, informar um erro genérico para dificultar ataques;


## Manter perfil

**RF**

- O usuário deve poder atualizar seu nome, e-mail e senha;
- O usuário deve poder atualizar seu avatar fazendo o upload de uma imagem;

**RNF**

- O avatar deve ser armazenado usando o [Cloudinary](https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54); 

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar sua senha;


## Recuperar senha

**RF**

- O usuário deve recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Ethereal para testar envios em ambiente de dev;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- O link enviado por e-mail para resetar senhas deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;







# Módulo 2

## Manter catálogo de prêmios

**RF**

- O usuário admin deve poder criar, alterar, listar e excluir prêmios do catálogo;
- Para adicionar um prêmio é preciso informar o título, link da imagem e a quantidade de pontos;

**RN**

- Não pode ser possível adicionar um prêmio com o nome de um prêmio já cadastrado na empresa;
- Não pode ser possível adicionar um prêmio com pontos negativos

## Resgatar prêmio

**RF**

- O usuário deve poder resgatar um prêmio do catálogo de sua empresa;

**RN**

- O usuário só pode resgatar prêmios que tenha quantidade de pontos igual ou menor que a quantidade de pontos recebidos;
- A quantidade de pontos do prêmio deve ser subtraída do total de pontos recebidos pelo usuário;

## Entregar prêmio

**RF**

- O usuário admin deve listar os resgates de prêmio;
- O usuário admin deve poder marcar um resgate de prêmio como entregue;

**RN**

- Resgates de prêmios marcados como entregues não devem aparecer na listagem do admin;



# Módulo 3

## Criar postagem de reconhecimento

**RF**

- O usuário deve poder criar uma postagem de reconhecimento para um colega;
- Para criar a postagem o usuário precisa informar o colaborador, a quantidade de pontos e uma mensagem;
- (Pouco prioritário) O usuário deve ser capaz de enviar imagens e gifs na postagem;

**RNF**

- As postagens devem ser armazenadas no MongoDB;

**RN**

- O usuário não pode criar uma postagem de reconhecimento para ele mesmo;
- O usuário pode criar uma postagem de reconhecimento com uma quantidade de pontos igual ou menor ao seu total disponível;
- Os pontos enviados na postagem devem ser subtraídos dos pontos disponíveis para enviar do usuário que criou a postagem;
- Os pontos enviados na postagem devem ser adicionados nos pontos recebidos pelo usuário reconhecido na postagem;





















<!--
-________________-

# Recuperação de senha

**RF - Requisito Funcional**

- O usuário deve recuperar sua senha informando o seu e-mail/
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF - Requisito Não Funcional**

- Utilizar Mailtrap para testar envios em ambiente de dev;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN - Regra de Negócio**

- O link enviado por e-mail para resetar senhas deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar sua senha;

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser armazenadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve pode listar os dias de um mês com pelo menos um horário disponóvel de um prestador;
- O usuário deve poder listar horários disponíveis em um dia especifíco do prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;


**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos deve estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;

-->

