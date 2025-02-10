import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRole } from "./entities/user.entity";
import { Auth } from "../common/decorators/auth.decorator";
import { CombineAccess } from "src/common/decorators/combine-access.decorator";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('sign-up')
    newUser(@Body() dto: { userName: string, role: UserRole, passkey: string }) {
        return this.userService.newUser({ userName: "harishbisu", role: UserRole.operator, passkey: "HarishBisu" });
    }

    // @CombineAccess([UserRole.admin])
    @Post('log-in')
    loginUser(@Body() dto: { userName: string, passkey: string }) {
        return this.userService.login({ userName: "harishbisu", passkey: "HarishBisu" });
    }
}