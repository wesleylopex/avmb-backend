import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signup(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } })

    if (existing) throw new BadRequestException('Email já cadastrado')

    const hash = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({
      data: { name, email, password: hash }
    })

    return this.generateToken(user.id, user.name, user.email, user.role)
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Credenciais inválidas')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new UnauthorizedException('Credenciais inválidas')

    return this.generateToken(user.id, user.name, user.email, user.role)
  }

  private generateToken(
    userId: number,
    name: string,
    email: string,
    role: 'user' | 'admin'
  ) {
    return {
      accessToken: this.jwtService.sign({
        sub: userId,
        name,
        email,
        role
      })
    }
  }
}
