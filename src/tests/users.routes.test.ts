import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import request from 'supertest'
import { userRoutes } from '../routes/users.routes'

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const userMock = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  const salaryMock = {
    deleteMany: jest.fn(),
  }
  return {
    PrismaClient: jest.fn(() => ({
      user: userMock,
      salary: salaryMock,
    })),
  }
})

const prisma = new (jest.requireMock('@prisma/client').PrismaClient)()
const mockPrisma = prisma as unknown as {
  user: {
    findMany: jest.Mock
    findUnique: jest.Mock
    create: jest.Mock
    update: jest.Mock
    delete: jest.Mock
  }
  salary: {
    deleteMany: jest.Mock
  }
}

const app = new Hono()
app.route('/users', userRoutes)
const server = serve({ fetch: app.fetch })

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /users should return all users', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: '1', name: 'Alice' }])
    const res = await request(server).get('/users')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: '1', name: 'Alice' }])
  })

  it('GET /users/:id should return a user if found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', name: 'Alice' })
    const res = await request(server).get('/users/1')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: '1', name: 'Alice' })
  })

  it('GET /users/:id should return 404 if user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
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
    mockPrisma.user.create.mockResolvedValue({ id: '1', ...newUser })
    const res = await request(server).post('/users').send(newUser)
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Alice')
  })

  it('POST /users should return 400 for invalid input', async () => {
    const res = await request(server).post('/users').send({
      email: 'bademail',
    })
    expect(res.status).toBe(400)
  })

  it('PATCH /users/:id should update user data', async () => {
    const updated = { name: 'Updated Name' }
    mockPrisma.user.update.mockResolvedValue({ id: '1', ...updated })
    const res = await request(server).patch('/users/1').send(updated)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated Name')
  })

  it('DELETE /users/:id should delete user and salaries', async () => {
    mockPrisma.salary.deleteMany.mockResolvedValue({})
    mockPrisma.user.delete.mockResolvedValue({})
    const res = await request(server).delete('/users/1')
    expect(res.status).toBe(204)
  })
})
