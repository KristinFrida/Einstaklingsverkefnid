import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRoutes } from './routes/users.routes.js'
import { salaryRoutes } from './routes/salaries.routes.js'

const app = new Hono()
app.use('/*', cors())

app.route('/users', userRoutes)
app.route('/salaries', salaryRoutes)

export default app
