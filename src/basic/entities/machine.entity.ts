import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Machine {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}