# WebSocket To HTTP Proxy

## Description
This is a simple tool to implement proxy WebSocket via HTTP protocol.

## Installation
- Build from source
```bash
yarn build
```

- Run command
```bash
ws-to-http-proxy server / client --ws <port> --http <port> --url <url>
```

- Or use start command
```bash
yarn start server / client --ws <port> --http <port> --url <url>
```

- Add to PATH
```bash
export PATH=$PATH:/path/to/ws-to-http-proxy/bin
```

## Usage
### Redirect traffic from `ws://server1:8100` to `ws://server2:8100`
1. Open a global tunnel for proxy `Server 1`
```bash
ngrok http 8000
# https://server1.ngrok-free.app
```

2. Open a global tunnel for proxy `Server 2`
```bash
ngrok http 8100
# https://server2.ngrok-free.app
```

3. Launch WebSocket Server for `Server 1`
```bash
ws-to-http-proxy server --ws 8100 --http 8000 --url 'https://server2.ngrok-free.app'
```

4. Launch WebSocket Server for `Server 2`
```bash
ws-to-http-proxy server --ws 8100 --http 8000 --url 'https://server1.ngrok-free.app'
```

5. Open a init link for `Server 1` and `Server 2` to approve the connection for ngrok: `http://server1:8000/init-server` and `http://server2:8000/init-client`

6. Ready to go!
