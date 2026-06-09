import { MakeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case.js'
import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const registerUseCase = MakeValidateCheckInUseCase()
  await registerUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
