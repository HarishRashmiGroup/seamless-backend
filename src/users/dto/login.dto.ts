import { IsEnum, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class LoginDto {
    @IsString()
    userName: string;

    @IsString()
    passkey: string;
}

export class SignUpDto {
    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    userName: string;

    @IsString()
    passkey: string;
}