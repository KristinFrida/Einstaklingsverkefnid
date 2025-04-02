import { Hono } from 'hono'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { zValidator } from '@hono/zod-validator'

export const userRoutes = new Hono()
const prisma = new PrismaClient()

const UserCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  ssn: z.string().min(6),
  gender: z.string(),
  password: z.string().min(6),
  field: z.string(),
})

// GET /users
userRoutes.get('/', async (c) => {
  try {
    const users = await prisma.user.findMany({
      include: { salaries: true },
    })
    return c.json(users)
  } catch (err) {
    return c.json({ message: 'Failed to fetch users', details: err }, 500)
  }
})

// GET /users/:id
userRoutes.get('/:id', async (c) => {
  const { id } = c.req.param()
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { salaries: true },
    })

    if (!user) return c.json({ message: 'User not found' }, 404)

    return c.json(user)
  } catch (err) {
    return c.json({ message: 'Failed to get user', details: err }, 500)
  }
})

// POST /users
userRoutes.post('/', zValidator('json', UserCreateSchema), async (c) => {
  const data = c.req.valid('json')

  try {
    const user = await prisma.user.create({ data })
    return c.json(user, 201)
  } catch (err) {
    return c.json({ message: 'User creation failed', details: err }, 500)
  }
})

// PATCH /users/:id
userRoutes.patch('/:id', async (c) => {
  const { id } = c.req.param()
  const data = await c.req.json()

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    })

    return c.json(user)
  } catch (err) {
    return c.json({ message: 'Failed to update user', details: err }, 500)
  }
})

// DELETE /users/:id
userRoutes.delete('/:id', async (c) => {
  const { id } = c.req.param()

  try {
    await prisma.salary.deleteMany({ where: { userId: id } })
    await prisma.user.delete({ where: { id } })
    return c.body(null, 204)
  } catch (err) {
    return c.json({ message: 'Failed to delete user', details: err }, 500)
  }
})
