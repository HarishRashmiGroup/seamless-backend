import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { HourlyEntry } from "./entities/hourlyEntry.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { BreakDown } from "./entities/breakDown.entity";
import { HourlyReportDto, RecordBreakdownDto } from "./dto/hourlyReport.dto";
import { Machine } from "src/basic/entities/machine.entity";
import { RootCause } from "src/basic/entities/rootCause.entity";
import { Shift } from "src/basic/entities/shift.entity";
import { Department } from "src/basic/entities/department.entity";
import { BDType } from "src/basic/entities/bdtype.enity";
import { ProductionDataRO } from "./ro/productionData.ro";

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
    async recordHourlyData(dto: HourlyReportDto) {
        console.log(dto);
        const [machine, shift] = await Promise.all([
            this.machineRepository.findOneOrFail({ id: dto.machineId }),
            this.shiftRepository.findOneOrFail({ id: dto.shiftId })
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
            formData: new ProductionDataRO(newEntry),
            message: `Production Data updated for shift ${shift.shift} ${shift.interval}`,
            status: 200 as const
        }
    }

    async getProductionData(shiftId: number, date: string, machineId: number) {
        console.log(shiftId, date, machineId);
        const entry = await this.hourlyEntryRepository.findOneOrFail(
            { machine: { id: machineId }, dateString: date, shift: { id: shiftId } },
            { populate: ['breakdowns', 'shift'] }
        );
        return new ProductionDataRO(entry);
    }

    async recordBreakdownDetails(dto: RecordBreakdownDto) {
        console.log(dto);
        return {
            message: `B.D ${dto.reason.slice(0, 15)}... resolved.`,
            status: 200 as const
        }
    }
}