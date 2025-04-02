import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  ssn: z.string().min(6),
  gender: z.string(),
  password: z.string().min(6),
  field: z.string()
})

export function validateUserCreate(data: unknown) {
  return userSchema.safeParse(data)
}
