[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=20869603)
# :checkered_flag: CARONA UFC

O Carona UFC é um sistema web de caronas solidárias exclusivo para a comunidade acadêmica (alunos e servidores) da Universidade Federal do Ceará.

O projeto surge como uma resposta direta às dificuldades de transporte enfrentadas no campus de Quixadá. Com a constante indisponibilidade de um dos ônibus que atende a rota, muitos alunos ficam sem transporte, resultando em atrasos, faltas e gastos com alternativas como mototáxis. A plataforma visa conectar motoristas e passageiros da própria universidade, criando uma rede de transporte mais confiável, econômica e segura.

## :technologist: Membros da equipe

552303 - José Rian Mendes Lima - Engenharia de Software

## :bulb: Objetivo Geral
Desenvolver uma aplicação web fullstack (Node.js/Express e Vue.js) que gerencie um sistema de caronas para a comunidade da UFC, visando mitigar os problemas de locomoção enfrentados por alunos e servidores, ao mesmo tempo em que consolida os conhecimentos técnicos adquiridos na disciplina.

## :eyes: Público-Alvo
Alunos, servidores técnico-administrativos e professores da Universidade Federal do Ceará, com foco inicial na comunidade do campus de Quixadá.

## :star2: Impacto Esperado
Espera-se que a plataforma ajude a reduzir o número de atrasos e faltas de estudantes por problemas com transporte público. Além disso, busca-se proporcionar economia financeira para os usuários, aumentar a segurança nos deslocamentos e fortalecer o senso de comunidade e colaboração entre os membros do campus.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação

* **Visitante (usuário não logado):** Qualquer pessoa que acesse a aplicação sem se autenticar.

* **Passageiro:** Usuário cadastrado e autenticado que busca e solicita vagas em caronas. É o papel padrão de todo novo usuário.

* **Motorista:** Usuário que, além das permissões de passageiro, pode cadastrar veículos e oferecer caronas.

* **Administrador:** Gerencia a plataforma, validando usuários, moderando conteúdo e garantindo o bom funcionamento do sistema.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação

**Funcionalidades Públicas (acessíveis a Visitantes)**
* Visualizar a página inicial com a apresentação do projeto.

* Realizar cadastro na plataforma (com validação de e-mail institucional @ufc.br ou @alu.ufc.br).

* Realizar login.

**Funcionalidades Restritas (acessíveis a usuários autenticados)**

* **Passageiro e Motorista:**

    * Buscar caronas disponíveis utilizando filtros (origem, destino, data).

    * Visualizar e editar o próprio perfil.

    * Solicitar vaga em uma carona.

    * Gerenciar (visualizar/cancelar) suas solicitações.

* **Exclusivas do Motorista:**

    * Gerenciar seus veículos (CRUD - Cadastrar, Listar, Atualizar, Deletar).

    * Oferecer caronas (CRUD - Criar, Listar, Atualizar, Cancelar).

    * Gerenciar solicitações de passageiros (Aceitar/Recusar).

* **Exclusivas do Administrador:**

    * Gerenciar todos os usuários (ativar ou desativar contas).

    * Gerenciar status de todas as caronas ativas no sistema.

## :spiral_calendar: Entidades ou tabelas do sistema

* **User:** Armazena os dados de todos os usuários e seus respectivos papéis.

* **Vehicle:** Guarda as informações dos veículos cadastrados pelos motoristas (dependente de User).
  
* **Ride:** Representa a oferta de uma carona por um motorista, com data, trajeto, hora e vagas (dependente de User e Vehicle).

* **RideRequest:** Tabela de ligação que representa a solicitação de um Passageiro para uma Carona (dependente de User e Ride).

## 🚀 Instruções para Execução
Para rodar o projeto localmente, siga os passos abaixo:

### Backend
Clone o repositório:
```bash
git clone git@github.com:profBruno-UFC-Qx/classroom-web2-projeto-final-garbage-collector.git
```
Navegue para o diretório do backend:
```bash
cd classroom-web2-projeto-final-garbage-collector/backend 
```
Copie o arquivo de variáveis de ambiente:
```bash
cp .env-example .env
```
Entre no diretório `src`, instale as dependências e inicie o servidor:
```bash
cd src/
npm install
npm run dev
```

### Frontend
Abra um novo terminal e navegue para o diretório do frontend:
```bash
cd classroom-web2-projeto-final-garbage-collector/frontend/carona-ufc-frontend/src/
```
Instale as dependências e inicie o servidor:
```bash
npm install
npm run dev
```

O frontend estará disponível em: http://localhost:5173/

> **Nota:** Se você testou outros projetos na mesma porta, limpe o localStorage do navegador antes de testar este projeto para evitar conflitos de autenticação. Pressione F12 → Console → digite `localStorage.clear()` → Enter.

## 👥 Usuários de Teste

O sistema cria automaticamente usuários de exemplo via *database seeding* para facilitar os testes. O cadastro real exige confirmação de email via link e aceita apenas emails com domínio `@alu.ufc.br` ou `@ufc.br`.

### Credenciais disponíveis:

**Administrador:**
- Email: `admin@admin.com`
- Senha: `admin`

**Passageiro:**
- Email: `passageiro@gmail.com`
- Senha: `senha123`

**Motorista:**
- Email: `motorista@gmail.com`
- Senha: `senha123`
