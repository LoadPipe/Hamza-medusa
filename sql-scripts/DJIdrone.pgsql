
CREATE TEMP TABLE temp_session_variables (
    "prod_id" char VARYING
);
INSERT INTO temp_session_variables ("prod_id") VALUES ('prod_01J7S28FMEZZJ3STNBRZECM35E');

update product set title ='DJI Neo Camera Drone' where id = (SELECT prod_id from temp_session_variables limit 1);

update product set subtitle ='Suitable for Apple 16Pro Full Screen Protective Tempered Film HD Glass' where id = (SELECT prod_id from temp_session_variables limit 1);

update product_option set title = 'Type' where title='Color' and product_id=(SELECT prod_id from temp_session_variables limit 1);
