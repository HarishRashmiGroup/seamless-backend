import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator"
import { DiaDetails } from "./diaDetails.dto";
import { ShiftEnum } from "src/basic/entities/shift.entity";

export type ShiftData = {
    runningMints?: number;
    stdProdMTPerHr?: number;
    actProdMTPerHr?: number;
    actProdPerHr?: number;
    stdProdPerHr?: number;
};

export type MachineData = {
    [shift: string]: ShiftData;
    subtotal: ShiftData;
};

export type ResultMap = {
    [machineId: string]: MachineData;
};

export class BreakdownDetails {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    id: number;

    @IsString()
    startTime: string;

    @Transform(({ value }) => (Number(value)))
    @IsNumber()
    duration: number;

    @IsString()
    endTime: string;

    @IsString()
    reason: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    typeId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    departmentId: number;
}

export class HourlyReportDto {
    @IsString()
    operatorName: string;

    @IsString()
    operatorPhoneNo: string;

    @IsString()
    shiftIncharge: string;

    @IsString()
    shiftInchargePhoneNo: string;

    @IsString()
    shiftSuperVisor: string;

    @IsString()
    shiftSuperVisorPhoneNo: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    machineId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    shiftId: number;

    @IsString()
    date: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    actProdPerHr: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    stdProdPerHr: number;
    @Transform(({ value }) => Number(value))
    @IsNumber()
    actProdMTPerHr: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    stdProdMTPerHr: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DiaDetails)
    diaDetails: DiaDetails[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BreakdownDetails)
    breakdownDetails: BreakdownDetails[];
}

export class RecordBreakdownDto {
    @IsNumber()
    id: number;

    @IsString()
    reason: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    typeId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    departmentId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    rootCauseId: number;

    @IsString()
    tempSolution: string;

    @IsString()
    permanentSolution: string;

    @IsString()
    actionPlan: string;

    @IsString()
    purchaseIssue: string;

    @IsString()
    date: string;

    @IsString()
    nameOfEquipment: string;
}

export class GetHourlyReportDto {
    @IsString()
    date: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    shiftId: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    machineId: number;
}

export class GetShiftReportDto {
    @IsString()
    date: string;

    @IsEnum(ShiftEnum)
    shift: ShiftEnum;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    machineId: number;
}

export class GetColorsDto {
    @IsString()
    date: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    machineId: number
}

export class DashboardDto {
    @IsString()
    startDate: string;

    @IsString()
    endDate: string;
}