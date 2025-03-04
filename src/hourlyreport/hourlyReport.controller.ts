import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { DashboardDto, GetColorsDto, GetHourlyReportDto, GetShiftReportDto, HourlyReportDto, RecordBreakdownDto } from "./dto/hourlyReport.dto";
import { HourlyReportService } from "./hourlyReport.service";
import { GetUserFromToken, User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";
import { User as UserEntity, UserRole } from "src/users/entities/user.entity";
import { Response } from "express";

@Controller('hourly')
export class HourlyReportController {
    constructor(
        private readonly hourlyReportService: HourlyReportService
    ) { }

    @Auth()
    @Post('/prod')
    recordHourlyData(@User() id: number, @Body() dto: HourlyReportDto) {
        return this.hourlyReportService.recordHourlyData(id, dto);
    }

    @CombineAccess([UserRole.admin, UserRole.head])
    @Post('/prod/:id')
    updateHourlyData(@User() userId: number, @Param('id') id: number, @Body() dto: HourlyReportDto) {
        return this.hourlyReportService.updateHourlyData(userId, id, dto);
    }

    @Auth()
    @Post('/breakdown')
    recordBreakdown(@Body() dto: RecordBreakdownDto, @GetUserFromToken() user: UserEntity) {
        return this.hourlyReportService.recordBreakdownDetails(user, dto);
    }

    @Auth()
    @Get('/prod')
    getHourlyRecord(@Query() dto: GetHourlyReportDto, @User() id: number) {
        return this.hourlyReportService.getProductionData(id, dto.shiftId, dto.date, dto.machineId);
    }

    @Get('/shift')
    getShiftReport(@Query() dto: GetShiftReportDto) {
        return this.hourlyReportService.getShiftData(dto);
    }

    @CombineAccess([UserRole.admin, UserRole.head, UserRole.maintenance])
    @Get('/colors')
    getColors(@GetUserFromToken() user: UserEntity, @Query() dto: GetColorsDto) {
        return this.hourlyReportService.getColors(user, dto);
    }

    @Get('/dashboard')
    getDashboard(@Query() dto: DashboardDto, @Res() res: Response) {
        return this.hourlyReportService.getDashboard(dto, res);
    }
}