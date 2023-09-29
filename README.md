Bem-vindo ao projeto CertPontoLuchVote! Este é um guia rápido sobre como executar as migrações do banco de dados para configurar o ambiente.

Pré-requisitos
Antes de prosseguir, certifique-se de que você tenha as seguintes ferramentas instaladas em seu sistema:

.NET SDK - O SDK do .NET é necessário para compilar e executar o projeto.
Node.js - Node.js é necessário para gerenciar pacotes JavaScript e para algumas ferramentas de desenvolvimento.
Executando Migrações
dotnet ef database update

Instalando o Node
npm install -g node

Isso aplicará todas as migrações pendentes e configurará o banco de dados de acordo com o estado atual do projeto.

Após a conclusão das migrações, você estará pronto para iniciar a aplicação.


**Atenção!**

Antes de iniciar a aplicação, é necessário tirar as validações do Front-End (React) dos componentes `NavMenu.js` e `Votacao.js`.

**NavMenu.js**

No componente `NavMenu.js`, a validação está sendo feita na propriedade `isResultadoEnabled`. Para remover essa validação, basta remover o atributo `disabled` do `NavLink`.

## NavMenu.js
 `<NavItem>
  <NavLink
    tag={Link}
    className={`text-dark ${!this.state.isResultadoEnabled && 'enabled'}`}
    to="/result"
  >
    Resultado
  </NavLink>
</NavItem>`

## Votacao.js

`<button className="btn btn-success" onClick={this.handleVoteSubmit}>
  Votar
</button>`

Explicação

As validações no Front-End estão sendo utilizadas para habilitar ou desabilitar os botões de acordo com o horário da votação. No entanto, para executar as interações com o banco de dados, é necessário que a aplicação esteja totalmente habilitada. Por isso, é necessário remover essas validações antes de iniciar a aplicação.

Após remover as validações, você estará pronto para iniciar e testar a aplicação.
