import { Hono } from 'hono'
import { getUserById, createUser, updateUser, deleteUser } from '../services/users'
import { validateUserCreate } from '../validation/users'

export const userRoutes = new Hono()

userRoutes.get('/:id', getUserById)

userRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = validateUserCreate(body)
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400)
  return await createUser(c, parsed.data)
})

userRoutes.patch('/:id', updateUser)
userRoutes.delete('/:id', deleteUser)
