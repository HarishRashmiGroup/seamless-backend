import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Machine {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property({ columnType: 'decimal(5,2)', nullable: true, default: null })
    stdProdPerHr: number;

    constructor(name: string) {
        this.name = name;
    }
}