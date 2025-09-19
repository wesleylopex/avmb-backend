import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common'
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { AccessesService } from './accesses.service'
import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { JwtPayload } from './jwt-payload.interface'

@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createAccess: CreateAccessDto,
    @Req() req: Request & { user: JwtPayload }
  ) {
    const grantedBy = +req.user.userId

    const expiresAt = new Date(createAccess.expiresAt).toISOString().toString()

    return this.accessesService.create(
      {
        ...createAccess,
        expiresAt: expiresAt
      },
      grantedBy
    )
  }

  @Get()
  findAll() {
    return this.accessesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
    return this.accessesService.update(+id, updateAccessDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessesService.remove(+id)
  }

  @Post('revoke/:id')
  revoke(@Param('id') id: number) {
    return this.accessesService.revoke(+id)
  }

  @Get('user/:id')
  accessesByUser(@Param('id') id: number) {
    return this.accessesService.accessesByUser(+id)
  }
}
