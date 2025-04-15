import { Hono } from 'hono'
import request from 'supertest'
import { userRoutes } from '../routes/users.routes'
import { PrismaClient } from '@prisma/client'

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mUser = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  const mSalary = {
    deleteMany: jest.fn(),
  }
  return {
    PrismaClient: jest.fn(() => ({
      user: mUser,
      salary: mSalary,
    })),
  }
})

const prisma = new PrismaClient()
const app = new Hono()
app.route('/users', userRoutes)
const server = (req: any, res: any) => {
  (async () => {
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
  })().catch((err) => {
    res.statusCode = 500
    res.end(err.message)
  })
}

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /users should return all users', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: '1', name: 'Alice' }])
    const res = await request(server).get('/users')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: '1', name: 'Alice' }])
  })

  it('GET /users/:id should return a user if found', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1', name: 'Alice' })
    const res = await request(server).get('/users/1')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: '1', name: 'Alice' })
  })

  it('GET /users/:id should return 404 if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    const res = await request(server).get('/users/999')
    expect(res.status).toBe(404)
  })

  it('POST /users should create a new user with valid input', async () => {
    const newUser = {
      name: 'Alice',
      email: 'alice@example.com',
      phone: '123456',
      ssn: '123456',
      gender: 'female',
      password: 'securepass',
      field: 'engineering',
    }
    prisma.user.create.mockResolvedValue({ id: '1', ...newUser })
    const res = await request(server).post('/users').send(newUser)
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Alice')
    expect(prisma.user.create).toHaveBeenCalledWith({ data: newUser })
  })

  it('POST /users should return 400 for invalid input', async () => {
    const res = await request(server).post('/users').send({
      email: 'bademail',
    })
    expect(res.status).toBe(400)
  })

  it('PATCH /users/:id should update user data', async () => {
    const updated = { name: 'Updated Name' }
    prisma.user.update.mockResolvedValue({ id: '1', ...updated })
    const res = await request(server).patch('/users/1').send(updated)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated Name')
  })

  it('DELETE /users/:id should delete user and salaries', async () => {
    prisma.salary.deleteMany.mockResolvedValue({})
    prisma.user.delete.mockResolvedValue({})
    const res = await request(server).delete('/users/1')
    expect(res.status).toBe(204)
    expect(prisma.salary.deleteMany).toHaveBeenCalledWith({ where: { userId: '1' } })
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } })
  })
})
