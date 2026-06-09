*Comandos prisma*

npx prisma generate -> gera o client tipado com base no arquivo schema do prisma
npx prisma migrate dev -> roda migrations olhando pro meu schema vendo o que ainda nao tem no banco pra ele criar
npx prisma migrate deploy -> roda toda as migrations de maneira definitiva
npx prisma studio -> abre o "site" pra voce ver o seu banco por uma GUI

SOLID 

D -> Dependency Invension Principle || Usa como principio deixar o elemento o mais agnostico possivel, de um modo que seria possivel ate trocar a lib que o utiliza, ele recebe tudo que precisa em vez de chamar dentro dele, ou seja, desde que passe corretamente ele funciona, nao depende dele necessariamente. O fluxo de dependência do código deve apontar para as regras de negócio, nunca para frameworks ou bibliotecas
I
L
O
S



DESIGN PATTERNS/Conceitos

- SUT -> criar um nome generico que é o ponto central do teste para reaproveita-lo em todos e não precisar mudar o nome
- In-Memory Database -> criar um "mini db" pelo JS mesmo para que o nosso teste não fique refem de BANCO X ou Y, se necessario criamos os cenarios necessarios unitariamente nos testes
- Repository Pattern -> isola a camada de acesso ao banco de dados da camada de negócio 
- Factory Pattern -> Quando tiver algum tipo de codigo da aplicacao que vai ser usado em varios lugares e possui varias depencias da pra separar ele em uma fabrica, basicamente ao invés de usar "new" diretamente, você delega a criação para uma fábrica.









TDD - Test Driven Development

Se voce criar os testes de uma funcionalidade ou regra de negocio antes da implementacao dela em si o seu teste ajuda a validar se  aquela implementacao esta correta.

Red, green and Refactor:

O conceito "red, green and refactor" é uma abordagem do TDD (Test-Driven Development) para desenvolvimento de software. Consiste em três etapas:

Red (Vermelho): nesta fase, o desenvolvedor escreve um teste que deve falhar, ou seja, ele garante que o teste não passará sem implementar o código necessário.
Green (Verde): aqui, o desenvolvedor escreve a quantidade mínima de código necessária para fazer o teste passar.
Refactor (Refatorar): após o teste passar, o desenvolvedor refatora o código para melhorar a qualidade, sem alterar seu comportamento.
Essa abordagem garante que o código seja desenvolvido com base em testes confiáveis, resultando em um código mais limpo, seguro e fácil de manter.