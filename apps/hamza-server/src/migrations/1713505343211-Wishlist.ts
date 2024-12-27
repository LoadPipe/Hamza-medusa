import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wishlist1713505343211 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tables
        await queryRunner.query(
            `CREATE TABLE "wishlist" ( 
            "id" character varying NOT NULL, 
            "customer_id" character varying, 
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP WITH TIME ZONE, 
            CONSTRAINT "PK_gknmp6lnikxobwv1rhv1dgs982" PRIMARY KEY ("id") )`
        );
        await queryRunner.query(
            `CREATE TABLE "wishlist_item" ( 
            "id" character varying NOT NULL, 
            "wishlist_id" character varying, 
            "variant_id" character varying, 
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "deleted_at" TIMESTAMP WITH TIME ZONE, 
             CONSTRAINT "PK_7p8joiapu4u0dxbsatkm5n1qs2" PRIMARY KEY ("wishlist_id", "variant_id") )`
        );

        // Foreign key constraints
        await queryRunner.query(
            `ALTER TABLE "wishlist" ADD CONSTRAINT "FK_5ix0u284wt3tmrlpb56ppzmxi7" 
            FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "wishlist_item" ADD CONSTRAINT "FK_vovw0ddpagwehc13uw0q8lrw2o" 
            FOREIGN KEY ("wishlist_id") REFERENCES "wishlist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "wishlist_item" ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh" 
            FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "wishlist" DROP CONSTRAINT "FK_5ix0u284wt3tmrlpb56ppzmxi7"`
        );
        await queryRunner.query(
            `ALTER TABLE "wishlist_item" DROP CONSTRAINT "FK_vovw0ddpagwehc13uw0q8lrw2o"`
        );
        await queryRunner.query(
            `ALTER TABLE "wishlist_item" DROP CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh"`
        );
        await queryRunner.query(`DROP TABLE "wishlist"`);
        await queryRunner.query(`DROP TABLE "wishlist_item"`);
    }
}
