import { Hono } from 'hono';
import { createSalary, updateSalary, deleteSalary } from '../services/salaries.js';
import { validateSalaryCreate } from '../validation/salaries.js';
export const salaryRoutes = new Hono();
salaryRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const parsed = validateSalaryCreate(body);
    if (!parsed.success)
        return c.json({ error: parsed.error.flatten() }, 400);
    return await createSalary(c, parsed.data);
});
salaryRoutes.patch('/:id', updateSalary);
salaryRoutes.delete('/:id', deleteSalary);
