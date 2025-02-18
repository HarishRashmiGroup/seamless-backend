import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { HourlyEntry } from "./entities/hourlyEntry.entity";
import { EntityManager, EntityRepository, wrap } from "@mikro-orm/postgresql";
import { BreakDown } from "./entities/breakDown.entity";
import { GetColorsDto, GetShiftReportDto, HourlyReportDto, RecordBreakdownDto } from "./dto/hourlyReport.dto";
import { Machine } from "src/basic/entities/machine.entity";
import { RootCause } from "src/basic/entities/rootCause.entity";
import { Shift } from "src/basic/entities/shift.entity";
import { Department } from "src/basic/entities/department.entity";
import { BDType } from "src/basic/entities/bdtype.enity";
import { ProductionDataRO, ShiftReportRowRO } from "./ro/productionData.ro";
import { User, UserRole } from "src/users/entities/user.entity";

@Injectable()
export class HourlyReportService {
    constructor(
        @InjectRepository(HourlyEntry)
        private readonly hourlyEntryRepository: EntityRepository<HourlyEntry>,

        @InjectRepository(BreakDown)
        private readonly breakDownRepository: EntityRepository<BreakDown>,

        @InjectRepository(Machine)
        private readonly machineRepository: EntityRepository<Machine>,

        @InjectRepository(RootCause)
        private readonly rootCauseRepository: EntityRepository<RootCause>,

        @InjectRepository(Shift)
        private readonly shiftRepository: EntityRepository<Shift>,

        private readonly em: EntityManager,
    ) { }
    async recordHourlyData(id: number, dto: HourlyReportDto) {
        const [machine, shift, user] = await Promise.all([
            this.machineRepository.findOneOrFail({ id: dto.machineId }),
            this.shiftRepository.findOneOrFail({ id: dto.shiftId }),
            this.em.findOneOrFail(User, { id })
        ])

        const newEntry = new HourlyEntry({
            operatorName: dto.operatorName,
            operatorPhoneNo: dto.operatorPhoneNo,
            shiftIncharge: dto.shiftIncharge,
            shiftInchargePhoneNo: dto.shiftInchargePhoneNo,
            shiftSuperVisor: dto.shiftSuperVisor,
            shiftSuperVisorPhoneNo: dto.shiftSuperVisorPhoneNo,
            date: dto.date,
            shift,
            machine,
            diaDetails: dto.diaDetails,
            actProdPerHr: dto.actProdPerHr,
            stdProdPerHr: dto.stdProdPerHr,
            stdProdMTPerHr: dto.stdProdMTPerHr,
            actProdMTPerHr: dto.actProdMTPerHr
        })

        const newBreakdowns = dto.breakdownDetails.map((bd) => {
            return new BreakDown({
                startTime: bd.startTime,
                endTime: bd.endTime,
                hourlyEntry: newEntry,
                departement: this.em.getReference(Department, bd.departmentId),
                type: this.em.getReference(BDType, bd.typeId),
                reason: bd.reason
            });
        })
        this.em.persist(newEntry);
        this.em.persist(newBreakdowns);
        await this.em.flush();
        return {
            formData: new ProductionDataRO(newEntry, user),
            message: `Production Data recorded for shift ${shift.shift} ${shift.interval}`,
            status: 200 as const
        }
    }

    async updateHourlyData(userId: number, id: number, dto: HourlyReportDto) {
        const [machine, shift, entry, user] = await Promise.all([
            this.machineRepository.findOneOrFail({ id: dto.machineId }),
            this.shiftRepository.findOneOrFail({ id: dto.shiftId }),
            this.hourlyEntryRepository.findOneOrFail({ id: id }, { populate: ['breakdowns'] }),
            this.em.findOneOrFail(User, { id: userId })
        ])
        if (entry.machine.id != dto.machineId) {
            throw new BadRequestException('Machine details can not be modified for a submitted data. Please refresh the page and try again.')
        }
        if (entry.shift.id != dto.shiftId) {
            throw new BadRequestException('Shift details can not be modified for a submitted data. Please refresh the page and try again.')
        }
        wrap(entry).assign({
            operatorName: dto.operatorName,
            operatorPhoneNo: dto.operatorPhoneNo,
            shiftIncharge: dto.shiftIncharge,
            shiftInchargePhoneNo: dto.shiftInchargePhoneNo,
            shiftSuperVisor: dto.shiftSuperVisor,
            shiftSuperVisorPhoneNo: dto.shiftSuperVisorPhoneNo,
            diaDetails: dto.diaDetails,
            actProdPerHr: dto.actProdPerHr,
            stdProdPerHr: dto.stdProdPerHr,
        });

        dto.breakdownDetails.filter((bd) => bd.id == 0).map((bd) => {
            const newbd = new BreakDown({
                startTime: bd.startTime,
                endTime: bd.endTime,
                hourlyEntry: entry,
                departement: this.em.getReference(Department, bd.departmentId),
                type: this.em.getReference(BDType, bd.typeId),
                reason: bd.reason
            });
            this.em.persist(newbd);
        });
        await this.em.flush();
        return {
            formData: new ProductionDataRO(entry, user),
            message: `Production Data updated for shift ${shift.shift} ${shift.interval}`,
            status: 200 as const
        }
    }

