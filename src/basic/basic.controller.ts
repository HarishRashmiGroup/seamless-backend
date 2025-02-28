import { Body, Controller, Get, Post } from "@nestjs/common";
import { BasicService } from "./basic.service";
import { CreateDropDownDto, GetShiftsDto } from "./dto/getShift.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { GetUserFromToken } from "src/common/decorators/user.decorator";
import { User, UserRole } from "src/users/entities/user.entity";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";

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

    @CombineAccess([UserRole.maintenance, UserRole.head, UserRole.admin])
    @Post('/create-root-cause')
    createRootCauses(@Body() dto: CreateDropDownDto) {
        return this.basicService.createRootCause(dto.label);
    }
}