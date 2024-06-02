<h1 align="center">Angular REST</h1>
<h3 align="center">Projeto realizado para estudo e prática das habilidades em Spring REST API/Angular</h3>

<h3 align="left">Ferramentas utilizadas:</h3>

- IntelliJ IDEA 2024
- Payara 5
- Angular 17
- Payara Micro 6.2024.4
- PostgreSQL 
- Java 17
- Spring Boot Starter 3.2.3
- TIBCO Jaspersoft Studio-6.20.0

<h3 align="left">Resumo do Projeto:</h3>

- Este projeto é uma aplicação web robusta desenvolvida utilizando Java Spring Boot, que oferece uma API REST completa para gerenciar usuários e autenticação. Ele inclui um sistema de cadastro de usuário completo, suporte para envio de emails automatizados (como recuperação de senha), integração com Spring Security para autenticação e autorização, e comunicação com um frontend Angular para apresentar dados, relatórios PDF e gráficos interativos.

<h3 align="left">Caracteristícas Principais</h3>

- **Sistema de Cadastro de Usuário:** Permite o registro, atualização e exclusão de usuários através da API REST.
- **Autenticação e Autorização:** Utiliza Spring Security para garantir a segurança dos dados e das operações realizadas pelos usuários.
- **Envio de Emails Automatizado:** Implementa funcionalidade para enviar emails de recuperação de senha, melhorando a experiência do usuário.
- **Integração com Frontend Angular:** A API REST é consumida por um frontend Angular, que permite aos usuários visualizar relatórios PDF e gráficos baseados nos dados armazenados na API.
- **Geração de Relatórios PDF e Gráficos:** Oferece recursos para gerar relatórios PDF detalhados e exibir gráficos interativos, facilitando a análise de dados.

<h3 align="left">Configuração para acesso a Spring REST API:</h3>

- **Arquivo util/constants.ts:** Configurado o caminho para as URL's direcionadas, configurar de acordo com sua aplicação Spring REST API implantada.

<h3 align="left">Configurações para deploy no payara:</h3>

- **Geração dos arquivos -> Pasta raiz, comando:** `ng build -c production --base-href /angular-rest/`
- **Após o build, devemos deixar os arquivos preparados para gerar o .WAR:**
  1) Jogar todos os arquivos gerados no build direto na pasta /dist do projeto
  2) Criar uma pasta WEB/INF dentro do diretório /dist
  3) Criar os arquivos dentro da pasta WEB/INF (glassfish-web.xml, web.xml) para configuração do glassfish
  4) Apagar a pasta browser que ele gerou no build, deixando apenas tudo direto na /dist
- **Geração do WAR para deploy no payara:** Feito os passos acima, gere o war -> `jar -cvf angular-rest.war -C ..\dist\ .`

<h3 align="left">Projeto Spring REST API:</h3>
<h4><a href="https://github.com/PADOCAS/springboot_api_rest">Projeto Spring REST API Git Hub</a></h4>

<h3 align="left">Servidor para testes:</h3>
<h4><a href="https://www.ldsystems.com.br/angular-rest/login">Projeto Spring REST API/Angular</a></h4>

<h4><a href="https://ldsystems.com.br:50080/springbootapirest/swagger-ui/index.html">Swagger API Payara</a></h4>
