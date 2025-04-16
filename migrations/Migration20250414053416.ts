import { Migration } from '@mikro-orm/migrations';

export class Migration20250414053416 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_incharge_phone_no" type varchar(255) using ("shift_incharge_phone_no"::varchar(255));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_incharge_phone_no" drop not null;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_super_visor_phone_no" type varchar(255) using ("shift_super_visor_phone_no"::varchar(255));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_super_visor_phone_no" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_incharge_phone_no" type varchar(255) using ("shift_incharge_phone_no"::varchar(255));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_incharge_phone_no" set not null;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_super_visor_phone_no" type varchar(255) using ("shift_super_visor_phone_no"::varchar(255));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "shift_super_visor_phone_no" set not null;`);
  }

}
