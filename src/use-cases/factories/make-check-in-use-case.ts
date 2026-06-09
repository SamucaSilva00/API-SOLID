import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'
import { CheckInUseCase } from '../check-in.js'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'

export function MakeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInRepository, gymsRepository)
  return useCase
}
