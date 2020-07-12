# mandou-bem-api

# Recuperação de senha

**RF**

- O usuário deve recuperar sua senha informando o seu e-mail/
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envios em ambiente de dev;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- O link enviado por e-mail para resetar senhas deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;


# Criar conta

**RF**

- O usuário deve criar sua conta informando o nome da empresa, nome completo, e-mail e senha;

**RN**

- O usuário não pode cadastrar uma conta com o e-mail de um usuário já cadastrado;
- O usuário precisa confirmar a senha ao criar a conta;






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

