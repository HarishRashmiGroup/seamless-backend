import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class DiaDetails {
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    diameter: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    thickness: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    nos: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    length: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    outputLength: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    outputThickness: number;

    @IsOptional()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    outputDiameter: number;
}