import { Migration } from '@mikro-orm/migrations';

export class Migration20250217180948 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_mtper_hr" drop default;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_mtper_hr" type decimal(5,2) using ("std_prod_mtper_hr"::decimal(5,2));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_mtper_hr" set not null;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_mtper_hr" drop default;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_mtper_hr" type decimal(5,2) using ("act_prod_mtper_hr"::decimal(5,2));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_mtper_hr" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_mtper_hr" type decimal(5,2) using ("std_prod_mtper_hr"::decimal(5,2));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_mtper_hr" set default 10;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "std_prod_mtper_hr" drop not null;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_mtper_hr" type decimal(5,2) using ("act_prod_mtper_hr"::decimal(5,2));`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_mtper_hr" set default 10;`);
    this.addSql(`alter table "seamless"."hourly_entry" alter column "act_prod_mtper_hr" drop not null;`);
  }

}
