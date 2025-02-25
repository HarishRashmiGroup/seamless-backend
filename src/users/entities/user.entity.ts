import { Entity, Enum, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Machine } from "../../basic/entities/machine.entity";

export enum UserRole {
    operator = 'operator',
    maintenance = 'maintenance',
    head = 'head',
    admin = 'admin'
};

@Entity()
export class User {
    @PrimaryKey()
    id: number;

    @Unique()
    @Property()
    userName: string;

    @Property()
    passkey: string;

    @Property({ type: 'array', default: [] })
    department: number[] = []

    @Enum(() => UserRole)
    role: UserRole;

    @ManyToOne({ entity: () => Machine, nullable: true })
    machine: Machine;

    @Property()
    createdAt: Date = new Date();

    @Property({ default: null, onUpdate: () => { new Date() } })
    updatedAt: Date | null = null;
    constructor({ userName, passkey, role }: { userName: string, passkey: string, role: UserRole }) {
        this.userName = userName;
        this.passkey = passkey;
        this.role = role;
    }
}