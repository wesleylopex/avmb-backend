import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const token: string | undefined = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      })

      request['user'] = payload

      return true
    } catch (error: unknown) {
      console.error(error)
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers['authorization']

    if (authHeader) {
      const [type, token] = authHeader.split(' ')

      if (type === 'Bearer' && token) {
        return token
      }
    }

    if (request.cookies && request.cookies['token']) {
      return String(request.cookies['token'])
    }

    return undefined
  }
}