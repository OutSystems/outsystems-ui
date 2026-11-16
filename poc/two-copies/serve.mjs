#!/usr/bin/env node
/**
 * Minimal static server rooted at the repository root, so the harness can load /dist/ and /poc/two-copies/.
 *
 *   node serve.mjs [port]    (default 4173)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const TYPES = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
};

http.createServer((req, res) => {
	const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
	const file = path.resolve(root, '.' + (urlPath.endsWith('/') ? urlPath + 'index.html' : urlPath));
	if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
		res.writeHead(404).end('Not found');
		return;
	}
	res.writeHead(200, {
		'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream',
		'Cache-Control': 'no-store',
	});
	fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`PoC server on http://localhost:${port}/poc/two-copies/`));
