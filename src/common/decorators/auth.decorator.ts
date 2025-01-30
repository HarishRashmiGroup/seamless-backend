import { applyDecorators, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../users/jwt-auth.guards"

export function Auth() {
    return applyDecorators(
        UseGuards(
            JwtAuthGuard
        )
    )
}