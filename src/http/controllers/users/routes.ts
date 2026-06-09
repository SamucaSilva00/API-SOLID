import { FastifyInstance } from 'fastify'
import { register } from './register.js'
import { authenticate } from './authenticate.js'
import { profile } from './profile.js'
import { refresh } from './refresh.js'
import { verifyJwt } from '../../middlewares/verify-jwt.js'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  /** Authenticated Routes */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
// uma boa pratica é que o nome das rotas sejam nomes de entidades, dessa forma, a rota fica consideravelmente mais semantica.
