import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class DiaDetails {
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    diameter: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    thickness: number;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    length: number;
}