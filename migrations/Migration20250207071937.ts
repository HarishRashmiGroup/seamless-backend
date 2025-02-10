import { Migration } from '@mikro-orm/migrations';

export class Migration20250207071937 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "break_down" drop constraint "break_down_root_cause_id_foreign";`);

    this.addSql(`alter table "break_down" alter column "root_cause_id" type int using ("root_cause_id"::int);`);
    this.addSql(`alter table "break_down" alter column "root_cause_id" drop not null;`);
    this.addSql(`alter table "break_down" add constraint "break_down_root_cause_id_foreign" foreign key ("root_cause_id") references "root_cause" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "break_down" drop constraint "break_down_root_cause_id_foreign";`);

    this.addSql(`alter table "break_down" alter column "root_cause_id" type int using ("root_cause_id"::int);`);
    this.addSql(`alter table "break_down" alter column "root_cause_id" set not null;`);
    this.addSql(`alter table "break_down" add constraint "break_down_root_cause_id_foreign" foreign key ("root_cause_id") references "root_cause" ("id") on update cascade;`);
  }

}
