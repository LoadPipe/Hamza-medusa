classDiagram
direction BT
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

product  -->  product_collection : collection_id:id
product  -->  product_type : type_id:id
product_category_product  -->  product : product_id:id
product_category_product  -->  product_category : product_category_id:id
product_images  -->  product : product_id:id
product_option  -->  product : product_id:id
product_option_value  -->  product_option : option_id:id
product_option_value  -->  product_variant : variant_id:id
product_sales_channel  -->  product : product_id:id
product_shipping_profile  -->  product : product_id:id
product_tags  -->  product : product_id:id
product_tags  -->  product_tag : product_tag_id:id
product_tax_rate  -->  product : product_id:id
product_type_tax_rate  -->  product_type : product_type_id:id
product_variant  -->  product : product_id:id
