import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import OpenAI from 'openai'
import { z } from 'zod'

const server = new McpServer({ name: 'openai-image-generation', version: '1.0.0' })

server.registerTool(
  'generate_image',
  {
    title: 'Generate an image with OpenAI',
    description: 'Generate a custom PNG with gpt-image-2 and save it under public/generated/.',
    inputSchema: {
      prompt: z.string().min(10).describe('Detailed image-generation prompt'),
      filename: z.string().regex(/^[a-z0-9][a-z0-9-]*$/).describe('Lowercase output name without an extension'),
      size: z.enum(['1024x1024', '1536x1024', '1024x1536']).default('1536x1024'),
      quality: z.enum(['low', 'medium', 'high']).default('high'),
    },
  },
  async ({ prompt, filename, size, quality }) => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in the environment that launched OpenCode.')
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const result = await openai.images.generate({
      model: 'gpt-image-2',
      prompt,
      size,
      quality,
      output_format: 'png',
    })
    const encoded = result.data?.[0]?.b64_json
    if (!encoded) throw new Error('OpenAI returned no image data.')

    const outputDirectory = path.resolve(process.cwd(), 'public', 'generated')
    await mkdir(outputDirectory, { recursive: true })
    const outputPath = path.join(outputDirectory, `${filename}.png`)
    await writeFile(outputPath, Buffer.from(encoded, 'base64'))

    return {
      content: [{ type: 'text', text: `Generated /generated/${filename}.png` }],
    }
  },
)

await server.connect(new StdioServerTransport())
