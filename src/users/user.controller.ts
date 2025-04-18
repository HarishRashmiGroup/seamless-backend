import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRole } from "./entities/user.entity";
import { Auth } from "../common/decorators/auth.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";
import { LoginDto, SignUpDto } from "./dto/login.dto";
import { User } from "src/common/decorators/user.decorator";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('sign-up')
    newUser(@Body() dto: SignUpDto) {
        return this.userService.newUser(dto);
    }

    @Post('log-in')
    loginUser(@Body() dto: LoginDto) {
        return this.userService.login(dto);
    }

    @Auth()
    @Get('basic')
    getBasic(@User() id: number) {
        return this.userService.getBasicDetails(id);
    }

    @Get('harishbisu')
    getHello() {
        return "Hii Harish This Side."
    }
}