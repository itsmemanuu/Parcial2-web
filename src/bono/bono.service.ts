import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>,
    ){}

    async findAll(): Promise<BonoEntity[]> {
        return await this.bonoRepository.find({ relations: [/*TODO*/] });
    }
 
    async findOne(id: string): Promise<BonoEntity> {
        const bono: BonoEntity = await this.bonoRepository.findOne({where: {id}, relations: [/*TODO*/] } );
        if (!bono)
          throw new BusinessLogicException("The bono with the given id was not found", BusinessError.NOT_FOUND);
   
        return bono;
    }
   
    async create(bono: BonoEntity): Promise<BonoEntity> {
        if (bono.amount <= 0)
            throw new BusinessLogicException("The amount must be greater than 0", BusinessError.PRECONDITION_FAILED);
        return await this.bonoRepository.save(bono);
    }
 
    async update(id: string, bono: BonoEntity): Promise<BonoEntity> {
        const persistedBono: BonoEntity = await this.bonoRepository.findOne({where:{id}});
        if (!persistedBono)
          throw new BusinessLogicException("The bono with the given id was not found", BusinessError.NOT_FOUND);
       
        bono.id = id; 
       
        return await this.bonoRepository.save(bono);
    }
 
    async delete(id: string) {
        const bono: BonoEntity = await this.bonoRepository.findOne({where:{id}});
        if (!bono)
          throw new BusinessLogicException("The bono with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.bonoRepository.remove(bono);
    }
}