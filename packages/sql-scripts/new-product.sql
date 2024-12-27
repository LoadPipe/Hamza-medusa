
-- ADD THE BASE PRODUCT
insert into product (id, title, subtitle, description, handle, thumbnail, status, store_id) 
values (
    'prod_MY_PRODUCT_ID', 
    'iPhone 15 New with Box', 
    'The iPhone 15 sets a new standard in the smartphone industry. With unparalleled processing power, a high-definition camera, and innovative design, it promises a sophisticated and seamless mobile experience.', 
    '<p><b>Unmatched Performance:</b> Powered by the A16 Bionic chip, the iPhone 15 delivers lightning-fast processing and graphics performance, making multitasking and gaming seamless.</p>
<br/>
<p><b>Stunning Display:</b> Enjoy breathtaking visuals on the 6.1" Super Retina XDR OLED display with a resolution of 2556-by-1179 pixels, ensuring vibrant colors and sharp details.</p>
<br/>
', 
    'iphone-15', 
    'https://static.snapchum.com/SC020/main-plain.png', 
    'draft', 
    'STORE_ID'
);


-- ADD THE VARIANTS
insert into product_variant (id, title, , inventory_quantity, manage_inventory, metadata)
values ('variant_MY_PRODUCT_ID', 'iPhone 15 - 128', 'prod_MY_PRODUCT_ID', 
20, true, '{"imgUrl": "https://static.snapchum.com/SC020/main-plain.png"}'::jsonb );

-- ADD THE OPTIONS & OPTION VALUES
insert into product_option (id, title, product_id) 
values ('opt_MY_PRODUCT_ID', 'Model', 'prod_MY_PRODUCT_ID');

insert into product_option_value (id, value, option_id, variant_id) values (
    'optval_MY_PRODUCT_ID', 'iPhone 15 - 128', 'opt_MY_PRODUCT_ID', 'variant_MY_PRODUCT_ID'
);


--ADD PRICES
insert into money_amount (id, currency_code, amount) values (
    'ma_MY_PRODUCT_ID_usdc', 'usdc', 67500
);
insert into money_amount (id, currency_code, amount ) values (
    'ma_MY_PRODUCT_ID_usdt', 'usdt', 67500
);
insert into money_amount (id, currency_code, amount ) values (
    'ma_MY_PRODUCT_ID_eth', 'eth', 67500
);

insert into product_variant_money_amount (id, money_amount_id, variant_id) values (
    'pvma_MY_PRODUCT_ID_usdt',
    'ma_MY_PRODUCT_ID_usdt',
    'variant_MY_PRODUCT_ID'
);
insert into product_variant_money_amount (id, money_amount_id, variant_id) values (
    'pvma_MY_PRODUCT_ID_usdc',
    'ma_MY_PRODUCT_ID_usdc',
    'variant_MY_PRODUCT_ID'
);
insert into product_variant_money_amount (id, money_amount_id, variant_id) values (
    'pvma_MY_PRODUCT_ID_eth',
    'ma_MY_PRODUCT_ID_eth',
    'variant_MY_PRODUCT_ID'
);


-- ADD IMAGES 
insert into image (id, url) values ('img_MY_PRODUCT_ID_main', 'https://static.snapchum.com/SC020/main-plain.png');
insert into image (id, url) values ('img_MY_PRODUCT_ID_t1', 'https://static.snapchum.com/SC020/thumbnail1.png');
insert into image (id, url) values ('img_MY_PRODUCT_ID_t2', 'https://static.snapchum.com/SC020/thumbnail2.png');
insert into image (id, url) values ('img_MY_PRODUCT_ID_t3', 'https://static.snapchum.com/SC020/thumbnail3.png');
insert into image (id, url) values ('img_MY_PRODUCT_ID_t4', 'https://static.snapchum.com/SC020/thumbnail4.png');

insert into product_images (product_id, image_id) values ('prod_MY_PRODUCT_ID', 'img_MY_PRODUCT_ID_main');
insert into product_images (product_id, image_id) values ('prod_MY_PRODUCT_ID', 'img_MY_PRODUCT_ID_t1');
insert into product_images (product_id, image_id) values ('prod_MY_PRODUCT_ID', 'img_MY_PRODUCT_ID_t2');
insert into product_images (product_id, image_id) values ('prod_MY_PRODUCT_ID', 'img_MY_PRODUCT_ID_t3');
insert into product_images (product_id, image_id) values ('prod_MY_PRODUCT_ID', 'img_MY_PRODUCT_ID_t4');


-- SALES CHANNEL
insert into product_sales_channel (product_id, sales_channel_id) values (
    'prod_MY_PRODUCT_ID', 'sc_01J4Q07P5ECNNNX25E2F3KT48C'
);
-- CATEGORY
insert into product_category_product (product_category_id, product_id) values (
    'pcat_electronics', 'prod_MY_PRODUCT_ID'
);
