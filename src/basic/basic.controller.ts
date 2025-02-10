import { Body, Controller, Get, Post } from "@nestjs/common";
import { BasicService } from "./basic.service";
import { ShiftEnum } from "./entities/shift.entity";
import { GetShiftsDto } from "./dto/getShift.dto";

@Controller('basic')
export class BasicController {
    constructor(
        private readonly basicService: BasicService,
    ) { }
    @Get('machines')
    getMachines() {
        return this.basicService.getMachinesDropDown();
    }

    @Post('shifts')
    getShifts(@Body() dto: GetShiftsDto) {
        return this.basicService.getShiftsDropDown(dto.shift,dto.shiftId);
    }

    @Get('bd')
    getRootCauses() {
        return this.basicService.getBDDropDown();
    }
}