import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  updateStatus(id: number, status: 'approved' | 'rejected' | 'pending') {
    return this.prismaService.user.update({
      where: { id },
      data: { status }
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
