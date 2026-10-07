-- Executar uma vez no SQL Editor do seu projeto Supabase.
create table if not exists public.tasks (
  id uuid primary key,
  owner uuid not null,
  title text not null check (length(btrim(title)) between 1 and 120),
  description text not null default '' check (length(description) <= 10000),
  due_date date not null,
  status text not null default 'Pendente' check (status in ('Pendente', 'Concluída')),
  created_at timestamptz not null default now()
);
create index if not exists tasks_owner_created_idx on public.tasks (owner, created_at desc);
alter table public.tasks enable row level security;
revoke all on public.tasks from anon, authenticated;
grant select, insert, update, delete on public.tasks to service_role;
-- Somente a API no servidor acessa a tabela com a chave secreta.