    async getProductionData(id: number, shiftId: number, date: string, machineId: number) {
        const [entry, shift, user] = await Promise.all([
            this.hourlyEntryRepository.findOne(
                { machine: { id: machineId }, date, shift: { id: shiftId } },
                { populate: ['breakdowns', 'shift'] }
            ),
            this.shiftRepository.findOneOrFail(
                {
                    id: shiftId
                }
            ),
            this.em.findOneOrFail(User, { id })
        ]);
        if (entry)
            return new ProductionDataRO(entry, user);
        const basicDetails = await this.hourlyEntryRepository.findOne(
            {
                machine: machineId,
                shift: { shift: shift.shift },
                dateString: date,
            },
        );
        return ({
            id: null,
            operatorName: basicDetails?.operatorName || "",
            operatorPhoneNo: basicDetails?.operatorPhoneNo || "",
            shiftIncharge: basicDetails?.shiftIncharge || "",
            shiftInchargePhoneNo: basicDetails?.shiftInchargePhoneNo || "",
            shiftSuperVisor: basicDetails?.shiftSuperVisor || "",
            shiftSuperVisorPhoneNo: basicDetails?.shiftInchargePhoneNo || "",
            diaDetails:
                [{
                    "length": null,
                    "od": null,
                    "diameter": null,
                    "thickness": null
                }],
            breakdownDetails: [],
            status: true,
            actProdPerHr: null,
            stdProdPerHr: null,
            runningMints: null,
            stdProdMTPerHr: null,
            actProdMTPerHr: null,
        })
    }

    async getShiftData(dto: GetShiftReportDto) {
        const entries = await this.hourlyEntryRepository.find({
            machine: dto.machineId,
            shift: { shift: dto.shift },
            date: new Date(dto.date)
        },
            {
                populate: ['shift', 'breakdowns'],
                orderBy: { shift: 'ASC' }
            }
        );
        if (entries.length) {
            const list = entries.map((entry) => new ShiftReportRowRO(entry));
            return ({
                message: 'Shift Report found.',
                list,
                status: 200 as const
            });
        }
        return ({
            message: 'No entries found.',
            list: [],
            status: 200 as const
        })
    }

    async recordBreakdownDetails(dto: RecordBreakdownDto) {
        const breakDown = await this.breakDownRepository.findOneOrFail({ id: dto.id });
        const tdc = dto.date && !isNaN(new Date(dto.date).getTime()) ? new Date(dto.date) : null;
        wrap(breakDown).assign({
            reason: dto.reason,
            tempSolution: dto.tempSolution,
            permanentSolution: dto.permanentSolution,
            actionPlan: dto.actionPlan,
            tdc,
            tdcString: dto.date,
            nameOfEquipment: dto.nameOfEquipment,
            purchaseIssue: dto.purchaseIssue,
            departement: this.em.getReference(Department, dto.departmentId),
            type: this.em.getReference(BDType, dto.typeId),
            rootCause: !isNaN(dto.rootCauseId) ? this.em.getReference(RootCause, dto.rootCauseId) : null
        });
        await this.em.flush();
        return {
            message: `B.D ${dto.reason.slice(0, 15)}... resolved.`,
            status: 200 as const
        }
    }

    async getColors(user: User, dto: GetColorsDto) {
        const date = new Date(dto.date);
        const entries = await this.hourlyEntryRepository.find({
            machine: dto.machineId,
            date,
        }, {
            populate: ['breakdowns', 'shift']
        }
        );
        const departments = user.department.map(department => Number(department));
        const shiftStatusMap = new Map<number, number>();
        entries.forEach(entry => {
            const relevantBreakdowns = user.role === UserRole.maintenance
                ? entry.breakdowns?.getItems()?.filter(bd => departments.includes(bd.departement?.id)) || []
                : entry.breakdowns?.getItems() || [];
            if (relevantBreakdowns.length === 0) {
                shiftStatusMap.set(entry.shift.id, 0);
            } else if (relevantBreakdowns.every(bd => bd.isApproved === true)) {
                shiftStatusMap.set(entry.shift.id, 1);
            } else {
                shiftStatusMap.set(entry.shift.id, 2);
            }
        });
        return ({
            map: Object.fromEntries(shiftStatusMap),
            message: "Status Fetch Successfully.",
            status: 200 as const
        })
    }
}