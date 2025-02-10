import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MikroORM } from "@mikro-orm/postgresql";
import { Module } from "@nestjs/common";
import { Machine } from "./entities/machine.entity";
import { RootCause } from "./entities/rootCause.entity";
import { Shift } from "./entities/shift.entity";
import { BasicController } from "./basic.controller";
import { BasicService } from "./basic.service";
import { Department } from "./entities/department.entity";
import { BDType } from "./entities/bdtype.enity";

@Module({
    imports: [MikroOrmModule.forFeature([Machine, RootCause, Shift, Department, BDType])],
    providers: [BasicService],
    controllers: [BasicController]
})
export class BasicModule { };