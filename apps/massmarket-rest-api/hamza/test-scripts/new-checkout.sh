curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"storeId":"0x805e83d38d5c946bc1559f7d80ce94bce13a4cc0ec4640426bc81835f5958a57","keycard":"0x0000000000000000000000000000000000000000000000000000000000000007", "paymentCurrency":"0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5", "items": [{"productId": "0x866b7abc209a28a7bd66866a84d279e4157b6a00a2cd4e7210abdcfab315004e", "quantity":"1"}]}' \
  http://localhost:3001/api/checkout
