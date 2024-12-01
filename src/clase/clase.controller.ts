import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClaseDto } from './clase.dto';
import { ClaseEntity } from './clase.entity';
import { plainToInstance } from 'class-transformer';

@Controller('clase')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
    constructor(private readonly claseService: ClaseService) { }

    @Post()
    async create(@Body() claseDto: ClaseDto) {
        const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
        return await this.claseService.create(clase);
    }

    @Get(':claseID')
    async findOne(@Param('claseID') claseID: string) {
        return await this.claseService.findByID(claseID);
    }
}
