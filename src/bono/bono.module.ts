import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { BonoController } from './bono.controller';
import { UsuarioEntity } from '../Usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BonoEntity, UsuarioEntity, ClaseEntity])],
    providers: [BonoService],
    controllers: [BonoController],
    exports: [BonoService]
})
export class BonoModule {}
