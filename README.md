# Server - Estacionamento Inteligente

Este é o backend (servidor) do projeto de estacionamento inteligente, parte integrante do sistema completo. Ele é responsável por lidar com as requisições, gerenciar a comunicação com o banco de dados e fornecer as funcionalidades necessárias para o funcionamento do estacionamento.

## Tecnologias Utilizadas

- Node.js: Plataforma de desenvolvimento utilizada para construir o servidor backend.
- Prisma: ORM (Object-Relational Mapping) que facilita a comunicação com o banco de dados.
- MongoDB: Banco de dados NoSQL utilizado para armazenar as informações do estacionamento.

## Funcionalidades

O servidor backend oferece as seguintes funcionalidades:

- Gerenciamento de reservas de vagas: Permite aos clientes realizar a reserva de vagas no estacionamento.
- Controle de entrada e saída de veículos: Registra as entradas e saídas de veículos no estacionamento.
- Verificação de disponibilidade de vagas: Informa aos clientes a quantidade de vagas disponíveis no estacionamento.
- Processamento de pagamentos: Permite aos clientes efetuarem o pagamento das suas estadias no estacionamento.
- Gerenciamento de dados dos clientes: Armazena e gerencia as informações dos clientes cadastrados.

## Configuração e Execução

Siga as instruções abaixo para configurar e executar o servidor:

- Clone este repositório para sua máquina local.
- Acesse a pasta do servidor (server).
- Instale as dependências necessárias executando o comando `npm install`.
- Configure as variáveis de ambiente no arquivo .env com as informações relevantes para sua aplicação.
- Execute o servidor utilizando o comando `npm run dev`.
- Certifique-se de ter o Node.js e o MongoDB devidamente instalados em seu ambiente de desenvolvimento.

**Esse código é apenas uma parte de um projeto maior e faz parte de um sistema mais complexo de controle de estacionamento. Para obter mais detalhes e contexto sobre o projeto, é recomendável verificar o repositório completo do código-fonte, que pode ser encontrado [aqui](https://github.com/JoaoZanardo/SPL).**