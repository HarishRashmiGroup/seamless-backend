import { DiaDetails } from "../dto/diaDetails.dto";
import { BreakDown } from "../entities/breakDown.entity";
import { HourlyEntry } from "../entities/hourlyEntry.entity";
import { DiaDetailsRO } from "./diaDetails.ro";

export class BreadkDownDetailsRO {
    startTime: string;
    endTime: string;
    reason: string;
    permanentSolution: string;
    tempSolution: string;
    actionPlan: string;
    purchaseIssue: string;
    tdc: string;
    nameOfEquipment: string;
    typeId: number;
    departmentId: number;
    rootCauseId: number;
    duration: string;
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
        this.startTime = bd.startTime;
        this.endTime = bd.endTime;
        this.reason = bd.reason;
        this.permanentSolution = bd.permanentSolution;
        this.tempSolution = bd.tempSolution;
        this.actionPlan = bd.actionPlan;
        this.purchaseIssue = bd.purchaseIssue;
        this.tdc = bd.tdcString;
        this.typeId = bd.type?.id;
        this.departmentId = bd.departement?.id;
        this.rootCauseId = bd.rootCause?.id;
        this.duration = String(duration);
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
    constructor(entry: HourlyEntry) {
        this.id = entry.id;
        this.operatorName = entry.operatorName;
        this.operatorPhoneNo = entry.operatorPhoneNo;
        this.shiftIncharge = entry.shiftIncharge;
        this.shiftInchargePhoneNo = entry.shiftInchargePhoneNo;
        this.shiftSuperVisor = entry.shiftSuperVisor;
        this.shiftSuperVisorPhoneNo = entry.shiftSuperVisorPhoneNo;
        this.diaDetails = entry.diaDetails;
        this.machineId = entry.machine.id;
        this.breakdownDetails = entry.breakdowns.getItems().map((bd) => new BreadkDownDetailsRO(bd));
        this.status = true;
        this.shiftLetter = entry.shift.shift;
        this.actProdPerHr = entry.actProdPerHr;
        this.stdProdPerHr = entry.stdProdPerHr;
        this.runningMints = 60 - this.breakdownDetails
        .map((bd) => Number(bd.duration))
        .reduce((sum, duration) => sum + duration, 0);
    }

}