import request from 'supertest'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { salaryRoutes } from '../routes/salaries.routes.js'

const app = new Hono()
app.route('/salaries', salaryRoutes)

const server = serve({ fetch: app.fetch })

describe('Salary Routes', () => {
  it('GET /salaries should return array of salaries', async () => {
    const res = await request(server).get('/salaries')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /salaries should return 400 with invalid data', async () => {
    const res = await request(server).post('/salaries').send({
      amount: -5,
      experience: 2,
      userId: 'some-user-id',
    })
    expect(res.statusCode).toBe(400)
  })
})
