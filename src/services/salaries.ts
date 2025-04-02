import { PrismaClient } from '@prisma/client'
import { Context } from 'hono'

const prisma = new PrismaClient()

export async function createSalary(c: Context, data: any) {
  try {
    const salary = await prisma.salary.create({ data })
    return c.json(salary, 201)
  } catch (err) {
    return c.json({ error: 'Salary creation failed', details: err }, 500)
  }
}

export async function updateSalary(c: Context) {
  const { id } = c.req.param()
  const data = await c.req.json()
  try {
    const salary = await prisma.salary.update({
      where: { id },
      data
    })
    return c.json(salary)
  } catch (err) {
    return c.json({ error: 'Failed to update salary', details: err }, 500)
  }
}

export async function deleteSalary(c: Context) {
  const { id } = c.req.param()
  try {
    await prisma.salary.delete({ where: { id } })
    return c.body(null, 204)
  } catch (err) {
    return c.json({ error: 'Failed to delete salary', details: err }, 500)
  }
}
