curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"storeId":"0xf9bd19671391ec9ce554eb7b788e5c661a5906b70fbbf6f4adbbd8383623b058","keycard":"0xd476aa67d4ab33576da3db6d75fd8e93782ba50b13a0fc3b442d05869e2612df", "paymentCurrency":"0x0000000000000000000000000000000000000000", "items": [{"productId": "0x3b2132e1df0d79a69eb70dbf0d3952c5232fbab9259e69d4acf56f23b0412414", "quantity":"1"}]}' \
  http://localhost:3001/api/checkout
