const { getParam, getArgByKey } = require("./utils/args");
const { serverWsToHttp, clientWsToHttp } = require("./http_ws");

const PROXY_TYPE = getParam(0);
const WS_PORT = parseInt(getArgByKey("ws", true) || '0');
const HTTP_PORT = parseInt(getArgByKey("http", true) || '0');
const URL = getArgByKey("url", true);

if (["server", "client", "s", "c"].indexOf(PROXY_TYPE) === -1) {
    console.error("Invalid proxy type, need 'server' or 'client'");
    process.exit(1);
}

if (WS_PORT === 0) {
    console.error("Need ws port");
    process.exit(1);
}

if (HTTP_PORT === 0) {
    console.error("Need http port");
    process.exit(1);
}

if (!URL) {
    console.error("Need url");
    process.exit(1);
}

const isServer = PROXY_TYPE === "server" || PROXY_TYPE === "s";

if (isServer) {
    console.log(`[SERVER] ws: ${WS_PORT}, http: ${HTTP_PORT}, url: ${URL}`);
    serverWsToHttp(WS_PORT, HTTP_PORT, URL);
} else {
    console.log(`[CLIENT] ws: ${WS_PORT}, http: ${HTTP_PORT}, url: ${URL}`);
    clientWsToHttp(WS_PORT, HTTP_PORT, URL);
}