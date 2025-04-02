import { Hono } from 'hono'
import { userRoutes } from './users.routes.js'
import { salaryRoutes } from './salaries.routes.js'

export const api = new Hono()

const routes = [
  {
    href: '/',
    methods: ['GET'],
  },
  {
    href: '/users',
    methods: ['GET', 'POST'],
    description: 'Skrá nýjan notanda og sækja alla notendur með launaupplýsingum',
  },
  {
    href: '/users/:id',
    methods: ['GET', 'PATCH', 'DELETE'],
    description: 'Sækja, breyta eða eyða notanda og tengdum launum',
  },
  {
    href: '/salaries',
    methods: ['POST'],
    description: 'Bæta við launatöflu fyrir notanda',
  },
  {
    href: '/salaries/:id',
    methods: ['PATCH', 'DELETE'],
    description: 'Uppfæra eða eyða launatöflu',
  }
]

api.get('/', (c) => c.json(routes))

api.route('/users', userRoutes)
api.route('/salaries', salaryRoutes)
