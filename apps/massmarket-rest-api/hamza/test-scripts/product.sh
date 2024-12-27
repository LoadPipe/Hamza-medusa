curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"storeId":"0xf9bd19671391ec9ce554eb7b788e5c661a5906b70fbbf6f4adbbd8383623b058","keycard":"0xd476aa67d4ab33576da3db6d75fd8e93782ba50b13a0fc3b442d05869e2612df", "products": [{"name": "Medusa Coffee Mug", "price": "10.00", "description": "Every programmers friend", "image": "https://medusa-public-images.s3.eu-west-1.amazonaws.com/coffee-mug.png" }]}' \
  http://localhost:3001/api/product
