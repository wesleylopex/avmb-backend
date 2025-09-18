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

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        accesses: {
          select: {
            resource: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            expiresAt: true
          }
        }
      }
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    const now = new Date()

    // Filtrar acessos ainda válidos
    const validAccesses = user.accesses.filter(a => new Date(a.expiresAt) > now)

    // Remover duplicatas de recurso (se houver) e pegar o com maior expiresAt
    const resourceMap = new Map<
      string,
      { id: number; name: string; slug: string; expiresAt: Date }
    >()

    for (const access of validAccesses) {
      const { resource, expiresAt } = access
      const current = resourceMap.get(resource.slug)
      const expAt = new Date(expiresAt)

      if (!current || expAt > current.expiresAt) {
        resourceMap.set(resource.slug, {
          id: resource.id,
          name: resource.name,
          slug: resource.slug,
          expiresAt: expAt
        })
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      resources: Array.from(resourceMap.values())
    }
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
