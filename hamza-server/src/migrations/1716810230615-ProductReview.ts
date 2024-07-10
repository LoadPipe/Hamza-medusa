import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductReview1716810230615 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "product_review"
             (
                 "id"          character varying NOT NULL,
                 "product_id"  character varying,
                 "title"       character varying NOT NULL,
                 "customer_id" character varying,
                 "order_id"    character varying,
                 "rating"      integer           NOT NULL,
                 "content"     character varying NOT NULL,
                 "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                 "updated_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                 "deleted_at"   TIMESTAMP WITH TIME ZONE,
                 CONSTRAINT "PK_product_review_1716810230615" PRIMARY KEY ("id")
             )`
        );

        await queryRunner.query(
            `ALTER TABLE "product_review"
                ADD CONSTRAINT "FK_5ix0u284wt3tmrlpb56ppzmxi7" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );

        await queryRunner.query(
            `ALTER TABLE "product_review"
                ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt02yh" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );

        await queryRunner.query(
            `ALTER TABLE "product_review"
                ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_review"`);
    }
}
