import { MigrationInterface, QueryRunner } from "typeorm";

export class UserWalletAndStore1708674950308 implements MigrationInterface {
  name = "UserWalletAndStore1708674950308";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`CREATE TABLE "wallet_address" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "walletAddress" character varying NOT NULL, "userId" character varying, CONSTRAINT "UQ_c86ee3052475cd979ce83c88d97" UNIQUE ("walletAddress"), CONSTRAINT "PK_65a8186afe80354699bfa8c630f" PRIMARY KEY ("id"))`);
    // await queryRunner.query(`ALTER TABLE "wallet_address" ADD CONSTRAINT "FK_5dc18be17cee71018517e1df272" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`
            ALTER TABLE "user"
                ADD COLUMN "wallet_address" VARCHAR NOT NULL DEFAULT '';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //     await queryRunner.query(`ALTER TABLE "wallet_address" DROP CONSTRAINT "FK_5dc18be17cee71018517e1df272"`);
    //     await queryRunner.query(`DROP TABLE "wallet_address"`);
    // }
    await queryRunner.query(`
            ALTER TABLE "customer"
                DROP COLUMN "wallet_address";
        `);
  }
}
