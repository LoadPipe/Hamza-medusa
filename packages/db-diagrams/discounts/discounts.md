classDiagram
direction BT
class cart {
   varchar email
   varchar billing_address_id
   varchar shipping_address_id
   varchar region_id
   varchar customer_id
   varchar payment_id
   cart_type_enum type
   timestamp with time zone completed_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar idempotency_key
   jsonb context
   timestamp with time zone payment_authorized_at
   varchar sales_channel_id
   varchar id
}
class cart_discounts {
   varchar cart_id
   varchar discount_id
}
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
class discount {
   varchar code
   boolean is_dynamic
   varchar rule_id
   boolean is_disabled
   varchar parent_discount_id
   timestamp with time zone starts_at
   timestamp with time zone ends_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   integer usage_limit
   integer usage_count
   varchar valid_duration
   varchar store_id
   varchar id
}
class discount_condition {
   discount_condition_type_enum type
   discount_condition_operator_enum operator
   varchar discount_rule_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class discount_condition_customer_group {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar customer_group_id
   varchar condition_id
}
class discount_condition_product {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar product_id
   varchar condition_id
}
class discount_condition_product_collection {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar product_collection_id
   varchar condition_id
}
class discount_condition_product_tag {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar product_tag_id
   varchar condition_id
}
class discount_condition_product_type {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar product_type_id
   varchar condition_id
}
class discount_regions {
   varchar discount_id
   varchar region_id
}
class discount_rule {
   varchar description
   discount_rule_type_enum type
   integer value
   discount_rule_allocation_enum allocation
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class discount_rule_products {
   varchar discount_rule_id
   varchar product_id
}
class draft_order {
   draft_order_status_enum status
   integer display_id
   varchar cart_id
   varchar order_id
   timestamp with time zone canceled_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone completed_at
   jsonb metadata
   varchar idempotency_key
   boolean no_notification_order
   varchar id
}
class line_item {
   varchar cart_id
   varchar order_id
   varchar swap_id
   varchar title
   varchar description
   varchar thumbnail
   boolean is_giftcard
   boolean should_merge
   boolean allow_discounts
   boolean has_shipping
   integer unit_price
   varchar variant_id
   integer quantity
   integer fulfilled_quantity
   integer returned_quantity
   integer shipped_quantity
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar claim_order_id
   boolean is_return
   varchar original_item_id
   varchar order_edit_id
   varchar currency_code
   varchar id
}
class price_list {
   varchar name
   varchar description
   price_list_type_enum type
   price_list_status_enum status
   timestamp with time zone starts_at
   timestamp with time zone ends_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar store_id
   varchar id
}
class price_list_customer_groups {
   varchar price_list_id
   varchar customer_group_id
}
class product {
   varchar title
   varchar subtitle
   varchar description
   varchar handle
   boolean is_giftcard
   varchar thumbnail
   integer weight
   integer length
   integer height
   integer width
   varchar hs_code
   varchar origin_country
   varchar mid_code
   varchar material
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar collection_id
   varchar type_id
   boolean discountable
   product_status_enum status
   varchar external_id
   varchar store_id
   varchar id
}
class product_category_product {
   varchar product_category_id
   varchar product_id
}
class product_collection {
   varchar title
   varchar handle
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar store_id
   varchar id
}
class product_option {
   varchar title
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar product_id
   varchar id
}
class product_option_value {
   varchar value
   varchar option_id
   varchar variant_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class product_sales_channel {
   varchar product_id
   varchar sales_channel_id
}
class product_shipping_profile {
   text profile_id
   text product_id
}
class product_tag {
   varchar value
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class product_tags {
   varchar product_id
   varchar product_tag_id
}
class product_type {
   varchar value
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class product_variant {
   varchar title
   varchar product_id
   varchar sku
   varchar barcode
   varchar ean
   varchar upc
   integer inventory_quantity
   boolean allow_backorder
   boolean manage_inventory
   varchar hs_code
   varchar origin_country
   varchar mid_code
   varchar material
   integer weight
   integer length
   integer height
   integer width
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   integer variant_rank
   varchar id
}
class store {
   varchar name
   varchar default_currency_code
   varchar swap_link_template
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar payment_link_template
   varchar invite_link_template
   varchar default_sales_channel_id
   varchar default_location_id
   varchar owner_id
   varchar id
}
class store_currencies {
   varchar store_id
   varchar currency_code
}
class wishlist_item {
   varchar id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar wishlist_id
   varchar product_id
}

cart  -->  customer : customer_id:id
cart_discounts  -->  cart : cart_id:id
cart_discounts  -->  discount : discount_id:id
discount  -->  discount : parent_discount_id:id
discount  -->  discount_rule : rule_id:id
discount  -->  store : store_id:id
discount_condition  -->  discount_rule : discount_rule_id:id
discount_condition_customer_group  -->  discount_condition : condition_id:id
discount_condition_product  -->  discount_condition : condition_id:id
discount_condition_product  -->  product : product_id:id
discount_condition_product_collection  -->  discount_condition : condition_id:id
discount_condition_product_collection  -->  product_collection : product_collection_id:id
discount_condition_product_tag  -->  discount_condition : condition_id:id
discount_condition_product_tag  -->  product_tag : product_tag_id:id
discount_condition_product_type  -->  discount_condition : condition_id:id
discount_condition_product_type  -->  product_type : product_type_id:id
discount_regions  -->  discount : discount_id:id
discount_rule_products  -->  discount_rule : discount_rule_id:id
discount_rule_products  -->  product : product_id:id
draft_order  -->  cart : cart_id:id
line_item  -->  cart : cart_id:id
line_item  -->  line_item : original_item_id:id
line_item  -->  product_variant : variant_id:id
price_list  -->  store : store_id:id
price_list_customer_groups  -->  price_list : price_list_id:id
product  -->  product_collection : collection_id:id
product  -->  product_type : type_id:id
product  -->  store : store_id:id
product_category_product  -->  product : product_id:id
product_collection  -->  store : store_id:id
product_option  -->  product : product_id:id
product_option_value  -->  product_option : option_id:id
product_option_value  -->  product_variant : variant_id:id
product_sales_channel  -->  product : product_id:id
product_shipping_profile  -->  product : product_id:id
product_tags  -->  product : product_id:id
product_tags  -->  product_tag : product_tag_id:id
product_variant  -->  product : product_id:id
store_currencies  -->  store : store_id:id
wishlist_item  -->  product : product_id:id
