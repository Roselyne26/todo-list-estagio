# Publicar a versão Vercel + Supabase

Use apenas os arquivos de todo-list-vercel.zip. Esta é a versão Next.js padrão, com PostgreSQL no Supabase. O ZIP anterior pertence à hospedagem antiga.

## 1. Supabase: organização Roselyne e projeto

1. Entre em https://supabase.com/dashboard.
2. Na lista de organizações, escolha Roselyne. O projeto todo-list-estagio já foi criado no plano gratuito.
3. Abra o projeto todo-list-estagio, criado na região de São Paulo. O custo informado foi US$ 0 por mês. A tabela já foi criada; não é necessário executar o SQL novamente.
4. A tabela tasks, o índice e o controle de acesso já estão configurados. Não execute o SQL novamente.
5. Localize a URL do projeto no diálogo Connect ou nas configurações. Ela será o valor de SUPABASE_URL.
6. Em Settings > API Keys, use uma chave secret existente (sb_secret_...). Ela será o valor de SUPABASE_SECRET_KEY. Não copie a chave publishable. Não envie a chave ao GitHub nem ao chat.

O projeto está em https://supabase.com/dashboard/project/hizvzuvsarzagekoekcd. A URL da API é https://hizvzuvsarzagekoekcd.supabase.co.

## 2. GitHub

1. Extraia todo-list-vercel.zip.
2. Entre na conta Roselyne26 e abra https://github.com/new.
3. Crie um repositório público chamado todo-list-estagio. Se já existir, abra esse repositório. Evite criar README automático no repositório vazio.
4. Clique em uploading an existing file, ou Add file > Upload files se já houver arquivos.
5. Arraste o conteúdo extraído: pastas app, lib, public, supabase e tests, além dos arquivos da raiz. package.json precisa ficar na raiz do repositório. O pacote tem menos de 100 arquivos e pode ser enviado em um lote.
6. Confirme o commit com uma mensagem como “Implementa lista de tarefas com Next.js e Supabase”. Confira se README e pastas aparecem na página.
7. Nunca envie node_modules, .next, .env.local ou credenciais. .env.example contém apenas exemplos e pode ser enviado.

## 3. Vercel

1. Entre em https://vercel.com/dashboard no seu espaço autorizado.
2. Escolha Add New > Project e importe o repositório todo-list-estagio da sua conta GitHub.
3. Confirme Framework Preset: Next.js. O arquivo package.json deve estar na raiz selecionada.
4. Nas Environment Variables, adicione:
   - SUPABASE_URL: URL do projeto Supabase.
   - SUPABASE_SECRET_KEY: chave secret do mesmo projeto. Marque como sensível quando disponível.
5. Configure para Production; Preview é opcional e usará o mesmo banco se você habilitar nesse ambiente.
6. Clique em Deploy e espere a compilação terminar.
7. Se adicionar ou corrigir variáveis depois de publicar, faça um novo deploy para a aplicação receber os novos valores.
8. Em Settings > Domains, confira o endereço .vercel.app atribuído e escolha outro nome disponível se desejar. Só copie o link real confirmado no painel.

## 4. Conferir e entregar

1. Abra o site da Vercel. Cadastre uma tarefa com título, descrição e data.
2. Edite o título e altere o status para Concluída.
3. Pesquise pelo título e por uma palavra da descrição.
4. Recarregue e confirme que a tarefa permanece.
5. Exclua a tarefa e confirme a exclusão.
6. Teste outro navegador: ele deve começar com uma lista separada.
7. Revise RELATO.md. Só informe que publicou após confirmar os passos acima.
8. Envie à empresa o link do GitHub, o link da Vercel e o relato revisado.

## Situação da versão local

Compilação Next.js e verificação de tipos aprovadas. Seis testes automatizados de validação, sessão, contrato de consultas e tratamento de falhas aprovados. O Supabase remoto já está configurado, com permissões verificadas. Ainda falta configurar as variáveis na Vercel, publicar e testar a aplicação online. Os dados da hospedagem antiga não são transferidos automaticamente.

Referências oficiais:
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/environment-variables
- https://supabase.com/docs/guides/getting-started/api-keys


