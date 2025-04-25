import { interval } from "rxjs";
import { DiaDetails } from "../dto/diaDetails.dto";
import { BreakDown } from "../entities/breakDown.entity";
import { HourlyEntry } from "../entities/hourlyEntry.entity";
import { DiaDetailsRO } from "./diaDetails.ro";
import _, { sumBy } from 'lodash';
import { orderBy } from 'lodash';
import { User, UserRole } from "src/users/entities/user.entity";

export class BreadkDownDetailsRO {
    id: number;
    startTime: string;
    endTime: string;
    reason: string;
    permanentSolution: string | null;
    tempSolution: string | null;
    actionPlan: string | null;
    purchaseIssue: string | null;
    tdc: Date | null;
    date: string | null;
    nameOfEquipment: string | null;
    typeId: number;
    departmentId: number;
    rootCauseId: number | null;
    duration: number;
    constructor(bd: BreakDown) {
        if (!bd.startTime || !bd.endTime) {
            throw new Error("Invalid startTime or endTime");
        }

        const start = new Date(`2000/01/01 ${bd.startTime}`);
        const end = new Date(`2000/01/01 ${bd.endTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid date conversion");
        }

        const duration = Math.round((end.getTime() - start.getTime()) / 60000);
        this.id = bd.id;
        this.startTime = bd.startTime;
        this.endTime = bd.endTime;
        this.reason = bd.reason;
        this.permanentSolution = bd.permanentSolution;
        this.tempSolution = bd.tempSolution;
        this.actionPlan = bd.actionPlan;
        this.purchaseIssue = bd.purchaseIssue;
        this.tdc = bd.tdc;
        this.date = bd.tdcString;
        this.typeId = bd.type?.id;
        this.departmentId = bd.departement?.id ?? null;
        this.rootCauseId = bd.rootCause?.id ?? null;
        this.duration = duration;
        this.nameOfEquipment = bd.nameOfEquipment;
    }
}

export class ProductionDataRO {
    id: number;
    operatorName: string;
    operatorPhoneNo: string;
    shiftIncharge: string;
    shiftInchargePhoneNo: string;
    shiftSuperVisorPhoneNo: string;
    shiftSuperVisor: string;
    diaDetails: DiaDetailsRO[];
    breakdownDetails: BreadkDownDetailsRO[];
    actProdPerHr: number;
    stdProdPerHr: number;
    date: string;
    machineId: number;
    shiftLetter: string;
    runningMints: number;
    status: boolean;
    runTime: number;
    stdProdMTPerHr: number;
    actProdMTPerHr: number;
    constructor(entry: HourlyEntry, user: User) {
        const departments = user.department.map(department => Number(department));
        const breakDowns = orderBy(entry.breakdowns.getItems(), ['createdAt'], ['asc']).map((bd: BreakDown) => new BreadkDownDetailsRO(bd));
        this.id = entry.id;
        this.operatorName = entry.operatorName;
        this.operatorPhoneNo = entry.operatorPhoneNo;
        this.shiftIncharge = entry.shiftIncharge;
        this.shiftInchargePhoneNo = entry.shiftInchargePhoneNo;
        this.shiftSuperVisor = entry.shiftSuperVisor;
        this.shiftSuperVisorPhoneNo = entry.shiftSuperVisorPhoneNo;
        this.diaDetails = entry.diaDetails;
        this.machineId = entry.machine.id;
        this.breakdownDetails = user.role === UserRole.maintenance ?
            breakDowns.filter((bd) => departments.includes(bd.departmentId)) : breakDowns;
        this.status = true;
        this.runTime = entry.runTime;
        this.shiftLetter = entry.shift.shift;
        this.actProdPerHr = entry.actProdPerHr;
        this.stdProdPerHr = entry.stdProdPerHr;
        this.runningMints = 60 - sumBy(breakDowns, 'duration');
        this.stdProdMTPerHr = entry.stdProdMTPerHr;
        this.actProdMTPerHr = entry.actProdMTPerHr;
    }
}

export class ShiftReportRowRO {
    operatorName: string;
    operatorPhoneNo: string;
    shiftInchargePhoneNo: string;
    shiftIncharge: string;
    shiftSuperVisor: string;
    shiftSuperVisorPhoneNo: string;
    interval: string;
    diaDetails: DiaDetailsRO[];
    stdProdPerHr: number;
    actProdPerHr: number;
    difference: number;
    runningMints: number;
    breakdowns: BreadkDownDetailsRO[];
    constructor(entry: HourlyEntry) {
        this.operatorName = entry.operatorName;
        this.operatorPhoneNo = entry.operatorPhoneNo;
        this.shiftIncharge = entry.shiftIncharge;
        this.shiftInchargePhoneNo = entry.shiftInchargePhoneNo;
        this.shiftSuperVisorPhoneNo = entry.shiftSuperVisorPhoneNo;
        this.diaDetails = entry.diaDetails;
        this.interval = entry.shift.interval;
        this.shiftSuperVisor = entry.shiftSuperVisor;
        this.stdProdPerHr = entry.stdProdPerHr;
        this.breakdowns = entry.breakdowns.getItems().map((bd) => new BreadkDownDetailsRO(bd))
        this.actProdPerHr = entry.actProdPerHr;
        this.difference = entry.stdProdPerHr - entry.actProdPerHr;
        this.runningMints = 60 - sumBy(this.breakdowns, 'duration');
    }
}