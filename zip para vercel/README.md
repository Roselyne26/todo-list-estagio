# Lista de tarefas — estágio

Aplicação web com cadastro, listagem, edição, exclusão e pesquisa. Campos: título, descrição, data prevista e status (Pendente ou Concluída).

## Tecnologias

Next.js, React, TypeScript, CSS e Lucide. A API usa o runtime Node.js da Vercel. O banco é PostgreSQL no Supabase, acessado pela API REST com fetch no servidor. Desenvolvimento com apoio amplo de IA (Codex).

## Executar

Requer Node.js 22.13 ou superior.

1. Execute `npm ci`.
2. Crie um projeto no Supabase e execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e preencha `SUPABASE_URL` e `SUPABASE_SECRET_KEY` com os valores do seu projeto.
4. Execute `npm run dev` e abra a URL local mostrada no terminal.

Use a chave secret (`sb_secret_...`), exclusivamente no servidor. Não use chave publishable/anon neste projeto. A chave service_role legada também é aceita, mas a chave secret atual é preferida. Nunca envie `.env.local` ao GitHub e nunca prefixe a chave com NEXT_PUBLIC_.

## Publicar na Vercel

1. Envie este projeto para seu repositório GitHub, mantendo package.json na raiz.
2. Na Vercel, importe o repositório e selecione Next.js.
3. Configure as variáveis SUPABASE_URL e SUPABASE_SECRET_KEY na Vercel para Production. Configure Preview apenas se quiser que previews usem esse banco.
4. Publique. Não precisa de configuração especial de build: npm run build produz o aplicativo Next.js.
5. Configure o nome do projeto/domínio disponível em .vercel.app.
6. Teste criar, editar, pesquisar, recarregar e excluir uma tarefa na publicação.

A interface abre sem credenciais; a API retorna indisponibilidade até configurar o banco. A compilação não precisa de acesso ao Supabase. A aplicação só está pronta para avaliação online depois de configurar o banco e testar a publicação.

## Organização

- app/page.tsx: interface, formulário e pesquisa.
- app/api/tasks/route.ts: métodos HTTP da API Next.js.
- lib/tasks-api.mjs: validação, sessão e respostas HTTP.
- lib/task-store.mjs: consultas ao Supabase com filtro de proprietário.
- lib/task-validation.mjs: regras compartilhadas pelo formulário e servidor.
- supabase/schema.sql: tabela e controle de acesso no PostgreSQL.
- tests/tasks.test.mjs: validações, API e contrato de consultas.

## Decisões e limites

Uma única tela reduz a complexidade. O título precisa ter texto e até 120 caracteres. A descrição é opcional. A data precisa existir no calendário; datas passadas são permitidas. O seletor de data é o componente nativo do navegador. A pesquisa ignora maiúsculas e acentos e procura título e descrição. Erros ao salvar preservam os campos. A exclusão pede confirmação.

Cada navegador recebe um identificador aleatório em cookie HttpOnly, SameSite=Lax e Secure em HTTPS. O servidor usa esse identificador em todas as consultas. As tarefas ficam no PostgreSQL. A tabela usa RLS e não permite acesso direto com chaves públicas: apenas a API, com a chave secret, acessa os registros.

Não há cadastro de contas nem sincronização entre dispositivos. Limpar cookies remove o acesso à lista anterior, embora os registros permaneçam no banco. A API é pública para demonstração do teste e não tem cotas nem política automática de limpeza. Use um projeto Supabase dedicado a esta demonstração.

A nova publicação começa com uma lista vazia. As tarefas da hospedagem anterior não são transferidas automaticamente.

## Verificar

```sh
npm test
npm run check
npm run build
```

Os testes usam um substituto do banco para verificar o fluxo HTTP e os filtros enviados ao Supabase. Eles não comprovam que um projeto Supabase remoto está configurado; a publicação precisa de um teste real após conectar o banco.

## Uso de IA

A IA gerou grande parte do código, ajudou na adaptação de hospedagem, documentação e verificações. Não apresentar o projeto como escrito sem assistência. Veja RELATO.md e GUIA-DE-ESTUDO.md.

Referências: https://nextjs.org/docs | https://supabase.com/docs/guides/getting-started/api-keys | https://vercel.com/docs/frameworks/full-stack/nextjs
