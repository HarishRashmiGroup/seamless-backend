import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Machine } from "./entities/machine.entity";
import { EntityManager, EntityRepository, FilterQuery } from "@mikro-orm/postgresql";
import { RootCause } from "./entities/rootCause.entity";
import { Shift, ShiftEnum } from "./entities/shift.entity";
import { BDType } from "./entities/bdtype.enity";
import { Department } from "./entities/department.entity";
import { User, UserRole } from "src/users/entities/user.entity";

@Injectable()
export class BasicService {
    constructor(
        @InjectRepository(Machine)
        private readonly machineRepository: EntityRepository<Machine>,

        @InjectRepository(RootCause)
        private readonly rootCauseRepository: EntityRepository<RootCause>,

        @InjectRepository(BDType)
        private readonly bdTypeRepository: EntityRepository<BDType>,

        @InjectRepository(Department)
        private readonly departmentRepository: EntityRepository<Department>,

        @InjectRepository(Shift)
        private readonly shiftRepository: EntityRepository<Shift>,

        private readonly em: EntityManager,
    ) { }
    async getMachinesDropDown(user: User) {
        if (user.role === UserRole.operator || user.role === UserRole.maintenance) {
            const machine = await this.machineRepository.findOneOrFail({ id: user.machine.id });
            return ([{
                id: machine.id,
                label: machine.name
            }]);
        }
        const machines = await this.machineRepository.find({ id: { $ne: 0 } }, { orderBy: { id: 'ASC' } });
        return machines.map((machine) => ({
            id: machine.id,
            label: machine.name
        }));
    }

    async getShiftsDropDown(shift?: ShiftEnum, shiftId?: number) {
        const reqShift = isNaN(shiftId) ? null : await this.shiftRepository.findOne({ id: shiftId }, { orderBy: { id: 'ASC' } });
        const options: FilterQuery<Shift> = {};
        if (reqShift) options.shift = reqShift.shift;
        else if (shift) options.shift = shift;
        else options.shift = ShiftEnum.A;
        const shifts = await this.shiftRepository.find(options);
        return (shifts.map((s) => ({
            id: s.id,
            label: s.interval,
            shift: s.shift
        })));
    }

    async createRootCause(label: string) {
        const newEntry = new RootCause(label);
        await this.em.persistAndFlush(newEntry);
        return ({
            id: newEntry.id,
            label: newEntry.name
        })
    }

    async getBDDropDown() {
        const [rootCauses, types, departments] = await Promise.all([
            this.rootCauseRepository.find({ id: { $ne: 0 } }),
            this.bdTypeRepository.find({ id: { $ne: 0 } }),
            this.departmentRepository.find({ id: { $ne: 0 } })
        ]);
        const a = rootCauses.map((rootCause) => ({
            id: rootCause.id,
            label: rootCause.name
        }));
        const b = types.map((type) => ({
            id: type.id,
            label: type.name
        }));
        const c = departments.map((d) => ({
            id: d.id,
            label: d.name
        }));
        return ({
            rootCauses: a,
            types: b,
            departments: c
        })
    }
}