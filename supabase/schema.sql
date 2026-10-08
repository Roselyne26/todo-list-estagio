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
alter table public.tasks add column if not exists completed_at timestamptz;
create or replace function public.record_task_completion() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
 if TG_OP = 'INSERT' then
   new.status := 'Pendente'; new.completed_at := null;
 elsif new.status = 'Concluída' and old.status is distinct from 'Concluída' then
   new.completed_at := greatest(clock_timestamp(), new.created_at);
 elsif new.status = 'Concluída' then
   new.completed_at := old.completed_at;
 else
   new.completed_at := null;
 end if;
 return new;
end;
$$;
revoke all on function public.record_task_completion() from public, anon, authenticated;
create trigger tasks_record_completion before insert or update on public.tasks for each row execute function public.record_task_completion();
