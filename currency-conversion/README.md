To RUN
yarn install
yarn start
try these endpoint for example conversion:
http://localhost:3000/convert/exch?base=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&to=0xdac17f958d2ee523a2206206994597c13d831ec7
http://localhost:3000/convert/convert?base=0x0000000000000000000000000000000000000000&to=0xdac17f958d2ee523a2206206994597c13d831ec7
http://localhost:3000/convert/exch?base=0xdac17f958d2ee523a2206206994597c13d831ec7&to=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
The main two files you should look at are ( coin-gecko.service.ts && coin-gecko.controller.ts )
```