classDiagram
direction BT
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

order_discounts  -->  order : order_id:id
order_edit  -->  order : order_id:id
order_edit  -->  payment_collection : payment_collection_id:id
order_gift_cards  -->  order : order_id:id
order_item_change  -->  order_edit : order_edit_id:id
payment  -->  order : order_id:id
payment_collection_payments  -->  payment : payment_id:id
payment_collection_payments  -->  payment_collection : payment_collection_id:id
payment_collection_sessions  -->  payment_collection : payment_collection_id:id
payment_collection_sessions  -->  payment_session : payment_session_id:id
