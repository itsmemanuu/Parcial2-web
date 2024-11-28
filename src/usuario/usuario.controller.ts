import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity';
import { plainToInstance } from 'class-transformer';

@Controller('usuario')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    async findAll() {
        return await this.usuarioService.findAll();
    }

    @Get(':usuarioID')
    async findOne(@Param('usuarioID') usuarioID: string) {
        return await this.usuarioService.findOne(usuarioID);
    }

    @Post()
    async create(@Body() usuarioDto: UsuarioDto) {
        const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
        return await this.usuarioService.create(usuario);
    }

    @Put(':usuarioID')
    async update(@Param('usuarioID') usuarioID: string, @Body() usuarioDto: UsuarioDto) {
        const usuario: UsuarioEntity = plainToInstance(UsuarioEntity, usuarioDto);
        return await this.usuarioService.update(usuarioID, usuario);
    }

    @Delete(':usuarioID')
    @HttpCode(204)
    async delete(@Param('usuarioID') usuarioID: string) {
        return await this.usuarioService.delete(usuarioID);
    }
}
