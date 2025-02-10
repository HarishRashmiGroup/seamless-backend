import { Migration } from '@mikro-orm/migrations';

export class Migration20250130113102 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "user_name" varchar(255) not null, "passkey" varchar(255) not null, "role" text check ("role" in ('operator', 'maintenance', 'head', 'admin')) not null, "created_at" timestamptz not null, "updated_at" timestamptz null);`);
    this.addSql(`alter table "user" add constraint "user_user_name_unique" unique ("user_name");`);
  }

}
