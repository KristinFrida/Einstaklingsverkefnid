import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRoutes } from './routes/users.js'
import { salaryRoutes } from './routes/salaries.js'

const app = new Hono()
app.use('/*', cors())

app.route('/users', userRoutes)
app.route('/salaries', salaryRoutes)

export default app
