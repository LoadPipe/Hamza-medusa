
CREATE TEMP TABLE temp_session_variables (
    "prod_id" char VARYING
);
INSERT INTO temp_session_variables ("prod_id") VALUES ('prod_01J7RYV7QP6YRA5EJ1YT6ZVD78');

update product set title ='Apple 16Pro-suitable Full Screen Tempered Film' where id = (SELECT prod_id from temp_session_variables limit 1);

update product set subtitle ='Suitable for Apple 16Pro Full Screen Protective Tempered Film HD Glass' where id = (SELECT prod_id from temp_session_variables limit 1);

--insert into image (id, url) values ('img_01J7RYV7QP6YRA5EJ1YT6ZVD78_01', 'https://cbu01.alicdn.com/img/ibank/O1CN01RLjis41xDpfV9du9Q_!!2208467966410-0-cib.jpg');
--nsert into product_images(product_id, image_id) values (@prod_id, 'img_01J7RYV7QP6YRA5EJ1YT6ZVD78_01');
--insert into image (id, url) values ('img_01J7RYV7QP6YRA5EJ1YT6ZVD78_02', 'https://cbu01.alicdn.com/img/ibank/O1CN01ZLl48q1xDpfTCjsVo_!!2208467966410-0-cib.jpg');
--insert into product_images(product_id, image_id) values (@prod_id, 'img_01J7RYV7QP6YRA5EJ1YT6ZVD78_02');
--insert into image (id, url) values ('img_01J7RYV7QP6YRA5EJ1YT6ZVD78_03', 'https://cbu01.alicdn.com/img/ibank/O1CN018hubT61xDpfZm5Suj_!!2208467966410-0-cib.jpg');
--insert into product_images(product_id, image_id) values (@prod_id, 'img_01J7RYV7QP6YRA5EJ1YT6ZVD78_03');
--insert into image (id, url) values ('img_01J7RYV7QP6YRA5EJ1YT6ZVD78_04', 'https://cbu01.alicdn.com/img/ibank/O1CN01kXHDzD1xDpfXzMYv5_!!2208467966410-0-cib.jpg');

update product_option set title = 'Type' where title='Color' and product_id=(SELECT prod_id from temp_session_variables limit 1);
update product_option set title = 'Size' where title='size' and product_id=(SELECT prod_id from temp_session_variables limit 1);

update product_option_value set value='HD Full Screen' where value ='HD Full Screen (Bare Film)';
update product_option_value set value='Anti-blue full screen' where value ='Anti-blue light full screen (bare film)';
update product_option_value set value='Anti-blue full screen (boxed)' where value ='Anti-blue light full screen (boxed)';