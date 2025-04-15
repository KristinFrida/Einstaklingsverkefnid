import { Hono } from 'hono'
import request from 'supertest'
import { userRoutes } from '../routes/users.routes.js'

const createServer = () => {
  const app = new Hono()
  app.route('/users', userRoutes) 
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

describe('User routes', () => {
  it('GET /users should return list of users (mocked)', async () => {
    const res = await request(server).get('/users')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /users should return 400 for invalid input', async () => {
    const res = await request(server).post('/users').send({
      email: 'invalid@input.com',
    })
    expect(res.statusCode).toBe(400)
  })
})
