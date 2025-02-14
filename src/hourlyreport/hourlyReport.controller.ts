import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { GetHourlyReportDto, GetShiftReportDto, HourlyReportDto, RecordBreakdownDto } from "./dto/hourlyReport.dto";
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

    @Post('prod/:id')
    updateHourlyData(@Param('id') id: number, @Body() dto: HourlyReportDto) {
        return this.hourlyReportService.updateHourlyData(id, dto);
    }

    @Post('breakdown')
    recordBreakdown(@Body() dto: RecordBreakdownDto) {
        return this.hourlyReportService.recordBreakdownDetails(dto);
    }

    @Get('/prod')
    getHourlyRecord(@Query() dto: GetHourlyReportDto) {
        return this.hourlyReportService.getProductionData(dto.shiftId, dto.date, dto.machineId);
    }

    @Get('/shift')
    getShiftReport(@Query() dto: GetShiftReportDto) {
        return this.hourlyReportService.getShiftData(dto);
    }
}