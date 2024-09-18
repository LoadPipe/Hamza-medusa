type CacheItem = {
    timestamp: number;
    data: any;
}

export class SeamlessCache {
    private cache: { [key: string]: CacheItem } = {};
    private expirationSeconds: number;

    constructor(expirationSeconds: number) {
        this.expirationSeconds = expirationSeconds;
    }

    async retrieve(params?: any): Promise<any> {
        return await this.retrieveWithKey('default', params);
    }

    async retrieveWithKey(key?: string, params?: any): Promise<any> {
        if (this.cache[key]?.data && this.isExpired(key)) {
            this.refreshCache(key, params);
        } else {
            await this.refreshCache(key, params);
        }

        return this.cache[key]?.data;
    }

    protected async refreshCache(key: string, params: any): Promise<void> {
        const data: any = await this.getData(params);
        this.cache[key] = {
            timestamp: Math.floor(Date.now() / 1000),
            data: data
        };
    }

    protected isExpired(key: string): boolean {
        return (Math.floor(Date.now() / 1000) - this.expirationSeconds > this.cache[key]?.timestamp);
    }

    protected async getData(params: any): Promise<any> {
        return {};
    }
}