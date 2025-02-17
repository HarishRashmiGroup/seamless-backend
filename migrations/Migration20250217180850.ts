import { Migration } from '@mikro-orm/migrations';

export class Migration20250217180850 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" add column "std_prod_mtper_hr" decimal(5,2) null default 10, add column "act_prod_mtper_hr" decimal(5,2) null default 10;`);
  }

}
