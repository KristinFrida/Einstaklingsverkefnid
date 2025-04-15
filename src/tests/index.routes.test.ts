import { Hono } from 'hono'
import request from 'supertest'
import { api } from '../routes/index.routes.js'

const createServer = () => {
  const app = new Hono()
  app.route('/', api)
  return async (req: any, res: any) => {
    try {
      const response = await app.fetch(req, {
        headers: req.headers,
        method: req.method,
        body: req,
        duplex: 'half',
      })

      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))

      const reader = response.body?.getReader()
      if (!reader) return res.end()

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(decoder.decode(value))
      }
      res.end()
    } catch (err: any) {
      res.statusCode = 500
      res.end(err.message)
    }
  }
}

const server = createServer()

describe('Index API', () => {
  it('GET / should return list of available routes', async () => {
    const res = await request(server).get('/')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.some((r: { href: string }) => r.href === '/users')).toBe(true)
  })
})
