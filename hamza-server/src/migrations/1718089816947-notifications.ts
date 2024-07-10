import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notifications1718089816947 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create customer_notification table
        await queryRunner.query(`
            CREATE TABLE "customer_notification"
            (
                "id"                varchar                  NOT NULL,
                "customer_id"       varchar                  NOT NULL,
                "notification_type" varchar                  NOT NULL,
                "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at"        TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_customer_notifications_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_customer_notifications_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "customer_notification"`);
    }
}
