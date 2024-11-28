import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>,
    ){}

    async findAll(): Promise<ClaseEntity[]> {
        return await this.claseRepository.find({ relations: [/*TODO*/] });
    }
 
    async findOne(id: string): Promise<ClaseEntity> {
        const clase: ClaseEntity = await this.claseRepository.findOne({where: {id}, relations: [/*TODO*/] } );
        if (!clase)
          throw new BusinessLogicException("The clase with the given id was not found", BusinessError.NOT_FOUND);
   
        return clase;
    }
   
    async create(clase: ClaseEntity): Promise<ClaseEntity> {
        return await this.claseRepository.save(clase);
    }
 
    async update(id: string, clase: ClaseEntity): Promise<ClaseEntity> {
        const persistedClase: ClaseEntity = await this.claseRepository.findOne({where:{id}});
        if (!persistedClase)
          throw new BusinessLogicException("The clase with the given id was not found", BusinessError.NOT_FOUND);
       
        clase.id = id; 
       
        return await this.claseRepository.save(clase);
    }
 
    async delete(id: string) {
        const clase: ClaseEntity = await this.claseRepository.findOne({where:{id}});
        if (!clase)
          throw new BusinessLogicException("The clase with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.claseRepository.remove(clase);
    }
}
