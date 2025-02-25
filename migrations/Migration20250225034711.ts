import { Migration } from '@mikro-orm/migrations';

export class Migration20250225034711 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."user" add column "machine_id" int null;`);
    this.addSql(`alter table "seamless"."user" add constraint "user_machine_id_foreign" foreign key ("machine_id") references "seamless"."machine" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "seamless"."user" drop constraint "user_machine_id_foreign";`);
  }

}
