import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { ClaseController } from './clase.controller';
import { UsuarioEntity } from '../Usuario/usuario.entity';
import { BonoEntity } from '../bono/bono.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClaseEntity, UsuarioEntity, BonoEntity])],
    providers: [ClaseService],
    controllers: [ClaseController],
    exports: [ClaseService]
})
export class ClaseModule {}
