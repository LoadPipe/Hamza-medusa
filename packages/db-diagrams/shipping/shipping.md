classDiagram
direction BT
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

shipping_method  -->  shipping_option : shipping_option_id:id
shipping_method_tax_line  -->  shipping_method : shipping_method_id:id
shipping_option  -->  shipping_profile : profile_id:id
shipping_option_requirement  -->  shipping_option : shipping_option_id:id
shipping_tax_rate  -->  shipping_option : shipping_option_id:id
