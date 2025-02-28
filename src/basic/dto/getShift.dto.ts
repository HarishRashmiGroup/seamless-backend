import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ShiftEnum } from "../entities/shift.entity";

export class GetShiftsDto {

    @IsOptional()
    @IsEnum(ShiftEnum)
    shift: ShiftEnum

    @IsOptional()
    @IsNumber()
    shiftId: number
}
export class CreateDropDownDto {
    @IsString()
    label: string;
}