import { Migration } from '@mikro-orm/migrations';

export class Migration20250425093701 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" add column "run_time" numeric not null default 60;`);
  }

}
