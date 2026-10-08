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
