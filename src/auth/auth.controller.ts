import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { JwtPayload } from 'src/accesses/jwt-payload.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.authService.signup(name, email, password)
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password)
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: Request & { user: JwtPayload }) {
    const userId = +req.user.userId
    return this.authService.getMe(userId)
  }
}
