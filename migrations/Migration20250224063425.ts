import { Migration } from '@mikro-orm/migrations';

export class Migration20250224063425 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "seamless"."machine" add column "std_prod_per_hr" decimal(5,2) null;`);
  }

}
