CREATE TABLE "bucky_logs"(
                "id" character varying NOT NULL,
                "timestamp" int,
                "endpoint" character varying NOT NULL,
                "input" jsonb NOT NULL,
                "output" jsonb,
                "context" jsonb, 
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_okumu5lnikxobwv1rhv1dgs912" PRIMARY KEY ("id"))
                
ALTER TABLE "payment" ADD "chain_id" bigint
