import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function getUserById(c) {
    const { id } = c.req.param();
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { salaries: true }
        });
        if (!user)
            return c.json({ error: 'User not found' }, 404);
        return c.json(user);
    }
    catch (err) {
        return c.json({ error: 'Failed to get user', details: err }, 500);
    }
}
export async function createUser(c, data) {
    try {
        const user = await prisma.user.create({ data });
        return c.json(user, 201);
    }
    catch (err) {
        return c.json({ error: 'User creation failed', details: err }, 500);
    }
}
export async function updateUser(c) {
    const { id } = c.req.param();
    const data = await c.req.json();
    try {
        const user = await prisma.user.update({
            where: { id },
            data
        });
        return c.json(user);
    }
    catch (err) {
        return c.json({ error: 'Failed to update user', details: err }, 500);
    }
}
export async function deleteUser(c) {
    const { id } = c.req.param();
    try {
        await prisma.salary.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
        return c.body(null, 204);
    }
    catch (err) {
        return c.json({ error: 'Failed to delete user', details: err }, 500);
    }
}
