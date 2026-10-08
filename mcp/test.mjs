import assert from 'node:assert/strict';
import { handleMcp } from './engine.mjs';
import { createServer } from './server.mjs';
const offline = async () => { throw new Error('Offline test'); };
async function call(method, params = {}) {
  const response = await handleMcp(new Request('http://localhost/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) }), offline);
  return response.json();
}
assert.equal((await call('initialize', { protocolVersion: '2025-06-18' })).result.protocolVersion, '2025-06-18');
assert.equal((await call('tools/list')).result.tools.length, 2);
assert.equal((await call('tools/call', { name: 'list_available_stickers' })).result.structuredContent.stickers.length, 8);
assert.equal((await call('tools/call', { name: 'send_sticker', arguments: { stickerId: 'vc-001' } })).result.structuredContent.id, 'vc-001');
assert.equal((await call('tools/call', { name: 'send_sticker', arguments: { query: '比心' } })).result.structuredContent.id, 'vc-001');
assert.equal((await call('tools/call', { name: 'send_sticker', arguments: { query: 42 } })).error.code, -32602);
assert.equal((await call('resources/read', { uri: 'ui://leo-stickers/view.html' })).result.contents[0].mimeType, 'text/html;profile=mcp-app');
const server = createServer();
try {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:'+server.address().port;
  assert.equal((await fetch(base+'/healthz')).status, 200);
  assert.equal((await fetch(base+'/mcp')).status, 405);
  const response = await fetch(base+'/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'send_sticker', arguments: { stickerId: 'vc-001' } } }) });
  assert.equal((await response.json()).result.structuredContent.id, 'vc-001');
  console.log('MCP selection, widget resources and HTTP routes passed');
} finally { await new Promise(resolve => server.close(resolve)); }

