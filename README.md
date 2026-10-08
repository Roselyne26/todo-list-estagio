# Lista de tarefas

Aplicação web desenvolvida para um teste de estágio, com gerenciamento de tarefas e acompanhamento de conclusões.

**Aplicação online:** [Acessar a lista de tarefas](https://todo-list-estagio-puce.vercel.app/)

## Funcionalidades

- Adicionar, listar, editar e excluir tarefas.
- Pesquisar pelo título ou pela descrição, ignorando maiúsculas e acentos.
- Separar tarefas nas abas **A fazer** e **Concluídas**, com contadores.
- Marcar uma tarefa como concluída.
- Consultar a data e a hora da conclusão e o tempo decorrido desde a criação.

Cada tarefa contém título, descrição opcional, data prevista e status. Novas tarefas começam pendentes e são concluídas pelo botão **Concluir tarefa**.

O título é obrigatório e deve ter até 120 caracteres. A data prevista precisa ser válida. Editar uma tarefa concluída preserva seu status e a data de conclusão.

## Tecnologias

- **Interface:** Next.js, React, TypeScript, CSS e Lucide.
- **API:** rotas do Next.js executadas em Node.js.
- **Banco de dados:** PostgreSQL no Supabase.
- **Hospedagem:** Vercel.

## Executar localmente

Requisito: Node.js 22.13 ou superior.

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Crie um projeto no Supabase e execute o arquivo `supabase/schema.sql` no SQL Editor.

3. Copie `.env.example` para `.env.local` e preencha as variáveis com os valores do seu projeto:

   ```env
   SUPABASE_URL=https://SEU-PROJETO.supabase.co
   SUPABASE_SECRET_KEY=SUA_CHAVE_SECRET
   ```

   Use uma chave secret do Supabase, exclusivamente no servidor. Não envie `.env.local` ao GitHub nem use o prefixo `NEXT_PUBLIC_` na chave secreta.

4. Inicie a aplicação:

   ```bash
   npm run dev
   ```

5. Abra o endereço local informado no terminal.

## Estrutura do projeto

- `app/page.tsx`: interface, formulário, pesquisa e acompanhamento das tarefas.
- `app/globals.css`: estilos e adaptação para diferentes tamanhos de tela.
- `app/api/tasks/route.ts`: rotas HTTP da API.
- `lib/tasks-api.mjs`: validação das requisições, identificação da lista e respostas HTTP.
- `lib/task-store.mjs`: consultas ao Supabase.
- `lib/task-validation.mjs`: validações compartilhadas entre formulário e servidor.
- `supabase/schema.sql`: estrutura e configuração do banco.
- `supabase/completion.sql`: atualização para bancos existentes que ainda não registram a conclusão.
- `tests/`: testes automatizados.

## Decisões técnicas

A interface reúne o formulário e a lista em uma única página. As abas organizam as tarefas por status, e a pesquisa considera o título e a descrição da aba selecionada.

O seletor de data utiliza o componente nativo do navegador. Datas passadas são permitidas, desde que sejam válidas. Erros ao salvar preservam os campos preenchidos, e a exclusão exige confirmação.

Cada navegador recebe um identificador aleatório em cookie. A API utiliza esse identificador para consultar apenas as tarefas daquela lista. Os dados ficam armazenados no PostgreSQL.

O acesso ao banco ocorre pelo servidor. A tabela utiliza Row Level Security (RLS) e não permite acesso direto com chaves públicas.

## Conclusão e tempo decorrido

Ao concluir uma tarefa, o banco registra automaticamente a data e a hora. A interface apresenta esse registro no fuso horário do navegador.

O tempo exibido corresponde ao intervalo corrido entre a criação e a conclusão, incluindo noites e fins de semana. Ele não representa as horas efetivamente trabalhadas.

Tarefas concluídas antes da inclusão desse recurso não possuem uma data de conclusão registrada e, por isso, não apresentam uma duração calculada.

## Limitações

A aplicação não possui cadastro de usuários nem sincronização entre dispositivos. Cada navegador mantém sua própria lista.

Limpar os cookies faz o navegador perder o acesso à lista anterior, embora os registros permaneçam no banco.

A aplicação foi desenvolvida como demonstração para o teste e não possui limitação de requisições nem limpeza automática de registros.

## Verificações

Execute os comandos abaixo para verificar testes, tipos e compilação:

```bash
npm test
npm run check
npm run build
```

Os testes automatizados verificam validações, operações da API, identificação da lista, conclusão de tarefas e tratamento de falhas.

Os testes de acesso ao banco utilizam respostas simuladas. Para verificar a integração real, é necessário configurar o Supabase e testar as operações na aplicação.

## Publicação na Vercel

1. Importe o repositório na Vercel.
2. Selecione o framework **Next.js**.
3. Configure o diretório raiz para a pasta que contém `package.json`.
4. Adicione as variáveis `SUPABASE_URL` e `SUPABASE_SECRET_KEY` no ambiente de produção.
5. Execute o deploy.
6. Abra o domínio de produção e teste as funcionalidades.

Se alterar as variáveis de ambiente após a publicação, faça um novo deploy para aplicar os novos valores.

## Uso de inteligência artificial

O projeto foi desenvolvido com apoio amplo do ChatGPT/Codex na organização, geração do código, documentação, testes e correção de problemas.

Minha participação incluiu a definição do comportamento da aplicação, revisão da interface e configuração da publicação. Minha experiência prática com programação ainda está em desenvolvimento, e o projeto também fez parte desse processo de aprendizado.

## Referências

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação de chaves do Supabase](https://supabase.com/docs/guides/getting-started/api-keys)
- [Documentação de Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
