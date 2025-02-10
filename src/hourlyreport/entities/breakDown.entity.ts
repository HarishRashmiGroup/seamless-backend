import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { HourlyEntry } from "./hourlyEntry.entity";
import { Department } from "../../basic/entities/department.entity";
import { RootCause } from "../../basic/entities/rootCause.entity";
import { DiaDetailsRO } from "../ro/diaDetails.ro";
import { BDType } from "../../basic/entities/bdtype.enity";

@Entity()
export class BreakDown {
    @PrimaryKey()
    id: number;

    @Property({ columnType: 'time' })
    startTime: string;

    @Property({ columnType: 'time' })
    endTime: string;

    @ManyToOne(() => Department)
    departement: Department;

    @ManyToOne({ entity: () => RootCause, nullable: true, default: null })
    rootCause: RootCause;

    @Property({ columnType: 'text' })
    reason: string;

    @Property({ default: null, nullable: true })
    nameOfEquipment: string;

    @Property({ columnType: 'text', nullable: true, default: null })
    tempSolution: string;

    @Property({ columnType: 'text', nullable: true, default: null })
    permanentSolution: string;

    @Property({ columnType: 'text', nullable: true, default: null })
    actionPlan: string;

    @Property({ columnType: 'text', nullable: true, default: null })
    purchaseIssue: string;

    @Property({ columnType: 'date', nullable: true, default: null })
    tdc: Date | null;

    @Property({ nullable: true, default: null })
    tdcString: string | null;

    @Property({ columnType: 'boolean', default: false })
    isApproved: Boolean;

    @ManyToOne(() => HourlyEntry)
    hourlyEntry: HourlyEntry;

    @ManyToOne(() => BDType)
    type: BDType;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date })
    updatedAt: Date | null;

    constructor({
        startTime,
        endTime,
        departement,
        rootCause,
        hourlyEntry,
        type,
        reason,
        tempSolution,
        permanentSolution,
        purchaseIssue,
        actionPlan,
        tdc,
        isApproved,
    }: {
        startTime: string,
        endTime: string,
        departement: Department,
        reason: string,
        hourlyEntry: HourlyEntry,
        type: BDType,
        tempSolution?: string,
        permanentSolution?: string,
        purchaseIssue?: string,
        rootCause?: RootCause,
        actionPlan?: string,
        tdc?: string,
        isApproved?: boolean,
    }) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.departement = departement;
        this.rootCause = rootCause;
        this.reason = reason;
        this.hourlyEntry = hourlyEntry;
        this.type = type;
        this.tempSolution = tempSolution ?? null;
        this.permanentSolution = permanentSolution ?? null;
        this.purchaseIssue = purchaseIssue ?? null;
        this.actionPlan = actionPlan ?? null;
        this.tdc = tdc ? new Date(tdc) : null;
        this.tdcString = tdc ?? null;
        this.isApproved = isApproved ?? false;
    }
}