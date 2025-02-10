import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HourlyEntry } from "./entities/hourlyEntry.entity";
import { BreakDown } from "./entities/breakDown.entity";
import { HourlyReportController } from "./hourlyReport.controller";
import { HourlyReportService } from "./hourlyReport.service";
import { Machine } from "../basic/entities/machine.entity";
import { BDType } from "../basic/entities/bdtype.enity";
import { Shift } from "../basic/entities/shift.entity";
import { Department } from "../basic/entities/department.entity";
import { RootCause } from "../basic/entities/rootCause.entity";

@Module({
    imports: [MikroOrmModule.forFeature([HourlyEntry, BreakDown, Machine, BDType, Shift, Department, RootCause])],
    providers: [HourlyReportService],
    controllers: [HourlyReportController]
})
export class HourlyReportModule { }