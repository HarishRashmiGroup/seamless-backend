import { Collection, DecimalType, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Machine } from "../../basic/entities/machine.entity";
import { Shift } from "../../basic/entities/shift.entity";
import { BreakDown } from "./breakDown.entity";
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

    @Property({ nullable: true })
    shiftInchargePhoneNo: string | null;

    @Property()
    shiftSuperVisor: string;

    @Property({ nullable: true })
    shiftSuperVisorPhoneNo: string | null;

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

    @Property({ columnType: 'decimal(5,2)' })
    stdProdPerHr: number;

    @Property({ columnType: 'decimal(5,2)' })
    actProdPerHr: number;

    @Property({ columnType: 'decimal(5,2)' })
    stdProdMTPerHr: number;

    @Property({ columnType: 'decimal(5,2)' })
    actProdMTPerHr: number;

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
        actProdPerHr,
        stdProdMTPerHr,
        actProdMTPerHr
    }: {
        operatorName: string,
        operatorPhoneNo: string | null,
        shiftIncharge: string,
        shiftInchargePhoneNo: string | null,
        shiftSuperVisor: string,
        shiftSuperVisorPhoneNo: string | null,
        date: string,
        machine: Machine,
        shift: Shift,
        diaDetails: DiaDetailsRO[],
        stdProdPerHr: number,
        actProdPerHr: number,
        stdProdMTPerHr: number,
        actProdMTPerHr: number
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
        this.stdProdMTPerHr = stdProdMTPerHr;
        this.actProdMTPerHr = actProdMTPerHr;
    }

}