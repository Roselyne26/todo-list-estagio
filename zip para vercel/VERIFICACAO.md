# Verificação da versão para Vercel

- 6 testes automatizados passaram: validações, operações da API, cookies de sessão, retorno de tarefa inexistente, filtros de proprietário e tratamento de falhas.
- Verificação de tipos TypeScript passou.
- Compilação Next.js 16.3.4 em modo de produção passou, gerando a página / e a rota dinâmica /api/tasks.
- O banco remoto ainda depende da criação/configuração do projeto Supabase e das variáveis na Vercel.
- Não foi confirmado um deploy público na Vercel nesta etapa.

Os testes de contrato usam respostas controladas no lugar da API remota do Supabase. Depois de conectar o banco real, execute o roteiro de testes da publicação.

Atualização: projeto todo-list-estagio criado na organização Roselyne, em São Paulo. Migração aplicada; gravação de teste aprovada e revertida. RLS ativo, sem acesso SELECT para anon/authenticated; INSERT autorizado ao service_role. Banco vazio após o teste. A API pública ainda precisa ser testada após configurar as variáveis na Vercel.
