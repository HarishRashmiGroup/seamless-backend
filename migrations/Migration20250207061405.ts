import { Migration } from '@mikro-orm/migrations';

export class Migration20250207061405 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "bdtype" ("id" serial primary key, "name" varchar(255) not null);`);

    this.addSql(`alter table "break_down" add column "type_id" int not null;`);
    this.addSql(`alter table "break_down" alter column "temp_solution" type text using ("temp_solution"::text);`);
    this.addSql(`alter table "break_down" alter column "temp_solution" drop not null;`);
    this.addSql(`alter table "break_down" alter column "permanent_solution" type text using ("permanent_solution"::text);`);
    this.addSql(`alter table "break_down" alter column "permanent_solution" drop not null;`);
    this.addSql(`alter table "break_down" alter column "action_plan" type text using ("action_plan"::text);`);
    this.addSql(`alter table "break_down" alter column "action_plan" drop not null;`);
    this.addSql(`alter table "break_down" alter column "purchase_issue" type text using ("purchase_issue"::text);`);
    this.addSql(`alter table "break_down" alter column "purchase_issue" drop not null;`);
    this.addSql(`alter table "break_down" alter column "tdc" type date using ("tdc"::date);`);
    this.addSql(`alter table "break_down" alter column "tdc" drop not null;`);
    this.addSql(`alter table "break_down" alter column "tdc_string" type varchar(255) using ("tdc_string"::varchar(255));`);
    this.addSql(`alter table "break_down" alter column "tdc_string" drop not null;`);
    this.addSql(`alter table "break_down" add constraint "break_down_type_id_foreign" foreign key ("type_id") references "bdtype" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "break_down" alter column "temp_solution" type text using ("temp_solution"::text);`);
    this.addSql(`alter table "break_down" alter column "temp_solution" set not null;`);
    this.addSql(`alter table "break_down" alter column "permanent_solution" type text using ("permanent_solution"::text);`);
    this.addSql(`alter table "break_down" alter column "permanent_solution" set not null;`);
    this.addSql(`alter table "break_down" alter column "action_plan" type text using ("action_plan"::text);`);
    this.addSql(`alter table "break_down" alter column "action_plan" set not null;`);
    this.addSql(`alter table "break_down" alter column "purchase_issue" type text using ("purchase_issue"::text);`);
    this.addSql(`alter table "break_down" alter column "purchase_issue" set not null;`);
    this.addSql(`alter table "break_down" alter column "tdc" type date using ("tdc"::date);`);
    this.addSql(`alter table "break_down" alter column "tdc" set not null;`);
    this.addSql(`alter table "break_down" alter column "tdc_string" type varchar(255) using ("tdc_string"::varchar(255));`);
    this.addSql(`alter table "break_down" alter column "tdc_string" set not null;`);
  }

}
