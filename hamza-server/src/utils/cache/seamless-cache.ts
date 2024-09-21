type CacheItem = {
    timestamp: number;
    data: any;
}

/**
 * SeamlessCache (TM)
 * 
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
export abstract class SeamlessCache {
    private cache: { [key: string]: CacheItem } = {};
    private expirationSeconds: number;
    private refreshing: boolean;

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
        if (this.cache[key]?.data) {
            if (this.isExpired(key)) {
                //console.log('CACHE EXPIRED for key', key)
                if (!this.refreshing) {
                    //console.log('REFRESHING EXPIRED CACHE for key', key)
                    this.refreshCache(key, params);
                }
            }
        } else {
            //TODO: this part is NOT seamless; multiple threads can attempts this at once; can be fixed
            //console.log('CACHE EMPTY for key', key);
            await this.refreshCache(key, params);
        }

        return this.cache[key]?.data;
    }

    protected async refreshCache(key: string, params: any): Promise<void> {
        this.refreshing = true;
        try {
            const data: any = await this.getData(params);
            this.cache[key] = {
                timestamp: Math.floor(Date.now() / 1000),
                data: data
            };
        }
        catch (e: any) {
            //TODO: need a logger here
            console.log('CACHE ERROR', e);
        }
        //console.log('REFRESHED CACHE for key', key)
        this.refreshing = false;
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
    protected abstract getData(params: any): Promise<any>;
}