CREATE TABLE "cart_email" ( 
            "id" character varying NOT NULL,
            "email_address" character varying,
            CONSTRAINT "PK_gknmp6lnigjkskgfghssahv1dgs912" PRIMARY KEY ("id") );

ALTER TABLE "wishlist_item" ADD "variant_id" character varying;
ALTER TABLE "wishlist_item" ADD CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yi" 
FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

DELETE FROM wishlist_item;

ALTER TABLE "wishlist_item" DROP CONSTRAINT "FK_1cvf31byyh136a7744qmdt03yh";
ALTER TABLE "wishlist_item" DROP COLUMN "product_id"; 