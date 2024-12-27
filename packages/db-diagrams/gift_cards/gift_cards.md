classDiagram
direction BT
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

gift_card  -->  order : order_id:id
gift_card  -->  region : region_id:id
gift_card_transaction  -->  gift_card : gift_card_id:id
gift_card_transaction  -->  order : order_id:id
order  -->  region : region_id:id
