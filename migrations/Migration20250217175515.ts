import { Migration } from '@mikro-orm/migrations';

export class Migration20250217175515 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" add column "std_prod_mtper_hr" decimal(5,2) not null, add column "act_prod_mtper_hr" decimal(5,2) not null;`);
  }

}
