classDiagram
direction BT
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

role_permissions  -->  role : role_id:id
