classDiagram
direction BT
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

fulfillment  -->  fulfillment_provider : provider_id:id
fulfillment_item  -->  fulfillment : fulfillment_id:id
