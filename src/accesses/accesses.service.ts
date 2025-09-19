import { Injectable } from '@nestjs/common'
import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AccessesService {
  constructor(private prismaService: PrismaService) {}

  create(createAccessDto: CreateAccessDto, grantedBy: number) {
    return this.prismaService.access.create({
      data: {
        userId: createAccessDto.userId,
        resourceId: createAccessDto.resourceId,
        grantedBy,
        expiresAt: createAccessDto.expiresAt
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        resource: true,
        grantedByUser: { select: { id: true, name: true, email: true } }
      }
    })
  }

  findAll() {
    return this.prismaService.access.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        resource: true,
        grantedByUser: { select: { id: true, name: true, email: true } }
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} access`
  }

  update(id: number, updateAccessDto: UpdateAccessDto) {
    return `This action updates a #${id} access`
  }

  remove(id: number) {
    return `This action removes a #${id} access`
  }

  revoke(id: number) {
    const revokedAt = new Date()
    return this.prismaService.access.update({
      where: { id },
      data: { revokedAt },
      include: {
        user: { select: { id: true, name: true, email: true } },
        resource: true,
        grantedByUser: { select: { id: true, name: true, email: true } }
      }
    })
  }

  accessesByUser(id: number) {
    return this.prismaService.access.findMany({
      where: { userId: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        resource: true,
        grantedByUser: { select: { id: true, name: true, email: true } }
      }
    })
  }
}
