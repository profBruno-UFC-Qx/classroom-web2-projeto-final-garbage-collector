[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=20869603)
# :checkered_flag: NOME DO PROJETO

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
* Visualizar a página inicial com a apresentação do projeto e estatísticas gerais.

* Realizar cadastro na plataforma (com validação de e-mail institucional @ufc.br ou @alu.ufc.br).

* Realizar login.

**Funcionalidades Restritas (acessíveis a usuários autenticados)**

* **Comuns a todos (Passageiro, Motorista, Admin):**

    * Buscar caronas disponíveis utilizando filtros (origem, destino, data).

    * Visualizar e editar o próprio perfil.

    * Visualizar o perfil público de outros usuários.

* **Exclusivas do Passageiro:**

    * Solicitar vaga em uma carona.

    * Gerenciar (visualizar/cancelar) suas solicitações.

    * Avaliar motoristas após a conclusão da carona.

* **Exclusivas do Motorista:**

    * Gerenciar seus veículos (CRUD - Cadastrar, Listar, Atualizar, Deletar).

    * Oferecer caronas (CRUD - Criar, Listar, Atualizar, Cancelar).

    * Gerenciar solicitações de passageiros (Aceitar/Recusar).

* **Exclusivas do Administrador:**

    * Dashboard com estatísticas gerais da aplicação.

    * Gerenciar todos os usuários (promover para motorista, banir).

    * Visualizar todas as caronas ativas no sistema.

## :spiral_calendar: Entidades ou tabelas do sistema

* **Usuario:** Armazena os dados de todos os usuários e seus respectivos papéis.

* **Veiculo:** Guarda as informações dos veículos cadastrados pelos motoristas (dependente de Usuario).

* **Trajeto:** Registra rotas frequentes salvas pelos usuários (ex: Casa -> Campus).

* **Carona:** Representa a oferta de uma carona por um motorista, com data, hora e vagas (dependente de Usuario, Veiculo e Trajeto).

* **Reserva:** Tabela de ligação que representa a solicitação de um Passageiro para uma Carona.

