classDiagram
direction BT
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

claim_image  -->  claim_item : claim_item_id:id
claim_item  -->  claim_order : claim_order_id:id
claim_item_tags  -->  claim_item : item_id:id
claim_item_tags  -->  claim_tag : tag_id:id
