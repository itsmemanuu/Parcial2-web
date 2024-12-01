import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { BonoDto } from './bono.dto';
import { BonoEntity } from './bono.entity';
import { plainToInstance } from 'class-transformer';

@Controller('bono')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) { }

    @Post()
    async create(@Body() bonoDto: BonoDto) {
        const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
        return await this.bonoService.create(bono);
    }

    @Get('classcode/:classCode')
    async findByClassCode(@Param('classCode') bonoID: string) {
        return await this.bonoService.findByClassCode(bonoID);
    }

    @Get('teacherID/:userID')
    async findByUser(@Param('userID') bonoID: string) {
        return await this.bonoService.findByUser(bonoID);
    }
    
    @Delete(':bonoID')
    @HttpCode(204)
    async delete(@Param('bonoID') bonoID: string) {
        return await this.bonoService.delete(bonoID);
    }
}
