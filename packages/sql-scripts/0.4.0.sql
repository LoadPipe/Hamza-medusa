
CREATE TABLE "cached_exchange_rate" (
                "id" character varying NOT NULL,
                "to_currency_code" character varying NOT NULL,
                "from_currency_code" character varying NOT NULL,
                "rate" float NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_currency_code" UNIQUE ("from_currency_code", "to_currency_code"),
                CONSTRAINT "PK_cached_exchange_rate" PRIMARY KEY ("id"),
                CONSTRAINT "FK_to_currency_code" FOREIGN KEY ("to_currency_code") REFERENCES "currency"("code") ON DELETE CASCADE,
                CONSTRAINT "FK_from_currency_code" FOREIGN KEY ("from_currency_code") REFERENCES "currency"("code") ON DELETE CASCADE
            )