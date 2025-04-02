import { z } from 'zod';
const salarySchema = z.object({
    amount: z.number().int().positive(),
    experience: z.number().int().nonnegative(),
    userId: z.string()
});
export function validateSalaryCreate(data) {
    return salarySchema.safeParse(data);
}
