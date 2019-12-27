const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 4000;
const INDEX = '/public/index.html';

// Creando servidor HTTP
const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname}))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Creando WebSocket que escucha nuestro servidor HTTP creado
const wss = new Server({ server })

/*
** Mostrar cuando algun cliente se conecta o desconecta
*/
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
})

/* 
** Enviando actualizaciones a los clientes mediante 'broadcast'
** sin esperar la solicitud del cliente. Se envia el tiempo actual
** cada 1000 milisegundos
*/
setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);

