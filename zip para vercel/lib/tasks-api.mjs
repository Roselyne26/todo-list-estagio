import { validateTask } from './task-validation.mjs';
import { getTaskStore } from './task-store.mjs';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function session(request) {
  const raw = request.headers.get('cookie')?.split(';').map(c => c.trim()).find(c => c.startsWith('task_owner='))?.slice(11);
  const existing = typeof raw === 'string' && uuid.test(raw) ? raw : null;
  const owner = existing || crypto.randomUUID();
  const headers = { 'Cache-Control': 'no-store' };
  if (!existing) headers['Set-Cookie'] = `task_owner=${owner}; HttpOnly; Path=/; SameSite=Lax; Max-Age=31536000${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
  return { owner, headers };
}
export function createTaskApi(storeFactory = getTaskStore) {
  async function save(request, editing) {
    const { owner, headers } = session(request);
    let task;
    try { task = await request.json(); } catch { return Response.json({ error: 'Dados inválidos.' }, { status: 400, headers }); }
    const error = validateTask(task);
    if (error) return Response.json({ error }, { status: 400, headers });
    if (editing && (typeof task.id !== 'string' || !uuid.test(task.id))) return Response.json({ error: 'Tarefa inválida.' }, { status: 400, headers });
    try {
      const store = storeFactory();
      const rows = editing ? await store.update(owner, task) : await store.create(owner, task);
      if (!rows.length) return Response.json({ error: 'Tarefa não encontrada.' }, { status: 404, headers });
      return Response.json({ task: rows[0] }, { status: editing ? 200 : 201, headers });
    } catch (error) {
      console.error('Falha ao salvar tarefa:', error instanceof Error ? error.message : 'Erro de banco');
      return Response.json({ error: 'Não foi possível salvar. Seus campos foram preservados; tente novamente.' }, { status: 503, headers });
    }
  }
  return {
    async GET(request) {
      const { owner, headers } = session(request);
      try { return Response.json({ tasks: await storeFactory().list(owner) }, { headers }); }
      catch (error) {
        console.error('Falha ao listar tarefas:', error instanceof Error ? error.message : 'Erro de banco');
        return Response.json({ error: 'Não foi possível carregar as tarefas. Tente novamente.' }, { status: 503, headers });
      }
    },
    POST: request => save(request, false),
    PUT: request => save(request, true),
    async DELETE(request) {
      const { owner, headers } = session(request);
      const id = new URL(request.url).searchParams.get('id');
      if (!id || !uuid.test(id)) return Response.json({ error: 'Tarefa inválida.' }, { status: 400, headers });
      try {
        const rows = await storeFactory().remove(owner, id);
        if (!rows.length) return Response.json({ error: 'Tarefa não encontrada.' }, { status: 404, headers });
        return Response.json({ success: true }, { headers });
      } catch (error) {
        console.error('Falha ao excluir tarefa:', error instanceof Error ? error.message : 'Erro de banco');
        return Response.json({ error: 'Não foi possível excluir a tarefa. Tente novamente.' }, { status: 503, headers });
      }
    },
  };
}
