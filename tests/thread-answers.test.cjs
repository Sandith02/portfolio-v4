/* eslint-disable @typescript-eslint/no-require-imports */
const {test, beforeEach, afterEach}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const previousLoader=require.extensions['.ts'];
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {POST}=require('../app/api/thread-answers/route.ts');
require.extensions['.ts']=previousLoader;
const originalFetch=global.fetch;
const originalError=console.error;
const keys=['SUPABASE_URL','SUPABASE_SECRET_KEY','SUPABASE_SERVICE_ROLE_KEY'];
const env=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
const data={slug:'how-much-of-this-actually-happened',answer:'I have definitely done this myself.',submissionId:'014928f3-1cb4-4d9d-94ab-1129980863a9'};
const request=(body=data,headers={})=>new Request('https://portfolio.test/api/thread-answers',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://portfolio.test',...headers},body:JSON.stringify(body)});
beforeEach(()=>{process.env.SUPABASE_URL='https://project.supabase.co';process.env.SUPABASE_SECRET_KEY='sb_secret_fake';delete process.env.SUPABASE_SERVICE_ROLE_KEY;global.fetch=async()=>{throw Error('Unexpected database call')};console.error=()=>{}});
afterEach(()=>{global.fetch=originalFetch;console.error=originalError;for(const key of keys){if(env[key]===undefined)delete process.env[key];else process.env[key]=env[key]}});
test('saves a valid answer with canonical thread context, hashed client and stable retry ID',async()=>{
 global.fetch=async(url,options)=>{assert.equal(url.pathname,'/rest/v1/rpc/submit_thread_answer');const sent=JSON.parse(options.body);assert.equal(sent.p_slug,data.slug);assert.equal(sent.p_title,'How much of this actually happened?');assert.match(sent.p_question,/When was the last time/);assert.equal(sent.p_answer,data.answer);assert.match(sent.p_fingerprint,/^[a-f0-9]{64}$/);assert.equal(sent.p_id,data.submissionId);return Response.json(sent.p_id)};
 assert.equal((await POST(request({...data,question:'Forged question'}))).status,201);
});
test('enforces 500-word boundary and rejects empty, unknown, oversize and cross-site submissions',async()=>{
 for(const body of [{...data,answer:''},{...data,answer:'word '.repeat(501)},{...data,answer:'x'.repeat(20001)},{...data,website:'bot'}])assert.equal((await POST(request(body))).status,422);
 assert.equal((await POST(request({...data,slug:'missing'}))).status,404);
 assert.equal((await POST(request(data,{Origin:'https://elsewhere.test'}))).status,403);
 assert.equal((await POST(request({...data,submissionId:'bad'}))).status,400);
 assert.equal((await POST(request({...data,answer:'x'.repeat(100001)}))).status,413);
 global.fetch=async(url,options)=>Response.json(JSON.parse(options.body).p_id);
 assert.equal((await POST(request({...data,answer:'word '.repeat(500)}))).status,201);
});
test('does not report success for missing tables, unconfirmed writes, limits or conflicting retries',async()=>{
 for(const [result,status] of [[{code:'42P01'},503],[{code:'P0001'},429],[{code:'P0002'},409]]){global.fetch=async()=>Response.json(result,{status:400});assert.equal((await POST(request())).status,status)}
 global.fetch=async()=>Response.json(null);assert.equal((await POST(request())).status,503);
 delete process.env.SUPABASE_SECRET_KEY;assert.equal((await POST(request())).status,503);
});
