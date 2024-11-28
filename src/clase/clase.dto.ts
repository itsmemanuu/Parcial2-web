import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class ClaseDto {
    
    @IsString()
    @IsNotEmpty()
    string: string;

    @IsUrl()
    @IsNotEmpty()
    readonly url: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    readonly date: Date;

    @IsNumber()
    @IsNotEmpty()
    readonly number: number;
}
