import { AsyncLocalStorage } from "async_hooks";

class LocalStorageWrapper {
    private readonly storage: any;

    get customerId(): string {
        return this.storage.getStore()?.get('customerId');
    }
    set customerId(value: string) {
        this.storage.getStore()?.set('customerId', value);
    }

    get sessionId(): string {
        return this.storage.getStore()?.get('sessionId');
    }
    set sessionId(value: string) {
        this.storage.getStore()?.set('sessionId', value);
    }

    get requestId(): string {
        return this.storage.getStore()?.get('requestId');
    }
    set requestId(value: string) {
        this.storage.getStore()?.set('requestId', value);
    }

    constructor(storage: any) {
        this.storage = storage;
    }
}

//this is the raw thing
export const asyncLocalStorage = new AsyncLocalStorage();

//this is extended with proper properties; more user-friendly - use this one
export const sessionStorage = new LocalStorageWrapper(asyncLocalStorage);
