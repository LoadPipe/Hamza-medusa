-- UPDATE customer
-- SET email = 'johnbajada01@gmail.com'
-- WHERE id = 'cus_01J3MPZ85ZNCFEXEE6AFVX5CMV';

UPDATE customer
SET is_verified = FALSE
WHERE id = 'cus_01J3MPZ85ZNCFEXEE6AFVX5CMV';

SELECT * FROM customer;