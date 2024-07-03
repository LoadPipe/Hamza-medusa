curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"storeId":"0x1","keycard":"0x0101010101010101010101010101010101010101010101010101010101010101", "products": [{"name": "Medusa Coffee Mug", "price": "10.00", "description": "Every programmers friend", "image": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png" }]}' \
  http://localhost:3001/api/product
