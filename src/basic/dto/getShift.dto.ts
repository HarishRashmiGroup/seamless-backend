import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { ShiftEnum } from "../entities/shift.entity";

export class GetShiftsDto {

    @IsOptional()
    @IsEnum(ShiftEnum)
    shift: ShiftEnum

    @IsOptional()
    @IsNumber()
    shiftId: number
}