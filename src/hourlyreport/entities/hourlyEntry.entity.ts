import { Collection, DecimalType, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Machine } from "../../basic/entities/machine.entity";
import { Shift } from "../../basic/entities/shift.entity";
import { BreakDown } from "./breakDown.entity";
import { DiaDetails } from "../dto/diaDetails.dto";
import { DiaDetailsRO } from "../ro/diaDetails.ro";

@Entity()
export class HourlyEntry {
    @PrimaryKey()
    id: number;

    @Property()
    operatorName: string;

    @Property()
    operatorPhoneNo: string;

    @Property()
    shiftIncharge: string;

    @Property()
    shiftInchargePhoneNo: string

    @Property()
    shiftSuperVisor: string;

    @Property()
    shiftSuperVisorPhoneNo: string;

    @ManyToOne(() => Machine)
    machine: Machine;

    @ManyToOne(() => Shift)
    shift: Shift;

    @Property({ columnType: 'jsonb' })
    diaDetails: DiaDetailsRO[];

    @Property({ columnType: 'date' })
    date: Date;

    @Property()
    dateString: string;

    @OneToMany({ entity: () => BreakDown, mappedBy: 'hourlyEntry' })
    breakdowns = new Collection<BreakDown>(this);

    @Property({ columnType: 'decimal(4,2)' })
    stdProdPerHr: number;

    @Property({ columnType: 'decimal(4,2)' })
    actProdPerHr: number;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date | null;

    constructor({
        operatorName,
        operatorPhoneNo,
        shiftIncharge,
        shiftInchargePhoneNo,
        shiftSuperVisor,
        shiftSuperVisorPhoneNo,
        date,
        machine,
        shift,
        diaDetails,
        stdProdPerHr,
        actProdPerHr
    }: {
        operatorName: string,
        operatorPhoneNo: string,
        shiftIncharge: string,
        shiftInchargePhoneNo: string,
        shiftSuperVisor: string,
        shiftSuperVisorPhoneNo: string,
        date: string,
        machine: Machine,
        shift: Shift,
        diaDetails: DiaDetailsRO[],
        stdProdPerHr: number,
        actProdPerHr: number
    }) {
        this.operatorName = operatorName;
        this.operatorPhoneNo = operatorPhoneNo;
        this.shiftIncharge = shiftIncharge;
        this.shiftInchargePhoneNo = shiftInchargePhoneNo;
        this.shiftSuperVisor = shiftSuperVisor;
        this.shiftSuperVisorPhoneNo = shiftSuperVisorPhoneNo;
        this.date = new Date(date);
        this.dateString = date;
        this.shift = shift;
        this.machine = machine;
        this.diaDetails = diaDetails;
        this.stdProdPerHr = stdProdPerHr;
        this.actProdPerHr = actProdPerHr;
    }

}