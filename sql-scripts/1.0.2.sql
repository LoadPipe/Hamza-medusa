CREATE TABLE "order_history" ( 
"id" character varying NOT NULL,
"order_id" character varying NOT NULL,
"title" character varying,
"to_status" character varying,
"to_payment_status" character varying,
"to_fulfillment_status" character varying,
"metadata" jsonb NOT NULL,
"created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
CONSTRAINT "PK_gknsjklsfjsfxobwv1r1dgs912" PRIMARY KEY ("id") 
)

ALTER TABLE "order_history" ADD CONSTRAINT "FK_Order_History_Order" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE
