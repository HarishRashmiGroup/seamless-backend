import { Migration } from '@mikro-orm/migrations';

export class Migration20250207081944 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "break_down" add column "name_of_equipment" varchar(255) null;`);
  }

}
