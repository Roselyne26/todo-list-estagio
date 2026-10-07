import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTask } from '../lib/task-validation.mjs';
import { createTaskApi } from '../lib/tasks-api.mjs';
import { createTaskStore } from '../lib/task-store.mjs';
const valid={title:'Revisar projeto',description:'Documento',dueDate:'2026-10-07',status:'Pendente'};
const taskId='ac8ec496-d573-4336-b695-0e80d30436ac';
const owner='dca5e218-0f86-4eb4-b166-4c729aafce64';
function req(method,body,session=owner,id='') { return new Request('https://example.test/api/tasks'+id,{method,headers:{cookie:'task_owner='+session},...(body?{body:JSON.stringify(body)}:{})}); }
test('título, calendário, limite e status',()=>{
 assert.equal(validateTask(valid),null);assert.equal(validateTask({...valid,dueDate:'2024-02-29'}),null);
 for(const v of [{title:''},{title:'  '},{title:123},{title:'x'.repeat(121)},{dueDate:'2026-02-29'},{dueDate:'2026-04-31'},{dueDate:'0000-01-01'},{dueDate:'texto'},{status:'Outro'},{description:null}]) assert.ok(validateTask({...valid,...v}));
});
test('API executa CRUD com proprietário e rejeita IDs e dados inválidos',async()=>{
 const calls=[];
 const api=createTaskApi(()=>({list:async o=>{calls.push(['list',o]);return [];},create:async(o,t)=>{calls.push(['create',o,t]);return [{...t,id:taskId}];},update:async(o,t)=>{calls.push(['update',o,t]);return [{...t}];},remove:async(o,id)=>{calls.push(['remove',o,id]);return [{id}];}}));
 assert.equal((await api.GET(req('GET'))).status,200);
 assert.equal((await api.POST(req('POST',valid))).status,201);
 assert.equal((await api.PUT(req('PUT',{...valid,id:taskId}))).status,200);
 assert.equal((await api.DELETE(req('DELETE',null,owner,'?id='+taskId))).status,200);
 assert.ok(calls.every(c=>c[1]===owner));
 assert.equal((await api.POST(req('POST',{...valid,title:' '}))).status,400);
 assert.equal((await api.PUT(req('PUT',{...valid,id:'inválido'}))).status,400);
 assert.equal((await api.DELETE(req('DELETE',null,owner,'?id=invalid'))).status,400);
 assert.equal(calls.length,4);
});
test('novas sessões recebem cookies HttpOnly e Secure; cookies inválidos são substituídos',async()=>{
 const api=createTaskApi(()=>({list:async()=>[]}));
 const response=await api.GET(new Request('https://example.test/api/tasks'));
 assert.match(response.headers.get('set-cookie'),/HttpOnly/);assert.match(response.headers.get('set-cookie'),/Secure/);
 assert.equal(response.headers.get('cache-control'),'no-store');
 const replacement=await api.GET(req('GET',null,'invalid'));assert.ok(replacement.headers.get('set-cookie'));
 assert.equal((await api.GET(req('GET'))).headers.get('set-cookie'),null);
});
test('tarefa de outra lista ou inexistente retorna 404',async()=>{
 const api=createTaskApi(()=>({update:async()=>[],remove:async()=>[]}));
 assert.equal((await api.PUT(req('PUT',{...valid,id:taskId}))).status,404);
 assert.equal((await api.DELETE(req('DELETE',null,owner,'?id='+taskId))).status,404);
});
test('cliente Supabase inclui filtros de proprietário em consultas e chave só no cabeçalho',async()=>{
 const calls=[];
 const store=createTaskStore({url:'https://project.supabase.co',key:'sb_secret_TEST_ONLY',fetcher:async(url,options)=>{calls.push({url,options});return Response.json([{id:taskId,...valid}]);}});
 await store.list(owner);await store.create(owner,valid);await store.update(owner,{...valid,id:taskId});await store.remove(owner,taskId);
 for(const i of [0,2,3]) assert.equal(calls[i].url.searchParams.get('owner'),'eq.'+owner);
 for(const i of [2,3]) assert.equal(calls[i].url.searchParams.get('id'),'eq.'+taskId);
 assert.equal(JSON.parse(calls[1].options.body).owner,owner);
 assert.equal(calls[1].options.headers.apikey,'sb_secret_TEST_ONLY');
 assert.equal(calls[1].options.headers.Authorization,undefined);
 assert.ok(calls.every(c=>!String(c.url).includes('sb_secret')));
});
test('falha de banco retorna mensagem recuperável sem retornar segredos',async()=>{
 const old=console.error;console.error=()=>{};
 try {
 const api=createTaskApi(()=>({list:async()=>{throw new Error('falha interna');},create:async()=>{throw new Error('falha interna');}}));
 for(const response of [await api.GET(req('GET')),await api.POST(req('POST',valid))]) {assert.equal(response.status,503);assert.ok(!(await response.text()).includes('falha interna'));}
 } finally {console.error=old;}
});
