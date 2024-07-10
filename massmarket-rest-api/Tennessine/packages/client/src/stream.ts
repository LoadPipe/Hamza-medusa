import { recoverMessageAddress } from "viem";
import schema from "@massmarket/schema";
import { RelayClient } from "./";

/**
 * This class is a Simple wrapper around a ReadableStream that expose the controller
 * so that a third party can enqueue events into the stream.
 */
export class ReadableEventStream {
  public stream;
  public requestId: Uint8Array | null = null;
  private controller!: ReadableStreamDefaultController<schema.ShopEvent>;
  private resolve!: (val: any) => void;
  private nextPushReq: Promise<void>;
  private queue: schema.EventPushRequest[] = [];

  constructor(public client: Pick<RelayClient, "encodeAndSendNoWait">) {
    const self = this;

    this.nextPushReq = new Promise<schema.EventPushRequest>((resolve) => {
      this.resolve = resolve;
    });

    this.stream = new ReadableStream({
      start(controller) {
        self.controller = controller;
      },
      // if pull returns a promise it will not be called again untill the promise is resolved regardless of the highwatermark
      // here we are using a recursive pull that will never resolve so that we have full control over when it is being called
      // and when to ask for the next chunk of data
      async pull(controller) {
        const pushReq = self.queue.shift();
        if (pushReq) {
          const requestId = pushReq.requestId;
          for (const anyEvt of pushReq.events) {
            const event = schema.ShopEvent.decode(anyEvt.event.value);
            const signer = await recoverMessageAddress({
              message: { raw: anyEvt.event.value },
              signature: anyEvt.signature,
            });

            self.controller.enqueue({ event, signer });
          }
          // Send a response to the relay to indicate that we have processed the events
          self.client.encodeAndSendNoWait(schema.EventPushResponse, {
            requestId,
          });
        }
        await self.nextPushReq;
        return this.pull!(controller);
      },
    });
  }

  // This method is meant to be used by the client to enqueue events into the stream
  enqueue(pushReq: schema.EventPushRequest) {
    this.queue.push(pushReq);
    this.resolve(null);
    this.nextPushReq = new Promise<schema.EventPushRequest>((resolve) => {
      this.resolve = resolve;
    });
  }
}
