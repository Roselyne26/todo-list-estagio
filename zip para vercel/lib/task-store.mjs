// Este módulo é usado apenas pela API no servidor.
const fields = 'id,title,description,dueDate:due_date,status';
export function createTaskStore({ url, key, fetcher = fetch }) {
  async function request(method, query, body) {
    if (!url || !key) throw new Error('Configure SUPABASE_URL e SUPABASE_SECRET_KEY no servidor.');
    const endpoint = new URL('/rest/v1/tasks', url);
    endpoint.search = new URLSearchParams({ select: fields, ...query }).toString();
    const headers = { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=representation' };
    // Chaves secretas atuais usam apenas apikey; JWTs service_role legados também usam Bearer.
    if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
    const response = await fetcher(endpoint, { method, headers, cache: 'no-store', signal: AbortSignal.timeout(15000), ...(body ? { body: JSON.stringify(body) } : {}) });
    if (!response.ok) throw new Error(`Banco respondeu com HTTP ${response.status}.`);
    return response.json();
  }
  return {
    list: owner => request('GET', { owner: `eq.${owner}`, order: 'created_at.desc,id.desc' }),
    create: (owner, task) => request('POST', {}, { id: crypto.randomUUID(), owner, title: task.title.trim(), description: task.description, due_date: task.dueDate, status: task.status }),
    update: (owner, task) => request('PATCH', { owner: `eq.${owner}`, id: `eq.${task.id}` }, { title: task.title.trim(), description: task.description, due_date: task.dueDate, status: task.status }),
    remove: (owner, id) => request('DELETE', { owner: `eq.${owner}`, id: `eq.${id}` }),
  };
}
export function getTaskStore() {
  return createTaskStore({ url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SECRET_KEY });
}
