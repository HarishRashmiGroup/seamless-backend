import { Body, Controller, Get, Post } from "@nestjs/common";
import { BasicService } from "./basic.service";
import { ShiftEnum } from "./entities/shift.entity";
import { GetShiftsDto } from "./dto/getShift.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { GetUserFromToken } from "src/common/decorators/user.decorator";
import { User } from "src/users/entities/user.entity";

@Controller('basic')
export class BasicController {
    constructor(
        private readonly basicService: BasicService,
    ) { }
    @Auth()
    @Get('machines')
    getMachines(@GetUserFromToken() user: User) {
        return this.basicService.getMachinesDropDown(user);
    }

    @Post('shifts')
    getShifts(@Body() dto: GetShiftsDto) {
        return this.basicService.getShiftsDropDown(dto.shift, dto.shiftId);
    }

    @Get('bd')
    getRootCauses() {
        return this.basicService.getBDDropDown();
    }
}