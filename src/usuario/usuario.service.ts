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
    ){}

    async findAll(): Promise<UsuarioEntity[]> {
        return await this.usuarioRepository.find({ relations: ['boss', 'employees', 'classes', 'bonos'] });
    }
 
    async findOne(id: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id}, relations: ['boss', 'employees', 'classes', 'bonos'] } );
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
   
        return usuario;
    }
   
    async create(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        if (usuario.role === 'Teacher'){
            if (!['ICSW', 'IMAGINE', 'COMIT'].includes(usuario.researchGroup))
                throw new BusinessLogicException("The research group is not valid", BusinessError.PRECONDITION_FAILED);
        }
        else if (usuario.role === 'Dean'){
            if (usuario.ext.toString().length == 8)
                throw new BusinessLogicException("The extension number must be 8 digits long", BusinessError.PRECONDITION_FAILED);                
        }

        return await this.usuarioRepository.save(usuario);
    }
 
    async update(id: string, usuario: UsuarioEntity): Promise<UsuarioEntity> {
        const persistedUsuario: UsuarioEntity = await this.usuarioRepository.findOne({where:{id}});
        if (!persistedUsuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
       
        usuario.id = id; 
       
        return await this.usuarioRepository.save(usuario);
    }
 
    async delete(id: string) {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where:{id}});
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.usuarioRepository.remove(usuario);
    }
}
