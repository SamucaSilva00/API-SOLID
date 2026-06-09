import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from './check-in.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { Decimal } from '@prisma/client/runtime/index-browser'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error.js'
import { MaxDistanceError } from './errors/max-distance-error.js'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: -23.50278450724975,
      longitude: -46.424510041733555,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.50278450724975,
      userLongitude: -46.424510041733555,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should be not able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0)) // January 20, 2024 at 8:00 AM

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.50278450724975,
      userLongitude: -46.424510041733555,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: -23.50278450724975,
        userLongitude: -46.424510041733555,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0)) // January 20, 2024 at 8:00 AM

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.50278450724975,
      userLongitude: -46.424510041733555,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0)) // January 21, 2024 at 8:00 AM

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -23.50278450724975,
      userLongitude: -46.424510041733555,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gyms', async () => {
    gymsRepository.items.push({
      id: 'gym-2',
      title: 'JS Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.50035017110687),
      longitude: new Decimal(-46.398552363616915),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: -23.50278450724975,
        userLongitude: -46.424510041733555,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
