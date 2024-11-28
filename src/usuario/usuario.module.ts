import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioController } from './usuario.controller';
import { BonoEntity } from '../bono/bono.entity';
import { ClaseEntity } from '../clase/clase.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UsuarioEntity, BonoEntity, ClaseEntity])],
    providers: [UsuarioService],
    controllers: [UsuarioController],
    exports: [UsuarioService]
})
export class UsuarioModule {}
