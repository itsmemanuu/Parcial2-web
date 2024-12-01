import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
    ) { }

    async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        if (usuario.role === 'Teacher') {
            if (!['ICSW', 'IMAGINE', 'COMIT'].includes(usuario.researchGroup))
                throw new BusinessLogicException("The research group is not valid", BusinessError.PRECONDITION_FAILED);
        }
        else if (usuario.role === 'Dean') {
            if (usuario.ext.toString().length !== 8)
                throw new BusinessLogicException("The extension number must be 8 digits long", BusinessError.PRECONDITION_FAILED);
        }

        return await this.usuarioRepository.save(usuario);
    }

    async findByID(id: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({ where: { id }, relations: ['classes', 'bonos'] });
        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);

        return usuario;
    }

    async delete(id: string) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({ where: { id }, relations: ['bonos'] });

        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);

        if (usuario.role === 'Dean')
            throw new BusinessLogicException("The usuario cannot be deleted because it's a Dean", BusinessError.PRECONDITION_FAILED);

        if (usuario.bonos.length > 0)
            throw new BusinessLogicException("The usuario cannot be deleted because it has bonos", BusinessError.PRECONDITION_FAILED);

        await this.usuarioRepository.remove(usuario);
    }
}
