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

    async create(clase: ClaseEntity): Promise<ClaseEntity> {
        if (clase.code.length != 10)
            throw new BusinessLogicException("The code must be 10 characters long", BusinessError.PRECONDITION_FAILED);

        return await this.claseRepository.save(clase);
    }

    async findByID(ID: string): Promise<ClaseEntity> {
        const clase: ClaseEntity = await this.claseRepository.findOne({where: {id: ID}, relations: ['teacher', 'bonos']});
        if (!clase)
            throw new BusinessLogicException("The clase with the given id was not found", BusinessError.NOT_FOUND);

        return clase;
    }
}
