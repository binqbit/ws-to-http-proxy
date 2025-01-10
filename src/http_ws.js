const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const ws = require("ws");
const { v4: uuidv4 } = require("uuid");

const CLIENTS = {};

function connectWsClient(id, wsPort, httpUrl) {
    const webSocketClient = new ws(`ws://localhost:${wsPort}`);
    CLIENTS[id] = webSocketClient;
    console.log(`[CONNECTED] New client connected with id: ${id}`);
    
    webSocketClient.on("message", (message, isBinary) => {
        const data = isBinary ? Buffer.from(message).toString("base64") : message.toString();
        console.log(`[FROM-SERVER] Client(${id}), Data: ${data}`);

        fetch(`${httpUrl}/data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, data, isBinary }),
        });
    });

    return new Promise((resolve) => {
        webSocketClient.on("open", () => {
            resolve();
        });
    });
}

async function serverWsToHttp(wsPort, httpPort, httpUrl) {
    const app = express();
    app.use(express.json());

    app.get('/init-server', (req, res, next) => {
        console.log('[INIT] Init server->client http proxy');
        createProxyMiddleware({ target: httpUrl, changeOrigin: true, followRedirects: true })(req, res, next);
    });
    
    app.get('/init-client', (req, res, next) => {
        console.log('[INIT] Init client->server http proxy');
        res.sendStatus(200);
    });

    app.post("/data", async (req, res) => {
        const { id, data, isBinary } = req.body;
        console.log(`[TO-SERVER] Client(${id}), Data: ${data}`);

        if (!(id in CLIENTS)) {
            await connectWsClient(id, wsPort, httpUrl);
        }
        CLIENTS[id].send(isBinary ? Buffer.from(data, "base64") : data);
        res.sendStatus(200);
    });

    app.listen(httpPort, () => {
        console.log(`[SERVER] Start HTTP proxy on port ${httpPort}`);
        console.log(`[SERVER] To init server, visit: http://localhost:${httpPort}/init-server`);
    });
}

async function clientWsToHttp(wsPort, httpPort, httpUrl) {
    const webSocketServer = new ws.Server({ port: wsPort });

    webSocketServer.on("connection", (webSocketClient) => {
        const id = uuidv4();

        CLIENTS[id] = webSocketClient;
        console.log(`[CONNECTED] New client connected with id: ${id}`);

        webSocketClient.on("message", (message, isBinary) => {
            const data = isBinary ? Buffer.from(message).toString("base64") : message.toString();
            console.log(`[FROM-CLIENT] Client(${id}) data: ${data}`);

            fetch(`${httpUrl}/data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, data, isBinary }),
            });
        });
    });

    const app = express();
    app.use(express.json());

    app.get('/init-server', (req, res, next) => {
        console.log('[INIT] Init server->client http proxy');
        res.sendStatus(200);
    });

    app.get('/init-client', (req, res, next) => {
        console.log('[INIT] Init client->server http proxy');
        createProxyMiddleware({ target: httpUrl, changeOrigin: true, followRedirects: true })(req, res, next);
    });
    
    app.post("/data", (req, res) => {
        const { id, data, isBinary } = req.body;
        console.log(`[TO-CLIENT] Client(${id}) data: ${data}`);
        CLIENTS[id].send(isBinary ? Buffer.from(data, "base64") : data);
        res.sendStatus(200);
    });

    app.listen(httpPort, () => {
        console.log(`[CLIENT] Start HTTP proxy on port ${httpPort}`);
        console.log(`[CLIENT] To init client, visit: http://localhost:${httpPort}/init-client`);
    });
}

module.exports = {
    serverWsToHttp,
    clientWsToHttp,
};