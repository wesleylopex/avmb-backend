import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AccessesModule } from './accesses/accesses.module'
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [UsersModule, AuthModule, AccessesModule, ResourcesModule],
  controllers: [],
  providers: [PrismaService]
})
export class AppModule {}
