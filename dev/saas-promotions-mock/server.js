#!/usr/bin/env node
/**
 * Local mock server for Progressive Delivery plugin.
 * Serves saas-promotions.json at /saas-promotions for use with the Backstage proxy.
 *
 * Start with: node dev/saas-promotions-mock/server.js
 * Then run Backstage with app-config that proxies /api/proxy/inscope-resources -> http://localhost:7008
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.SAAS_PROMOTIONS_MOCK_PORT || 7008;
const FILE = path.join(__dirname, 'saas-promotions.json');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/saas-promotions' || req.url === '/saas-promotions/')) {
    fs.readFile(FILE, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read mock data' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Progressive Delivery mock server: http://localhost:${PORT}/saas-promotions`);
});
