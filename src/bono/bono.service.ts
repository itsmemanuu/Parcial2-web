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
    ) { }

    async create(bono: BonoEntity): Promise<BonoEntity> {
        if (bono.amount <= 0)
            throw new BusinessLogicException("The amount must be greater than 0", BusinessError.PRECONDITION_FAILED);

        if (bono.user.role !== 'Teacher')
            throw new BusinessLogicException("The user must be a teacher", BusinessError.PRECONDITION_FAILED);

        return await this.bonoRepository.save(bono);
    }

    async findByClassCode(code: string): Promise<BonoEntity[]> {
        const bonos: BonoEntity[] = await this.bonoRepository.find({ relations: ['class', 'user'], where: { class: { code: code } } });

        if (!bonos)
            throw new BusinessLogicException("The bonos with the given class code were not found", BusinessError.NOT_FOUND);

        return bonos;
    }

    async findByUser(userID: string): Promise<BonoEntity[]> {
        const bonos: BonoEntity[] = await this.bonoRepository.find({ relations: ['user', 'class'], where: { user: { id: userID } } });
        if (!bonos)
            throw new BusinessLogicException("The bonos with the given user id were not found", BusinessError.NOT_FOUND);

        return bonos;
    }

    async delete(id: string) {
        const bono: BonoEntity = await this.bonoRepository.findOne({ where: { id } });
        if (!bono)
            throw new BusinessLogicException("The bono with the given id was not found", BusinessError.NOT_FOUND);

        if (bono.grade > 4)
            throw new BusinessLogicException("The bono cannot be deleted because it has a grade greater than 4", BusinessError.PRECONDITION_FAILED);

        await this.bonoRepository.remove(bono);
    }
}