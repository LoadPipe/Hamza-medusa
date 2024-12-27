classDiagram
direction BT
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

return  -->  swap : swap_id:id
return_item  -->  return : return_id:id
return_item  -->  return_reason : reason_id:id
return_reason  -->  return_reason : parent_return_reason_id:id
