import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { handleMcp } from './engine.mjs';
export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/healthz' || url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Leo stickers MCP ready. Connect using /mcp.'); return;
      }
      if (url.pathname !== '/mcp') { res.writeHead(404); res.end(); return; }
      if (req.method !== 'POST') { res.writeHead(405, { Allow: 'POST' }); res.end(); return; }
      let length = 0; const chunks = [];
      for await (const chunk of req) {
        length += chunk.length;
        if (length > 65536) { res.writeHead(413); res.end('Request too large'); return; }
        chunks.push(chunk);
      }
      const request = new Request('http://localhost/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: Buffer.concat(chunks) });
      const result = await handleMcp(request);
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, '0.0.0.0', () => console.log('Leo MCP listening on port '+port));
}

