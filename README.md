# FCamara-squad3
Projeto de uma aplicação para agendamento de ida ao escritório para o Progrma de Formação season 2.
Autores do projeto: Luiz Gabriel Nunes, Leonardo Falcão e Kaio Henrique.

Nós usamos o framework Ionic para realizar o projeto e utilizamos Angular. Para a utilização do projeto para testes são necessários alguns passos:

# Step 1: Instalação do Node.js
É necessário ter o Node.js instalado para utilizar o projeto.
Disponivel em: https://nodejs.org/en/

# Step 2: Instalação do Ionic
É necessário ter o Ionic instalado na máquina.
Basta abrir o terminar da máquina e digitar o seguinte comando: 'npm install -g @ionic/cli' (sem aspas)

# Step 3: Clonagem do projeto na maquina e abrir no servidor
Depois de tudo instalado basta clonar o reposositório na maquina, abrir o terminal e digitar o seguinte comando: 'ionic serve' (sem aspas)
Assim ira abrir o browser com o projeto implementado

#

Para a questão de Back-End o nosso squad optou por usar a plataforma Firebase, pois o nosso squad era composto apenas por 3 Devs e nenhum UX, e os Devs não possuiam conhecimento suficiente de Back-End para realiza-lo de outra forma.
Usamos o Firebase para fazer a autenticação do Usuario, guardar dados do mesmo, além de guardar informações dos agendamentos, dias, unidades etc.
Porém o Firebase não possui a funcionalidade de deixar a visibilidade Pública, por isso criamos um E-Mail para o Squad e damos permissão de Leitor a esse E-Mail e iremos disponibilizar para que vocês consigam visualizar o que fizemos no projeto.

# Step 1: Login no E-Mail
Para abrir o Firebase é necessário que você esteja logado no E-Mail abaixo:
E-Mail: fcamarasquad3@gmail.com
Senha: fcamarasquad32021@

# Step 2: Abrir o Firebase e ver a Autenticação
Ao brir o firebase no menu lateral esquerdo existe a aba 'Authentication' é nessa aba que fica armazenado o E-Mail e ID unico de cada usuario que se cadastrou no sistema.

# Step 3: Aba Firestore Database
No menu lateral esquerdo existe a aba 'Firestore Database'. É nessa aba que ficam armazenados os dados que o Front-End pega, como outros dados do Usuário como nome, cpf etc, os dias que foram agendados, os dados das unidades etc. 

# 

Optamos de fazer desta forma devido a falta de experiência dos devs sobre outras tecnologias de Back-End.
Pensamos em questão de escalabilidade que usando o Firebase caso fosse necessário alterar por exemplo a porcentagem de capacidade permitida de cada unidade, basta alterar o campo no Firebase sem ter que alterar código.
Pensamos também que a aplicação não tivesse uma tela de cadastro para o usuario, que o cadastro fosse feito por fora, atraves de um link que a FCamara enviasse por E-Mail para o funcionário se cadastrar e depois na aplicação em si o funcionário só precisasse fazer login, mas para que o fluxo ficasse melhor para o desenvolvimento e para testes colocamos uma tela de cadastro.
