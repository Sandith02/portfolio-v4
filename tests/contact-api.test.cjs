/* eslint-disable @typescript-eslint/no-require-imports -- This CJS harness compiles the real route with the existing TypeScript loader. */
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Exercise the real route using the project's existing TypeScript dependency.
const previousLoader = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { POST } = require('../app/api/contact/route.ts');
require.extensions['.ts'] = previousLoader;

const originalFetch = global.fetch;
const originalError = console.error;
const keys = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'VERCEL'];
const originalEnv = Object.fromEntries(keys.map(key => [key, process.env[key]]));
const data = { submissionId: '014928f3-1cb4-4d9d-94ab-1129980863a9', name: 'A visitor', email: 'visitor@example.com', company: '', topic: 'A project', message: 'I would like to talk about a new website.', website: '' };
const request = (body = data, headers = {}) => new Request('https://portfolio.test/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://portfolio.test', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
beforeEach(() => {
  process.env.SUPABASE_URL = 'https://project.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_not_real';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.VERCEL;
  global.fetch = async () => { throw new Error('Unexpected backend request'); };
  console.error = () => {};
});
afterEach(() => {
  global.fetch = originalFetch; console.error = originalError;
  for (const key of keys) { if (originalEnv[key] === undefined) delete process.env[key]; else process.env[key] = originalEnv[key]; }
});

test('only confirms a database-acknowledged save; normalizes input and strips unknown fields', async () => {
  let sent;
  global.fetch = async (url, options) => {
    assert.equal(url.pathname, '/rest/v1/rpc/submit_contact_inquiry');
    assert.equal(options.headers.apikey, 'sb_secret_test_not_real');
    assert.equal(options.headers.Authorization, undefined);
    sent = JSON.parse(options.body);
    return Response.json(sent.p_id);
  };
  const response = await POST(request({ ...data, name: '  A visitor  ', email: 'VISITOR@example.com ', status: 'replied' }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(sent.p_name, 'A visitor'); assert.equal(sent.p_email, 'visitor@example.com');
  assert.equal(sent.status, undefined); assert.equal(sent.p_fingerprint, null);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('invalid fields, JSON, origin, honeypots and oversized bodies never reach the database', async () => {
  assert.equal((await POST(request({ ...data, email: 'invalid', message: 'short' }))).status, 422);
  assert.equal((await POST(request({ ...data, name: ' '.repeat(20) }))).status, 422);
  assert.equal((await POST(request({ ...data, topic: 'unlisted' }))).status, 422);
  assert.equal((await POST(request({ ...data, website: 'bot.test' }))).status, 422);
  assert.equal((await POST(request({ ...data, submissionId: 'not-a-uuid' }))).status, 400);
  assert.equal((await POST(request('invalid json'))).status, 400);
  assert.equal((await POST(request([]))).status, 400);
  assert.equal((await POST(request(null))).status, 400);
  assert.equal((await POST(request(data, { Origin: 'https://other.test' }))).status, 403);
  assert.equal((await POST(request(data, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await POST(request({ ...data, message: 'x'.repeat(40000) }))).status, 413);
});
test('unconfigured, failed, timed-out or unconfirmed saves never report success', async () => {
  delete process.env.SUPABASE_SECRET_KEY;
  assert.equal((await POST(request())).status, 503);
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_not_real';
  assert.equal((await POST(request())).status, 503);
  global.fetch = async () => Response.json({ code: '42P01', message: 'private detail' }, { status: 404 });
  const response = await POST(request());
  assert.equal(response.status, 503); assert(!(await response.text()).includes('private detail'));
  global.fetch = async () => Response.json(null);
  assert.equal((await POST(request())).status, 503);
});
test('durable limits and conflicting retry IDs return actionable statuses', async () => {
  global.fetch = async () => Response.json({ code: 'P0001' }, { status: 400 });
  const limited = await POST(request());
  assert.equal(limited.status, 429); assert.equal(limited.headers.get('retry-after'), '3600');
  global.fetch = async () => Response.json({ code: 'P0002' }, { status: 400 });
  assert.equal((await POST(request())).status, 409);
});
test('hashes the trusted IP only on Vercel and supports legacy server keys', async () => {
  process.env.VERCEL = '1';
  delete process.env.SUPABASE_SECRET_KEY; process.env.SUPABASE_SERVICE_ROLE_KEY = 'legacy-test-key';
  global.fetch = async (url, options) => {
    const sent = JSON.parse(options.body);
    assert.match(sent.p_fingerprint, /^[0-9a-f]{64}$/);
    assert(!options.body.includes('192.0.2.1'));
    assert.equal(options.headers.Authorization, 'Bearer legacy-test-key');
    return Response.json(sent.p_id);
  };
  assert.equal((await POST(request(data, { 'x-vercel-forwarded-for': '192.0.2.1' }))).status, 201);
});
