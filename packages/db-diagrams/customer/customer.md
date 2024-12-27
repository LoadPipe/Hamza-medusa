classDiagram
direction BT
class customer {
   varchar email
   varchar first_name
   varchar last_name
   varchar billing_address_id
   varchar password_hash
   varchar phone
   boolean has_account
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   boolean is_verified
   varchar preferred_currency_id
   varchar id
}
class customer_group {
   varchar name
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class customer_group_customers {
   varchar customer_group_id
   varchar customer_id
}
class customer_wallet_address {
   varchar customer_id
   varchar wallet_address
}

customer_group_customers  -->  customer : customer_id:id
customer_group_customers  -->  customer_group : customer_group_id:id
customer_wallet_address  -->  customer : customer_id:id
