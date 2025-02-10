import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/core";

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
    department: string[] = []

    @Enum(() => UserRole)
    role: UserRole;

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