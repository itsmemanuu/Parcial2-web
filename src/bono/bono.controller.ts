import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BonoDto } from './bono.dto';
import { BonoEntity } from './bono.entity';
import { plainToInstance } from 'class-transformer';

@Controller('bono')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}

    @Get()
    async findAll() {
        return await this.bonoService.findAll();
    }

    @Get(':bonoID')
    async findOne(@Param('bonoID') bonoID: string) {
        return await this.bonoService.findOne(bonoID);
    }

    @Post()
    async create(@Body() bonoDto: BonoDto) {
        const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
        return await this.bonoService.create(bono);
    }

    @Put(':bonoID')
    async update(@Param('bonoID') bonoID: string, @Body() bonoDto: BonoDto) {
        const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
        return await this.bonoService.update(bonoID, bono);
    }

    @Delete(':bonoID')
    @HttpCode(404)
    async delete(@Param('bonoID') bonoID: string) {
        return await this.bonoService.delete(bonoID);
    }
}
