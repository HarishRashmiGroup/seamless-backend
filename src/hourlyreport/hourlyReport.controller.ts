import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GetHourlyReportDto, HourlyReportDto, RecordBreakdownDto } from "./dto/hourlyReport.dto";
import { HourlyReportService } from "./hourlyReport.service";

@Controller('hourly')
export class HourlyReportController {
    constructor(
        private readonly hourlyReportService: HourlyReportService
    ) { }

    @Post('prod')
    recordHourlyData(@Body() dto: HourlyReportDto) {
        return this.hourlyReportService.recordHourlyData(dto);
    }

    @Post('breakdown')
    recordBreakdown(@Body() dto: RecordBreakdownDto) {
        return this.hourlyReportService.recordBreakdownDetails(dto);
    }

    @Get('/prod')
    getHourlyRecord(@Query() dto: GetHourlyReportDto) {
        return this.hourlyReportService.getProductionData(dto.shiftId, dto.date, dto.machineId);
    }
}