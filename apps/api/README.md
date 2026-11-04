# API

Start the API from the workspace root:

```sh
vp run api#dev
```

The server listens at `http://localhost:5000` and exposes tRPC at `/trpc`, oRPC at `/orpc`,
and MCP Streamable HTTP at `/mcp`.

## MCP

The MCP endpoint uses the official TypeScript SDK v2 with a fresh server instance per request.
The `hello` tool takes no arguments and returns `Hello, world!` as text content.
Configure an MCP client's Streamable HTTP URL as `http://localhost:5000/mcp`.

List the tools:

```sh
curl -N http://localhost:5000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Call `hello`:

```sh
curl -N http://localhost:5000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"hello","arguments":{}}}'
```

The endpoint validates localhost Host and Origin headers using the SDK's Fastify hooks.

## Validation

From the workspace root:

```sh
vp test --run
vp check
vp run build
```
