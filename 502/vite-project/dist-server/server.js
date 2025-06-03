"use strict";
//server.ts
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const PORT = parseInt(process.env.PORT ?? '8080', 10);
const wss = new ws_1.WebSocketServer({ port: PORT, host: '0.0.0.0' });
wss.on('connection', (ws) => {
    console.log('🔌 Client connected');
    ws.on('message', (message) => {
        console.log(`📩 Received: ${message}`);
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.send(`answered:${message}`);
            }
        });
    });
    ws.on('close', () => {
        console.log('❌ Client disconnected');
    });
});
console.log('✅ WebSocket server running on ws://IP:8080');
