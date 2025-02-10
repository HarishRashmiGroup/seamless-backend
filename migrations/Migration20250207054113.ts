import { Migration } from '@mikro-orm/migrations';

export class Migration20250207054113 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "department" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`alter table "hourly_entry" add column "date_string" varchar(255) not null, add column "std_prod_per_hr" decimal(4,2) not null, add column "act_prod_per_hr" decimal(4,2) not null, add column "created_at" timestamptz not null, add column "updated_at" timestamptz null;`);
    this.addSql(`alter table "hourly_entry" rename column "shift_incharge_no" to "shift_incharge_phone_no";`);

    this.addSql(`alter table "break_down" add column "departement_id" int not null, add column "root_cause_id" int not null, add column "tdc_string" varchar(255) not null, add column "created_at" timestamptz not null, add column "updated_at" timestamptz null;`);
    this.addSql(`alter table "break_down" add constraint "break_down_departement_id_foreign" foreign key ("departement_id") references "department" ("id") on update cascade;`);
    this.addSql(`alter table "break_down" add constraint "break_down_root_cause_id_foreign" foreign key ("root_cause_id") references "root_cause" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "break_down" drop constraint "break_down_root_cause_id_foreign";`);

    this.addSql(`alter table "hourly_entry" rename column "shift_incharge_phone_no" to "shift_incharge_no";`);
  }

}
