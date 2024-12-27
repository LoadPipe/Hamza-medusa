classDiagram
direction BT
class address {
   varchar customer_id
   varchar company
   varchar first_name
   varchar last_name
   varchar address_1
   varchar address_2
   varchar city
   varchar country_code
   varchar province
   varchar postal_code
   varchar phone
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class analytics_config {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar user_id
   boolean opt_out
   boolean anonymize
   varchar id
}
class batch_job {
   text type
   varchar created_by
   jsonb context
   jsonb result
   boolean dry_run
   timestamp with time zone created_at
   timestamp with time zone pre_processed_at
   timestamp with time zone confirmed_at
   timestamp with time zone processing_at
   timestamp with time zone completed_at
   timestamp with time zone failed_at
   timestamp with time zone canceled_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar id
}
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
class cart_gift_cards {
   varchar cart_id
   varchar gift_card_id
}
class claim_image {
   varchar claim_item_id
   varchar url
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class claim_item {
   varchar claim_order_id
   varchar item_id
   varchar variant_id
   claim_item_reason_enum reason
   varchar note
   integer quantity
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class claim_item_tags {
   varchar item_id
   varchar tag_id
}
class claim_order {
   claim_order_payment_status_enum payment_status
   claim_order_fulfillment_status_enum fulfillment_status
   claim_order_type_enum type
   varchar order_id
   varchar shipping_address_id
   integer refund_amount
   timestamp with time zone canceled_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar idempotency_key
   boolean no_notification
   varchar id
}
class claim_tag {
   varchar value
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class confirmation_token {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar email_address
   boolean redeemed
   integer expiration_hours
   varchar customer_id
   varchar token
}
class country {
   varchar iso_2
   varchar iso_3
   integer num_code
   varchar name
   varchar display_name
   varchar region_id
   integer id
}
class currency {
   varchar symbol
   varchar symbol_native
   varchar name
   varchar code
}
class custom_shipping_option {
   integer price
   varchar shipping_option_id
   varchar cart_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
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
class fulfillment {
   varchar swap_id
   varchar order_id
   jsonb tracking_numbers
   jsonb data
   timestamp with time zone shipped_at
   timestamp with time zone canceled_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar idempotency_key
   varchar provider_id
   varchar claim_order_id
   boolean no_notification
   varchar location_id
   varchar id
}
class fulfillment_item {
   integer quantity
   varchar fulfillment_id
   varchar item_id
}
class fulfillment_provider {
   boolean is_installed
   varchar id
}
class gift_card {
   varchar code
   integer value
   integer balance
   varchar region_id
   varchar order_id
   boolean is_disabled
   timestamp with time zone ends_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   real tax_rate
   varchar id
}
class gift_card_transaction {
   varchar gift_card_id
   varchar order_id
   integer amount
   timestamp with time zone created_at
   boolean is_taxable
   real tax_rate
   varchar id
}
class idempotency_key {
   varchar idempotency_key
   timestamp with time zone created_at
   timestamp with time zone locked_at
   varchar request_method
   jsonb request_params
   varchar request_path
   integer response_code
   jsonb response_body
   varchar recovery_point
   varchar id
}
class image {
   varchar url
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class invite {
   varchar user_email
   invite_role_enum role
   boolean accepted
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar token
   timestamp with time zone expires_at
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
class line_item_adjustment {
   varchar item_id
   varchar description
   varchar discount_id
   numeric amount
   jsonb metadata
   varchar id
}
class line_item_tax_line {
   real rate
   varchar name
   varchar code
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar item_id
   varchar id
}
class migrations {
   bigint timestamp
   varchar name
   integer id
}
class money_amount {
   varchar currency_code
   bigint amount
   varchar region_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   integer min_quantity
   integer max_quantity
   varchar price_list_id
   varchar id
}
class note {
   varchar value
   varchar resource_type
   varchar resource_id
   varchar author_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class notification {
   varchar event_name
   varchar resource_type
   varchar resource_id
   varchar customer_id
   varchar to
   jsonb data
   varchar parent_id
   varchar provider_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar id
}
class notification_provider {
   boolean is_installed
   varchar id
}
class oauth {
   varchar display_name
   varchar application_name
   varchar install_url
   varchar uninstall_url
   jsonb data
   varchar id
}
class order {
   order_status_enum status
   order_fulfillment_status_enum fulfillment_status
   order_payment_status_enum payment_status
   integer display_id
   varchar cart_id
   varchar customer_id
   varchar email
   varchar billing_address_id
   varchar shipping_address_id
   varchar region_id
   varchar currency_code
   real tax_rate
   timestamp with time zone canceled_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar idempotency_key
   varchar draft_order_id
   boolean no_notification
   varchar external_id
   varchar sales_channel_id
   varchar store_id
   varchar id
}
class order_discounts {
   varchar order_id
   varchar discount_id
}
class order_edit {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar order_id
   varchar internal_note
   varchar created_by
   varchar requested_by
   timestamp with time zone requested_at
   varchar confirmed_by
   timestamp with time zone confirmed_at
   varchar declined_by
   varchar declined_reason
   timestamp with time zone declined_at
   varchar canceled_by
   timestamp with time zone canceled_at
   varchar payment_collection_id
   varchar id
}
class order_gift_cards {
   varchar order_id
   varchar gift_card_id
}
class order_item_change {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   order_item_change_type_enum type
   varchar order_edit_id
   varchar original_line_item_id
   varchar line_item_id
   varchar id
}
class payment {
   varchar swap_id
   varchar cart_id
   varchar order_id
   integer amount
   varchar currency_code
   integer amount_refunded
   varchar provider_id
   jsonb data
   timestamp with time zone captured_at
   timestamp with time zone canceled_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar idempotency_key
   varchar transaction_id
   varchar escrow_contract_address
   varchar payer_address
   varchar receiver_address
   varchar id
}
class payment_collection {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   "payment_collection_type_enum" type
   "payment_collection_status_enum" status
   text description
   integer amount
   integer authorized_amount
   varchar region_id
   varchar currency_code
   jsonb metadata
   varchar created_by
   varchar store_id
   varchar id
}
class payment_collection_payments {
   varchar payment_collection_id
   varchar payment_id
}
class payment_collection_sessions {
   varchar payment_collection_id
   varchar payment_session_id
}
class payment_provider {
   boolean is_installed
   varchar id
}
class payment_session {
   varchar cart_id
   varchar provider_id
   boolean is_selected
   payment_session_status_enum status
   jsonb data
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar idempotency_key
   timestamp with time zone payment_authorized_at
   integer amount
   boolean is_initiated
   varchar id
}
class permission {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar name
   jsonb metadata
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
class product_category {
   text name
   text handle
   varchar parent_category_id
   text mpath
   boolean is_active
   boolean is_internal
   timestamp with time zone created_at
   timestamp with time zone updated_at
   integer rank
   text description
   jsonb metadata
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
class product_images {
   varchar product_id
   varchar image_id
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
class product_tax_rate {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar product_id
   varchar rate_id
}
class product_type {
   varchar value
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class product_type_tax_rate {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar product_type_id
   varchar rate_id
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
class product_variant_inventory_item {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   text inventory_item_id
   text variant_id
   integer required_quantity
   timestamp with time zone deleted_at
   varchar id
}
class product_variant_money_amount {
   text money_amount_id
   text variant_id
   timestamp with time zone deleted_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar id
}
class publishable_api_key {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar created_by
   varchar revoked_by
   timestamp with time zone revoked_at
   varchar title
   varchar id
}
class publishable_api_key_sales_channel {
   text id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar sales_channel_id
   varchar publishable_key_id
}
class refund {
   varchar order_id
   integer amount
   varchar note
   refund_reason_enum reason
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar idempotency_key
   varchar payment_id
   varchar id
}
class region {
   varchar name
   varchar currency_code
   real tax_rate
   varchar tax_code
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   boolean gift_cards_taxable
   boolean automatic_taxes
   varchar tax_provider_id
   varchar id
}
class region_fulfillment_providers {
   varchar region_id
   varchar provider_id
}
class region_payment_providers {
   varchar region_id
   varchar provider_id
}
class return {
   return_status_enum status
   varchar swap_id
   varchar order_id
   jsonb shipping_data
   integer refund_amount
   timestamp with time zone received_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar idempotency_key
   varchar claim_order_id
   boolean no_notification
   varchar location_id
   varchar id
}
class return_item {
   integer quantity
   boolean is_requested
   integer requested_quantity
   integer received_quantity
   jsonb metadata
   varchar reason_id
   varchar note
   varchar return_id
   varchar item_id
}
class return_reason {
   varchar value
   varchar label
   varchar description
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar parent_return_reason_id
   varchar id
}
class role {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   varchar name
   varchar store_id
   varchar id
}
class role_permissions {
   varchar role_id
   varchar permission_id
}
class sales_channel {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar name
   varchar description
   boolean is_disabled
   jsonb metadata
   varchar id
}
class sales_channel_location {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   text sales_channel_id
   text location_id
   timestamp with time zone deleted_at
   varchar id
}
class shipping_method {
   varchar shipping_option_id
   varchar order_id
   varchar cart_id
   varchar swap_id
   varchar return_id
   integer price
   jsonb data
   varchar claim_order_id
   varchar id
}
class shipping_method_tax_line {
   real rate
   varchar name
   varchar code
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar shipping_method_id
   varchar id
}
class shipping_option {
   varchar name
   varchar region_id
   varchar profile_id
   varchar provider_id
   shipping_option_price_type_enum price_type
   integer amount
   boolean is_return
   jsonb data
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   boolean admin_only
   varchar id
}
class shipping_option_requirement {
   varchar shipping_option_id
   shipping_option_requirement_type_enum type
   integer amount
   timestamp with time zone deleted_at
   varchar id
}
class shipping_profile {
   varchar name
   shipping_profile_type_enum type
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar id
}
class shipping_tax_rate {
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar shipping_option_id
   varchar rate_id
}
class staged_job {
   varchar event_name
   jsonb data
   jsonb options
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
class swap {
   swap_fulfillment_status_enum fulfillment_status
   swap_payment_status_enum payment_status
   varchar order_id
   integer difference_due
   varchar shipping_address_id
   varchar cart_id
   timestamp with time zone confirmed_at
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar idempotency_key
   boolean no_notification
   timestamp with time zone canceled_at
   boolean allow_backorder
   varchar id
}
class tax_provider {
   boolean is_installed
   varchar id
}
class tax_rate {
   real rate
   varchar code
   varchar name
   varchar region_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   jsonb metadata
   varchar id
}
class tracking_link {
   varchar url
   varchar tracking_number
   varchar fulfillment_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   varchar idempotency_key
   varchar id
}
class user {
   varchar email
   varchar first_name
   varchar last_name
   varchar password_hash
   varchar api_token
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   jsonb metadata
   user_role_enum role
   varchar wallet_address
   varchar role_id
   varchar id
}
class wishlist {
   varchar customer_id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar id
}
class wishlist_item {
   varchar id
   timestamp with time zone created_at
   timestamp with time zone updated_at
   timestamp with time zone deleted_at
   varchar wishlist_id
   varchar product_id
}

address  -->  country : country_code:
address  -->  customer : customer_id:id
analytics_config  -->  user : user_id:id
batch_job  -->  user : created_by:id
cart  -->  address : shipping_address_id:id
cart  -->  address : billing_address_id:id
cart  -->  customer : customer_id:id
cart  -->  payment : payment_id:id
cart  -->  region : region_id:id
cart  -->  sales_channel : sales_channel_id:id
cart_discounts  -->  cart : cart_id:id
cart_discounts  -->  discount : discount_id:id
cart_gift_cards  -->  cart : cart_id:id
cart_gift_cards  -->  gift_card : gift_card_id:id
claim_image  -->  claim_item : claim_item_id:id
claim_item  -->  claim_order : claim_order_id:id
claim_item  -->  line_item : item_id:id
claim_item  -->  product_variant : variant_id:id
claim_item_tags  -->  claim_item : item_id:id
claim_item_tags  -->  claim_tag : tag_id:id
claim_order  -->  address : shipping_address_id:id
claim_order  -->  order : order_id:id
confirmation_token  -->  customer : customer_id:id
country  -->  region : region_id:id
custom_shipping_option  -->  cart : cart_id:id
custom_shipping_option  -->  shipping_option : shipping_option_id:id
customer  -->  address : billing_address_id:id
customer  -->  currency : preferred_currency_id:code
customer_group_customers  -->  customer : customer_id:id
customer_group_customers  -->  customer_group : customer_group_id:id
customer_wallet_address  -->  customer : customer_id:id
discount  -->  discount : parent_discount_id:id
discount  -->  discount_rule : rule_id:id
discount  -->  store : store_id:id
discount_condition  -->  discount_rule : discount_rule_id:id
discount_condition_customer_group  -->  customer_group : customer_group_id:id
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
discount_regions  -->  region : region_id:id
discount_rule_products  -->  discount_rule : discount_rule_id:id
discount_rule_products  -->  product : product_id:id
draft_order  -->  cart : cart_id:id
draft_order  -->  order : order_id:id
fulfillment  -->  claim_order : claim_order_id:id
fulfillment  -->  fulfillment_provider : provider_id:id
fulfillment  -->  order : order_id:id
fulfillment  -->  swap : swap_id:id
fulfillment_item  -->  fulfillment : fulfillment_id:id
fulfillment_item  -->  line_item : item_id:id
gift_card  -->  order : order_id:id
gift_card  -->  region : region_id:id
gift_card_transaction  -->  gift_card : gift_card_id:id
gift_card_transaction  -->  order : order_id:id
line_item  -->  cart : cart_id:id
line_item  -->  claim_order : claim_order_id:id
line_item  -->  currency : currency_code:code
line_item  -->  line_item : original_item_id:id
line_item  -->  order : order_id:id
line_item  -->  order_edit : order_edit_id:id
line_item  -->  product_variant : variant_id:id
line_item  -->  swap : swap_id:id
line_item_adjustment  -->  discount : discount_id:id
line_item_adjustment  -->  line_item : item_id:id
line_item_tax_line  -->  line_item : item_id:id
money_amount  -->  currency : currency_code:code
money_amount  -->  price_list : price_list_id:id
money_amount  -->  region : region_id:id
notification  -->  customer : customer_id:id
notification  -->  notification : parent_id:id
notification  -->  notification_provider : provider_id:id
order  -->  address : billing_address_id:id
order  -->  address : shipping_address_id:id
order  -->  cart : cart_id:id
order  -->  currency : currency_code:code
order  -->  customer : customer_id:id
order  -->  draft_order : draft_order_id:id
order  -->  region : region_id:id
order  -->  sales_channel : sales_channel_id:id
order  -->  store : store_id:id
order_discounts  -->  discount : discount_id:id
order_discounts  -->  order : order_id:id
order_edit  -->  order : order_id:id
order_edit  -->  payment_collection : payment_collection_id:id
order_gift_cards  -->  gift_card : gift_card_id:id
order_gift_cards  -->  order : order_id:id
order_item_change  -->  line_item : line_item_id:id
order_item_change  -->  line_item : original_line_item_id:id
order_item_change  -->  order_edit : order_edit_id:id
payment  -->  cart : cart_id:id
payment  -->  currency : currency_code:code
payment  -->  order : order_id:id
payment  -->  swap : swap_id:id
payment_collection  -->  region : region_id:id
payment_collection  -->  store : store_id:id
payment_collection_payments  -->  payment : payment_id:id
payment_collection_payments  -->  payment_collection : payment_collection_id:id
payment_collection_sessions  -->  payment_collection : payment_collection_id:id
payment_collection_sessions  -->  payment_session : payment_session_id:id
payment_session  -->  cart : cart_id:id
price_list  -->  store : store_id:id
price_list_customer_groups  -->  customer_group : customer_group_id:id
price_list_customer_groups  -->  price_list : price_list_id:id
product  -->  product_collection : collection_id:id
product  -->  product_type : type_id:id
product  -->  store : store_id:id
product_category_product  -->  product : product_id:id
product_category_product  -->  product_category : product_category_id:id
product_collection  -->  store : store_id:id
product_images  -->  image : image_id:id
product_images  -->  product : product_id:id
product_option  -->  product : product_id:id
product_option_value  -->  product_option : option_id:id
product_option_value  -->  product_variant : variant_id:id
product_sales_channel  -->  product : product_id:id
product_sales_channel  -->  sales_channel : sales_channel_id:id
product_shipping_profile  -->  product : product_id:id
product_tags  -->  product : product_id:id
product_tags  -->  product_tag : product_tag_id:id
product_tax_rate  -->  product : product_id:id
product_tax_rate  -->  tax_rate : rate_id:id
product_type_tax_rate  -->  product_type : product_type_id:id
product_type_tax_rate  -->  tax_rate : rate_id:id
product_variant  -->  product : product_id:id
product_variant_money_amount  -->  money_amount : money_amount_id:id
publishable_api_key_sales_channel  -->  sales_channel : sales_channel_id:id
refund  -->  order : order_id:id
refund  -->  payment : payment_id:id
region  -->  currency : currency_code:code
region  -->  tax_provider : tax_provider_id:id
region_fulfillment_providers  -->  fulfillment_provider : provider_id:id
region_fulfillment_providers  -->  region : region_id:id
region_payment_providers  -->  payment_provider : provider_id:id
region_payment_providers  -->  region : region_id:id
return  -->  claim_order : claim_order_id:id
return  -->  order : order_id:id
return  -->  swap : swap_id:id
return_item  -->  line_item : item_id:id
return_item  -->  return : return_id:id
return_item  -->  return_reason : reason_id:id
return_reason  -->  return_reason : parent_return_reason_id:id
role  -->  store : store_id:id
role_permissions  -->  permission : permission_id:id
role_permissions  -->  role : role_id:id
sales_channel_location  -->  sales_channel : sales_channel_id:id
shipping_method  -->  cart : cart_id:id
shipping_method  -->  claim_order : claim_order_id:id
shipping_method  -->  order : order_id:id
shipping_method  -->  return : return_id:id
shipping_method  -->  shipping_option : shipping_option_id:id
shipping_method  -->  swap : swap_id:id
shipping_method_tax_line  -->  shipping_method : shipping_method_id:id
shipping_option  -->  fulfillment_provider : provider_id:id
shipping_option  -->  region : region_id:id
shipping_option  -->  shipping_profile : profile_id:id
shipping_option_requirement  -->  shipping_option : shipping_option_id:id
shipping_tax_rate  -->  shipping_option : shipping_option_id:id
shipping_tax_rate  -->  tax_rate : rate_id:id
store  -->  currency : default_currency_code:code
store  -->  sales_channel : default_sales_channel_id:id
store  -->  user : owner_id:id
store_currencies  -->  currency : currency_code:code
store_currencies  -->  store : store_id:id
swap  -->  address : shipping_address_id:id
swap  -->  cart : cart_id:id
swap  -->  order : order_id:id
tax_rate  -->  region : region_id:id
tracking_link  -->  fulfillment : fulfillment_id:id
user  -->  role : role_id:id
wishlist  -->  customer : customer_id:id
wishlist_item  -->  product : product_id:id
wishlist_item  -->  wishlist : wishlist_id:id
