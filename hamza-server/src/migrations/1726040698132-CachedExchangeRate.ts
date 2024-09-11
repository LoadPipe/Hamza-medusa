import { MigrationInterface, QueryRunner } from 'typeorm';

export class CachedExchangeRate1726040698132 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "cached_exchange_rate" (
                "id" character varying NOT NULL,
                "currency_code" character varying NOT NULL,
                "rate" float NOT NULL,
                "date_cached" TIMESTAMP NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_currency_code" UNIQUE ("currency_code"),
                CONSTRAINT "PK_cached_exchange_rate" PRIMARY KEY ("id"),
                CONSTRAINT "FK_currency_code" FOREIGN KEY ("currency_code") REFERENCES "currency"("code") ON DELETE CASCADE
            )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cached_exchange_rate"`);
    }
}
