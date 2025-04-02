import { z } from 'zod'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { zValidator } from '@hono/zod-validator'

const prisma = new PrismaClient()
export const salaryRoutes = new Hono()

const SalaryCreateSchema = z.object({
  amount: z.number().int().positive(),
  experience: z.number().int().nonnegative(),
  userId: z.string(),
})

// GET /salaries – fetch all salaries
salaryRoutes.get('/', async (c) => {
  try {
    const salaries = await prisma.salary.findMany({
      include: { user: true },
    })
    return c.json(salaries)
  } catch (err) {
    return c.json({ message: 'Failed to fetch salaries', details: err }, 500)
  }
})

salaryRoutes.post(
  '/',
  zValidator('json', SalaryCreateSchema),
  async (c) => {
    const data = c.req.valid('json')
    try {
      const salary = await prisma.salary.create({ data })
      return c.json(salary, 201)
    } catch (err) {
      return c.json({ message: 'Failed to create salary', details: err }, 500)
    }
  },
)

// PATCH /salaries/:id – update salary
salaryRoutes.patch('/:id', async (c) => {
  const { id } = c.req.param()
  const data = await c.req.json()

  try {
    const salary = await prisma.salary.update({
      where: { id },
      data,
    })
    return c.json(salary)
  } catch (err) {
    return c.json({ message: 'Failed to update salary', details: err }, 500)
  }
})

// DELETE /salaries/:id – delete salary
salaryRoutes.delete('/:id', async (c) => {
  const { id } = c.req.param()
  try {
    await prisma.salary.delete({ where: { id } })
    return c.body(null, 204)
  } catch (err) {
    return c.json({ message: 'Failed to delete salary', details: err }, 500)
  }
})
