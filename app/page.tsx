'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, ClipboardList, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { validateTask } from '../lib/task-validation.mjs';

type Task = { id: string; title: string; description: string; dueDate: string; status: string };
type ApiResult = { error: string; tasks: Task[]; task: Task };
const blank = { title: '', description: '', dueDate: '', status: 'Pendente' };
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleting, setDeleting] = useState<Task | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);
  async function load() {
    setLoading(true); setError('');
    try { const response = await fetch('/api/tasks'); const data = await response.json() as ApiResult; if (!response.ok) throw new Error(data.error); setTasks(data.tasks); }
    catch (e) { setError(e instanceof Error ? e.message : 'Falha ao carregar tarefas.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function save(event: React.FormEvent) {
    event.preventDefault(); setNotice('');
    const validation = validateTask(form);
    if (validation) { setError(validation); return; }
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/tasks', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing }) });
      const data = await response.json() as ApiResult; if (!response.ok) throw new Error(data.error);
      setTasks(previous => editing ? previous.map(task => task.id === editing ? data.task : task) : [data.task, ...previous]);
      setNotice(editing ? 'Tarefa atualizada.' : 'Tarefa adicionada.'); setEditing(null); setForm(blank); titleRef.current?.focus();
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao salvar tarefa.'); }
    finally { setBusy(false); }
  }
  function edit(task: Task) { setEditing(task.id); setForm({ title: task.title, description: task.description, dueDate: task.dueDate, status: task.status }); setError(''); setNotice(''); titleRef.current?.focus(); titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  function cancel() { setEditing(null); setForm(blank); setError(''); titleRef.current?.focus(); }
  async function remove() {
    if (!deleting) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/tasks?id=' + encodeURIComponent(deleting.id), { method: 'DELETE' });
      const data = await response.json() as ApiResult; if (!response.ok) throw new Error(data.error);
      setTasks(previous => previous.filter(task => task.id !== deleting.id));
      if (editing === deleting.id) cancel();
      setNotice('Tarefa excluída.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Falha ao excluir tarefa.'); }
    finally { setBusy(false); deleteRef.current?.close(); setDeleting(null); }
  }
  const visible = tasks.filter(task => normalize(task.title + ' ' + task.description).includes(normalize(query)));
  const done = tasks.filter(task => task.status === 'Concluída').length;
  return (
    <main>
      <header className="topbar"><div className="brand"><span className="brand-icon"><Check size={23}/></span> tarefas<span className="brand-dot">.</span></div><span className="top-note">Um passo de cada vez</span></header>
      <section className="heading"><p className="eyebrow">SEU DIA, ORGANIZADO</p><h1>Lista de tarefas</h1><p>Planeje o que precisa fazer e acompanhe suas entregas.</p></section>
      <div className="workspace">
        <section className="form-panel" aria-labelledby="form-title"><div className="panel-heading"><span className="small-icon"><Plus size={20}/></span><h2 id="form-title">{editing ? 'Editar tarefa' : 'Nova tarefa'}</h2></div>
          <form onSubmit={save}>
            <label htmlFor="title">Título <span aria-hidden="true">*</span></label><input ref={titleRef} id="title" required maxLength={120} value={form.title} placeholder="O que você precisa fazer?" onChange={e => setForm({ ...form, title: e.target.value })}/>
            <label htmlFor="description">Descrição <span className="optional">opcional</span></label><textarea id="description" rows={4} maxLength={10000} value={form.description} placeholder="Anotações e detalhes da tarefa" onChange={e => setForm({ ...form, description: e.target.value })}/>
            <label htmlFor="date">Data prevista <span aria-hidden="true">*</span></label><input id="date" type="date" required min="0001-01-01" max="9999-12-31" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}/>
            <label htmlFor="status">Status</label><select id="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Pendente</option><option>Concluída</option></select>
            <button className="primary" disabled={busy || loading} type="submit">{busy ? 'Salvando…' : editing ? 'Salvar alterações' : 'Adicionar tarefa'}{!busy && <Plus size={18}/>}</button>
            {editing && <button className="cancel" type="button" disabled={busy} onClick={cancel}>Cancelar edição</button>}
          </form><p className="form-foot">* Campos obrigatórios</p>
        </section>
        <section className="list-panel" aria-labelledby="list-title"><div className="list-heading"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2 id="list-title">Suas tarefas <span className="count">{tasks.length}</span></h2></div><span className="completion">{done} concluída{done !== 1 ? 's' : ''}</span></div>
          <div className="search"><Search size={20}/><input aria-label="Pesquisar tarefas" placeholder="Pesquisar por título ou descrição" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Limpar pesquisa" onClick={() => setQuery('')}><X size={18}/></button>}</div>
          {error && <div role="alert" className="error">{error}<button onClick={load} disabled={busy || loading}>Recarregar lista</button></div>}
          <p role="status" className="notice">{notice}</p>
          {loading ? <div className="empty"><p>Carregando tarefas…</p></div> : visible.length === 0 ? <div className="empty"><span className="empty-icon"><ClipboardList size={36}/></span><h3>{query ? 'Nenhuma tarefa encontrada' : 'Espaço para seus próximos passos'}</h3><p>{query ? 'Tente pesquisar por outro título ou descrição.' : 'Adicione sua primeira tarefa no formulário.'}</p></div> : <ul className="task-list">{visible.map(task => <li key={task.id} className="task"><div className={'task-marker ' + (task.status === 'Concluída' ? 'finished' : '')}>{task.status === 'Concluída' && <Check size={16}/>}</div><div className="task-body"><h3>{task.title}</h3>{task.description && <p className="description">{task.description}</p>}<div className="task-meta"><time dateTime={task.dueDate}>{task.dueDate.split('-').reverse().join('/')}</time><span className={'badge ' + (task.status === 'Concluída' ? 'done' : '')}>{task.status}</span></div></div><div className="actions"><button disabled={busy} aria-label={'Editar ' + task.title} onClick={() => edit(task)}><Pencil size={18}/></button><button disabled={busy} className="delete" aria-label={'Excluir ' + task.title} onClick={() => { setDeleting(task); deleteRef.current?.showModal(); }}><Trash2 size={18}/></button></div></li>)}</ul>}
          <p className="list-foot">As tarefas ficam salvas para este navegador.</p>
        </section>
      </div>
      <footer>Lista de tarefas <span>Feito para simplificar o dia.</span></footer>
      <dialog ref={deleteRef} onCancel={() => setDeleting(null)}><h2>Excluir tarefa?</h2><p>A tarefa “{deleting?.title}” será excluída. Essa ação não pode ser desfeita.</p><div className="dialog-actions"><button autoFocus disabled={busy} onClick={() => { deleteRef.current?.close(); setDeleting(null); }}>Cancelar</button><button className="danger" disabled={busy} onClick={remove}>{busy ? 'Excluindo…' : 'Excluir tarefa'}</button></div></dialog>
    </main>
  );
}
