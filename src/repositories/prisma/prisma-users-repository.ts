import { prisma } from '@/prisma'
import { UserCreateInput } from 'generated/prisma/models.js'
import { UsersRepository } from '../users-repository.js'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    }) // o unique só busca os registros que lá no schema tenham o @unique ou sejam @id
    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async create(data: UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }
}
