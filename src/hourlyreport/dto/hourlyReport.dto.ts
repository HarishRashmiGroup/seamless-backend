import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsObject, IsString, ValidateNested } from "class-validator"
import { DiaDetails } from "./diaDetails.dto";


export class BreakdownDetails {
    @IsString()
    startTime: string;

    @Transform(({value}) => (Number(value)))
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
    @IsString()
    reason: string;

    @Transform(({ value }) => { Number(value) })
    typeId: number;

    @Transform(({ value }) => { Number(value) })
    departmentId: number;

    @Transform(({ value }) => { Number(value) })
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