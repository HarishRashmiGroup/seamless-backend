import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

export enum ShiftEnum {
    A = 'A',
    B = 'B',
    C = 'C'
}

@Entity()
export class Shift {
    @PrimaryKey()
    id: number;

    @Enum(() => ShiftEnum)
    shift: ShiftEnum

    @Property()
    interval: string;

    constructor(shift: ShiftEnum, interval: string) {
        this.shift = shift;
        this.interval = interval;
    }

}