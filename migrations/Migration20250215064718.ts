import { Migration } from '@mikro-orm/migrations';

export class Migration20250215064718 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_per_hr" type decimal(5,2) using ("std_prod_per_hr"::decimal(5,2));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_per_hr" type decimal(5,2) using ("act_prod_per_hr"::decimal(5,2));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_per_hr" type decimal(4,2) using ("std_prod_per_hr"::decimal(4,2));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_per_hr" type decimal(4,2) using ("act_prod_per_hr"::decimal(4,2));`);
  }

}
