type CacheItem = {
    timestamp: number;
    data: any;
}

/**
 * A utility for: 
 * - keeping data in cache for a max number of seconds 
 * - serving the data in such a way that there isn't a sudden rush for querying 
 * - service the data in such a way that it's always available 
 * 
 * Usage: 
 * - extend the class 
 * - implement the getData method such that it retrieves data 
 * - from the consumer side, call either retrieve or retrieveWithKey
 * 
 * @author John R. Kosinski
 */
export class SeamlessCache {
    private cache: { [key: string]: CacheItem } = {};
    private expirationSeconds: number;

    constructor(expirationSeconds: number) {
        this.expirationSeconds = expirationSeconds;
    }

    /**
     * Get the single item of cached data held in the instance. 
     * The item will be retrieved by the getData function if it isn't present, and it will be 
     * refreshed if expired.
     * 
     * @param params Anything; these will be passed to the getData function ultimately
     * @returns cached data of a specifically defined type
     */
    async retrieve(params?: any): Promise<any> {
        return await this.retrieveWithKey('default', params);
    }

    /**
     * Get a single item of cached data held in the instance defined by the given unique key. 
     * The item will be retrieved by the getData function if it isn't present, and it will be 
     * refreshed if expired.
     * 
     * @param params Anything; these will be passed to the getData function ultimately
     * @returns cached data of a specifically defined type
     */
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

    /**
     * Override this in extended classes to define exactly how to get the data. 
     * 
     * @param params 
     * @returns 
     */
    protected async getData(params: any): Promise<any> {
        return {};
    }
}