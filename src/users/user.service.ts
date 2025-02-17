import { InjectRepository } from "@mikro-orm/nestjs";
import { HttpCode, Injectable } from "@nestjs/common";
import { User, UserRole } from "./entities/user.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,

        private readonly jwtService: JwtService,

        private readonly em: EntityManager,
    ) { }
    async getUserById(id: number) {
        const user = await this.userRepository.findOneOrFail({ id });
        return ({
            id: user.id,
            userName: user.userName,
            role: user.role
        })
    }

    async newUser({ userName, passkey, role }: { userName: string, passkey: string, role: UserRole }) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        console.log(passkey)
        const hashedPassword = await bcrypt.hash(passkey, salt);
        const user = new User({ userName, passkey: hashedPassword, role: role === UserRole.admin ? UserRole.operator : role });
        await this.em.persistAndFlush(user);
        return (
            {
                message: 'User ceration done.',
                status: 201 as const
            }
        )
    }

    async login({ userName, passkey }: { userName: string, passkey: string }) {
        const user = await this.userRepository.findOneOrFail({ userName });

        const isPasswordValid = await bcrypt.compare(passkey, user.passkey);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const payload = {
            id: user.id,
            userName: user.userName,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            status: 200 as const,
            token,
        };
    }

    async getBasicDetails(id: number) {
        const user = await this.userRepository.findOneOrFail(id);
        return ({
            department: user.department,
            role: user.role,
            name: user.userName,
        })
    }

}