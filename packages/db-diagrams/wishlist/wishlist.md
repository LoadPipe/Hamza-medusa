classDiagram
direction BT
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

wishlist_item  -->  wishlist : wishlist_id:id
