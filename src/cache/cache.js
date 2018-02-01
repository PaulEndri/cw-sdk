class Cache
{
    /**
     * 
     * @param {*} preloaded 
     * @param {number} timeout ( in minutes )
     */
    constructor(preloaded, timeout = 0)
    {
        // validation is uneccessary thanks to try/catch
        try {
            let preloadedData = JSON.parse(preloaded);

            for(var k of Object.keys(preloadedData)) {
                this.set(k, preloadedData[k], timeout)
            }
        } catch(e) {
            console.warn("Invalid data was attempted to be preloaded");
        }

        this.callbacks = {};
        this.cacheData = {};
        this.cache     = {};
    }

    /**
     * Delete an entry from the cache
     * 
     * @param {string} key 
     * @param {bool} forced 
     */
    delete(key, forced=true) 
    {
        let result  = {};
        result[key] = this.cache[key];

        if(forced) {
            return this.callbacks[key].reject(result);
        }

        return this.callbacks[key].resolve(result);
    }

    /**
     * Set a new entry into the cache
     * 
     * @param {string} key 
     * @param {*} value \
     * @param {number} length  ( in minutes )
     * @returns {void|Promise}
     */
    set(key, value, length)
    {
        this.cache[key]     = value;
        this.cacheData[key] = {
            key       : key,
            value     : value,
            timestamp : new Date()
        };

        return new Promise((resolve, reject) => {
            this.callbacks[key] = {
                resolve : resolve,
                reject  : reject
            };

            if(length && !isNaN(length)) {
                setTimeout(() => {
                    this.delete(key, false);
                }, length * 60000);
            }
        });
    }

    /**
     * Get an entry from the cache, fully qualified or not
     * 
     * @param {string} key 
     * @param {bool} full 
     */
    get(key, full = false) {
        if(full === true)  {
            return this.cacheData[key];
        }

        return this.cache[key];
    }


}

export default new Cache();