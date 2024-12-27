# Custom subscribers

You may define custom eventhandlers, `subscribers` by creating files in the `/subscribers` directory.
```
// import {
//   type SubscriberConfig,
//   type SubscriberArgs,
//   type ConfigModule,
// } from "@medusajs/medusa";
// import CustomerService from "../services/customer";
//
// export default async function customerHandler({
//   data,
//   eventName,
//   container,
//   pluginOptions,
// }: SubscriberArgs<Record<string, any>>) {
//   const customerService: CustomerService = container.resolve("CustomerService");
//
//   const { wallet_address } = data;
//
//   const customer = await customerService.createCustomer(wallet_address);
// }
//
// export const config: SubscriberConfig = {
//   event: CustomerService.Events.CREATED,
//   context: {
//     subscriberId: "customer-handler",
//   },
// };


```
```ts
import MyCustomService from "../services/my-custom";
import {
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/medusa";

type OrderPlacedEvent = {
  id: string;
  no_notification: boolean;
};

export default async function orderPlacedHandler({
  data,
  eventName,
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const orderService: OrderService = container.resolve(OrderService);

  const order = await orderService.retrieve(data.id, {
    relations: ["items", "items.variant", "items.variant.product"],
  });

  // Do something with the order
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
};
```

A subscriber is defined in two parts a `handler` and a `config`. The `handler` is a function which is invoked when an event is emitted. The `config` is an object which defines which event(s) the subscriber should subscribe to.

The `handler` is a function which takes one parameter, an `object` of type `SubscriberArgs<T>` with the following properties:

- `data` - an `object` of type `T` containing information about the event.
- `eventName` - a `string` containing the name of the event.
- `container` - a `MedusaContainer` instance which can be used to resolve services.
- `pluginOptions` - an `object` containing plugin options, if the subscriber is defined in a plugin.
