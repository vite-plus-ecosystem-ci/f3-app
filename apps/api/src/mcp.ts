import { localhostHostValidation, localhostOriginValidation } from '@modelcontextprotocol/fastify'
import { toNodeHandler } from '@modelcontextprotocol/node'
import { createMcpHandler, McpServer } from '@modelcontextprotocol/server'
import type { FastifyPluginAsync } from 'fastify'

export const mcpPlugin: FastifyPluginAsync = async (app) => {
  const handler = createMcpHandler(() => {
    const server = new McpServer({ name: 'f3-api', version: '1.0.0' })

    server.registerTool(
      'hello',
      { description: 'Return a Hello, world! greeting.', annotations: { readOnlyHint: true } },
      async () => ({ content: [{ type: 'text', text: 'Hello, world!' }] }),
    )

    return server
  })
  const handleRequest = toNodeHandler(handler)

  app.addHook('onClose', () => handler.close())
  app.all(
    '/mcp',
    { onRequest: [localhostHostValidation(), localhostOriginValidation()] },
    async (request, reply) => {
      reply.hijack()
      await handleRequest(request.raw, reply.raw, request.body)
    },
  )
}
