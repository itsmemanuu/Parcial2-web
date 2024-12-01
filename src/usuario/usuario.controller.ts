import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { plainToInstance } from 'class-transformer';

@Controller('usuario')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) { }

    @Post()
    async create(@Body() usuarioDto: UsuarioDto) {
        const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
        return await this.usuarioService.create(usuario);
    }

    @Get(':usuarioID')
    async findByID(@Param('usuarioID') usuarioID: string) {
        return await this.usuarioService.findByID(usuarioID);
    }

    @Delete(':usuarioID')
    @HttpCode(204)
    async delete(@Param('usuarioID') usuarioID: string) {
        return await this.usuarioService.delete(usuarioID);
    }
}
