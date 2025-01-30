import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRole } from "./entities/user.entity";
import { Auth } from "../common/decorators/auth.decorator";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    newUser(@Body() dto: { userName: string, role: UserRole, passkey: string }) {
        return this.userService.newUser(dto);
    }

    @Auth()
    @Post()
    loginUser(@Body() dto: { userName: string, passkey: string }) {
        return this.userService.login(dto);
    }
}