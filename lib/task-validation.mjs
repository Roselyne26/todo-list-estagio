export function validateTask(value) {
  if (!value || typeof value !== 'object') return 'Dados da tarefa inválidos.';
  if (typeof value.title !== 'string' || !value.title.trim()) return 'Informe o título da tarefa.';
  if (value.title.trim().length > 120) return 'O título deve ter até 120 caracteres.';
  if (typeof value.description !== 'string' || value.description.length > 10000) return 'A descrição deve ter até 10.000 caracteres.';
  if (typeof value.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.dueDate)) return 'Selecione uma data válida.';
  const date = new Date(value.dueDate + 'T00:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value.dueDate || value.dueDate < '0001-01-01') return 'Selecione uma data válida.';
  if (!['Pendente', 'Concluída'].includes(value.status)) return 'Selecione um status válido.';
  return null;
}
