import { Migration } from '@mikro-orm/migrations';

export class Migration20250201105134 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "machine" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "root_cause" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "shift" ("id" serial primary key, "shift" text check ("shift" in ('A', 'B', 'C')) not null, "interval" varchar(255) not null);`);

    this.addSql(`create table "hourly_entry" ("id" serial primary key, "operator_name" varchar(255) not null, "operator_phone_no" varchar(255) not null, "shift_incharge" varchar(255) not null, "shift_incharge_no" varchar(255) not null, "shift_super_visor" varchar(255) not null, "shift_super_visor_phone_no" varchar(255) not null, "machine_id" int not null, "shift_id" int not null, "dia_details" jsonb not null, "date" date not null);`);

    this.addSql(`create table "break_down" ("id" serial primary key, "start_time" time not null, "end_time" time not null, "reason" text not null, "temp_solution" text not null, "permanent_solution" text not null, "action_plan" text not null, "purchase_issue" text not null, "tdc" date not null, "is_approved" boolean not null default false, "hourly_entry_id" int not null);`);

    this.addSql(`alter table "hourly_entry" add constraint "hourly_entry_machine_id_foreign" foreign key ("machine_id") references "machine" ("id") on update cascade;`);
    this.addSql(`alter table "hourly_entry" add constraint "hourly_entry_shift_id_foreign" foreign key ("shift_id") references "shift" ("id") on update cascade;`);

    this.addSql(`alter table "break_down" add constraint "break_down_hourly_entry_id_foreign" foreign key ("hourly_entry_id") references "hourly_entry" ("id") on update cascade;`);

    this.addSql(`alter table "user" add column "department" text[] not null default '{}';`);
  }

}
