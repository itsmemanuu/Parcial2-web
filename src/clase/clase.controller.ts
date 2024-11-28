import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClaseDto } from './clase.dto';
import { ClaseEntity } from './clase.entity';
import { plainToInstance } from 'class-transformer';

@Controller('clase')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
    constructor(private readonly claseService: ClaseService) {}

    @Get()
    async findAll() {
        return await this.claseService.findAll();
    }

    @Get(':claseID')
    async findOne(@Param('claseID') claseID: string) {
        return await this.claseService.findOne(claseID);
    }

    @Post()
    async create(@Body() claseDto: ClaseDto) {
        const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
        return await this.claseService.create(clase);
    }

    @Put(':claseID')
    async update(@Param('claseID') claseID: string, @Body() claseDto: ClaseDto) {
        const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
        return await this.claseService.update(claseID, clase);
    }

    @Delete(':claseID')
    @HttpCode(204)
    async delete(@Param('claseID') claseID: string) {
        return await this.claseService.delete(claseID);
    }

}
