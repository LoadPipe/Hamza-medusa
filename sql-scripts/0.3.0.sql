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

UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/board-games.svg"}' where id = 'board_games';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/gaming.svg"}' where id = 'gaming';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/fitness.svg"}' where id = 'fitness';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/gadgets.svg"}' where id = 'gadgets';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/hobbies.svg"}' where id = 'hobbies';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/electronics.svg"}' where id = 'electronics';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/home.svg"}' where id = 'home';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/featured.svg"}' where id = 'featured';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/fashion.svg"}' where id = 'fashion';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/toys.svg"}' where id = 'toys';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/beauty.svg"}' where id = 'beauty';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/sports-outdoors.svg"}' where id = 'sports_outdoors';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/health.svg"}' where id = 'health';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/automotive.svg"}' where id = 'automotive';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/books.svg"}' where id = 'books';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/office.svg"}' where id = 'office';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.biz/category-icons/pets.svg"}' where id = 'pets';