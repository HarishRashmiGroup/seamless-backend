import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { User } from "./users/entities/user.entity";

@Injectable()
export class UserPipe implements PipeTransform {
    constructor(private readonly em: EntityManager) { }
    async transform(id: number) {
        const user = await this.em.findOneOrFail(User, { id });
        if (!user) {
            throw new BadRequestException("User not found");
        }
        return user;
    }
}