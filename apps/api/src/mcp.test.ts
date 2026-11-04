import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client'
import fastify from 'fastify'
import { afterAll, beforeAll, describe, expect, test } from 'vite-plus/test'

import { mcpPlugin } from './mcp'

describe('MCP over Streamable HTTP', () => {
  const app = fastify()
  let endpoint: URL

  beforeAll(async () => {
    await app.register(mcpPlugin)
    const address = await app.listen({ host: '127.0.0.1', port: 0 })
    endpoint = new URL('/mcp', address)
  })

  afterAll(async () => {
    await app.close()
  })

  test('advertises the hello tool through an SSE response', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/mcp',
      headers: { accept: 'application/json, text/event-stream' },
      payload: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/event-stream')
    const data = response.body.match(/^data: (.+)$/m)?.[1]
    expect(JSON.parse(data ?? 'null')).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: { tools: [{ name: 'hello', inputSchema: { type: 'object' } }] },
    })
  })

  test('returns Hello, world! to an official MCP client', async () => {
    const client = new Client(
      { name: 'f3-api-test', version: '1.0.0' },
      { versionNegotiation: { mode: 'auto' } },
    )

    try {
      await expect(
        client.connect(new StreamableHTTPClientTransport(endpoint)),
      ).resolves.toBeUndefined()
      const result = await client.callTool({ name: 'hello', arguments: {} })

      expect(result.isError).not.toBe(true)
      expect(result.content).toEqual([{ type: 'text', text: 'Hello, world!' }])
    } finally {
      await client.close()
    }
  })

  test.each([
    { name: 'Host', headers: { host: 'untrusted.example' } },
    { name: 'Origin', headers: { origin: 'https://untrusted.example' } },
  ])('rejects an untrusted $name on /mcp', async ({ headers }) => {
    const response = await app.inject({
      method: 'POST',
      url: '/mcp',
      headers: { ...headers, accept: 'application/json, text/event-stream' },
      payload: { jsonrpc: '2.0', id: 1, method: 'tools/list' },
    })

    expect(response.statusCode).toBe(403)
  })
})
