import { Module } from '@nestjs/common'
import { AccessesService } from './accesses.service'
import { AccessesController } from './accesses.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [AccessesController],
  providers: [AccessesService, PrismaService]
})
export class AccessesModule {}
