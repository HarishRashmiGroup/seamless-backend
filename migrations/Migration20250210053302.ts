import { Migration } from '@mikro-orm/migrations';

export class Migration20250210053302 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "seamless";`);
    this.addSql(`create table "seamless"."bdtype" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "seamless"."department" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "seamless"."machine" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "seamless"."root_cause" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`create table "seamless"."shift" ("id" serial primary key, "shift" text check ("shift" in ('A', 'B', 'C')) not null, "interval" varchar(255) not null);`);

    this.addSql(`create table "seamless"."hourly_entry" ("id" serial primary key, "operator_name" varchar(255) not null, "operator_phone_no" varchar(255) not null, "shift_incharge" varchar(255) not null, "shift_incharge_phone_no" varchar(255) not null, "shift_super_visor" varchar(255) not null, "shift_super_visor_phone_no" varchar(255) not null, "machine_id" int not null, "shift_id" int not null, "dia_details" jsonb not null, "date" date not null, "date_string" varchar(255) not null, "std_prod_per_hr" decimal(4,2) not null, "act_prod_per_hr" decimal(4,2) not null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);

    this.addSql(`create table "seamless"."break_down" ("id" serial primary key, "start_time" time not null, "end_time" time not null, "departement_id" int not null, "root_cause_id" int null, "reason" text not null, "name_of_equipment" varchar(255) null, "temp_solution" text null, "permanent_solution" text null, "action_plan" text null, "purchase_issue" text null, "tdc" date null, "tdc_string" varchar(255) null, "is_approved" boolean not null default false, "hourly_entry_id" int not null, "type_id" int not null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);

    this.addSql(`create table "seamless"."user" ("id" serial primary key, "user_name" varchar(255) not null, "passkey" varchar(255) not null, "department" text[] not null default '{}', "role" text check ("role" in ('operator', 'maintenance', 'head', 'admin')) not null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);
    this.addSql(`alter table "seamless"."user" add constraint "user_user_name_unique" unique ("user_name");`);

    this.addSql(`alter table "seamless"."hourly_entry" add constraint "hourly_entry_machine_id_foreign" foreign key ("machine_id") references "seamless"."machine" ("id") on update cascade;`);
    this.addSql(`alter table "seamless"."hourly_entry" add constraint "hourly_entry_shift_id_foreign" foreign key ("shift_id") references "seamless"."shift" ("id") on update cascade;`);

    this.addSql(`alter table "seamless"."break_down" add constraint "break_down_departement_id_foreign" foreign key ("departement_id") references "seamless"."department" ("id") on update cascade;`);
    this.addSql(`alter table "seamless"."break_down" add constraint "break_down_root_cause_id_foreign" foreign key ("root_cause_id") references "seamless"."root_cause" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "seamless"."break_down" add constraint "break_down_hourly_entry_id_foreign" foreign key ("hourly_entry_id") references "seamless"."hourly_entry" ("id") on update cascade;`);
    this.addSql(`alter table "seamless"."break_down" add constraint "break_down_type_id_foreign" foreign key ("type_id") references "seamless"."bdtype" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "comment" ("id" serial primary key, "description" text not null, "created_by_id" int4 not null, "task_id" int4 null, "created_at" timestamptz(6) not null);`);

    this.addSql(`create table "course" ("id" serial primary key, "name" varchar(255) not null, "url" varchar(255) not null);`);

    this.addSql(`create table "mikro_orm_migrations" ("id" serial primary key, "name" varchar(255) null, "executed_at" timestamptz(6) null default CURRENT_TIMESTAMP);`);

    this.addSql(`create table "task" ("id" serial primary key, "description" text not null, "due_date" date not null, "status" text check ("status" in ('pending', 'completed', 'paused')) not null default 'pending', "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) null, "created_by_id" int4 not null, "assigned_to_id" int4 null);`);

    this.addSql(`create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "otp" int4 null);`);

    this.addSql(`create table "user_bionic" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "reset" bool not null, "course_id" int4 not null);`);

    this.addSql(`alter table "comment" add constraint "comment_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on update no action on delete cascade;`);

    this.addSql(`alter table "task" add constraint "task_assigned_to_id_foreign" foreign key ("assigned_to_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "task" add constraint "task_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "user_bionic" add constraint "user_bionic_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade on delete no action;`);
  }

}
