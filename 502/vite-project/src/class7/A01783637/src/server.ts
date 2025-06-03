//server.ts

import { WebSocketServer, WebSocket } from 'ws';

const PORT = parseInt(process.env.PORT ?? '8080', 10);
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0'  });
wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 Client connected');

  ws.on('message', (message: string) => {
    console.log(`📩 Received: ${message}`);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`answered:${message}`); 
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });
});

console.log('✅ WebSocket server running on ws://IP:8080');
