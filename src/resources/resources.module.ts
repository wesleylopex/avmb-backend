import { Module } from '@nestjs/common'
import { ResourcesService } from './resources.service'
import { ResourcesController } from './resources.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService, PrismaService]
})
export class ResourcesModule {}
