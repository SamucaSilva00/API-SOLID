import { MakeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case.js'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserCheckInsHistoryUseCase = MakeGetUserMetricsUseCase()
  const { checkInsCount } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
