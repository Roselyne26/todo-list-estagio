import test from 'node:test';
import assert from 'node:assert/strict';
import { createTaskApi } from '../lib/tasks-api.mjs';
import { createTaskStore } from '../lib/task-store.mjs';
const id='ac8ec496-d573-4336-b695-0e80d30436ac', owner='dca5e218-0f86-4eb4-b166-4c729aafce64';
const req = body => new Request('https://example.test/api/tasks',{method:'PATCH',headers:{cookie:'task_owner='+owner},body:JSON.stringify(body)});
test('conclusão respeita proprietário e valida ID, inexistência e falha',async()=>{
 let args;
 const api=createTaskApi(()=>({complete:async(o,i)=>{args=[o,i];return [{id:i,status:'Concluída',completedAt:'2026-10-07T23:00:00Z'}];}}));
 const response=await api.PATCH(req({id})); assert.equal(response.status,200); assert.deepEqual(args,[owner,id]); assert.ok((await response.json()).task.completedAt);
 assert.equal((await api.PATCH(req({id:'bad'}))).status,400);
 assert.equal((await createTaskApi(()=>({complete:async()=>[]})).PATCH(req({id}))).status,404);
 assert.equal((await createTaskApi(()=>({complete:async()=>{throw Error();}})).PATCH(req({id}))).status,503);
});
test('criação sempre pendente; edição preserva status e data de conclusão',async()=>{
 const calls=[];
 const store=createTaskStore({url:'https://example.supabase.co',key:'sb_secret_test',fetcher:async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return Response.json([]);}});
 const task={id,title:'Teste',description:'',dueDate:'2026-10-07',status:'Concluída'};
 await store.create(owner,task);await store.update(owner,task);await store.complete(owner,id);
 assert.equal(calls[0].body.status,'Pendente');assert.equal(calls[1].body.status,undefined);assert.equal(calls[1].body.completed_at,undefined);
 assert.equal(calls[2].body.status,'Concluída');assert.equal(calls[2].url.searchParams.get('owner'),'eq.'+owner);
});
