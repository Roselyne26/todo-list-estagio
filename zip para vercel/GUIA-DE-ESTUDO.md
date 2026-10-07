# Guia para estudar o projeto

Leia app/page.tsx, lib/tasks-api.mjs, lib/task-store.mjs e supabase/schema.sql nessa ordem.

## O caminho dos dados

1. O formulário mantém os valores com useState.
2. O botão de adicionar chama save, valida os campos e envia JSON para /api/tasks com fetch.
3. A rota Next.js chama o tratamento da API em lib/tasks-api.mjs.
4. O servidor valida novamente, identifica a lista pelo cookie e pede ao Supabase para gravar no PostgreSQL.
5. O banco retorna a tarefa, a API devolve JSON e o React atualiza a lista.

A tela apresenta informações, a API processa as operações e o banco guarda os dados.

## Cinco operações

GET lista as tarefas. POST cria. PUT atualiza uma tarefa existente. DELETE remove após confirmação na tela. A pesquisa usa filter na lista já carregada, comparando título e descrição sem distinguir acentos e maiúsculas.

## Conceitos

useState armazena valores que mudam. useEffect carrega a lista quando a tela abre. useRef acessa o campo para dar foco e o diálogo para confirmar a exclusão. async/await aguarda as respostas. try/catch/finally trata falhas e encerra o carregamento.

A API da aplicação usa PUT para edição; o módulo do banco traduz essa operação para PATCH na API REST do Supabase. Os dados são enviados em JSON, não concatenados em comandos SQL.

## Por que validar no servidor?

A validação na tela dá retorno rápido. A do servidor também protege chamadas feitas fora do formulário. A data é convertida e comparada com o texto original para recusar datas que não existem, como 31 de abril. O banco tem restrições adicionais.

## Como a lista fica separada?

Um cookie guarda um UUID aleatório. As consultas ao banco sempre filtram pelo proprietário da lista. Esse identificador não é uma conta de usuário: outro navegador tem outra lista. Limpar o cookie remove o acesso aos registros anteriores.

A chave secret do Supabase fica nas variáveis de ambiente do servidor. O navegador não recebe essa chave. O PostgreSQL bloqueia acesso direto usando as chaves públicas. O servidor, com acesso privilegiado, é responsável por aplicar o filtro do proprietário.

## Exercício

Depois de publicar, crie uma tarefa com descrição, edite o título, altere o status, pesquise por uma palavra da descrição, recarregue e exclua. Tente cadastrar espaços no título. Abra outro navegador e observe a lista separada.

## Explicar o uso de IA

“Usei IA de forma ampla para implementar o projeto. Minha experiência atual é desenvolver com esse apoio. Estou estudando o código para entender as decisões e ganhar autonomia.”

Só afirme que compreende alguma parte depois de conseguir demonstrar com suas palavras.
