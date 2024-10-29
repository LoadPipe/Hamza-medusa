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
                CONSTRAINT "PK_okumu5lnikxobwv1rhv1dgs912" PRIMARY KEY ("id"));
                
ALTER TABLE "payment" ADD "chain_id" bigint;

UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/board-games.svg"}' where handle = 'board_games';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/gaming.svg"}' where handle = 'gaming';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/fitness.svg"}' where handle = 'fitness';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/gadgets.svg"}' where handle = 'gadgets';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/hobbies.svg"}' where handle = 'hobbies';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/electronics.svg"}' where handle = 'electronics';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/home.svg"}' where handle = 'home';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/featured.svg"}' where handle = 'featured';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/fashion.svg"}' where handle = 'fashion';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/toys.svg"}' where handle = 'toys';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/beauty.svg"}' where handle = 'beauty';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/sports-outdoors.svg"}' where handle = 'sports_outdoors';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/health.svg"}' where handle = 'health';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/automotive.svg"}' where handle = 'automotive';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/books.svg"}' where handle = 'books';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/office.svg"}' where handle = 'office';
UPDATE product_category set metadata = '{"icon_url":"https://images.hamza.market/category-icons/pets.svg"}' where handle = 'pets';


