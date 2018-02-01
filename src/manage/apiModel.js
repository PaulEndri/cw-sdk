import API from '../api/api';
import Cache from '../cache/cache';

export default class ApiModel{
    constructor(id) {
        this.api      = API;
        this.api.get  = (route) => API.get(route, Cache);
        this.isRecord = false;

        if(typeof this.get === 'function' && !isNaN(id)) {
            return this.get(id);
        } 
    }

    set id(val) {
        if(this.primaryKey == 'id') {
            return this._id = val;
        }
        return this[this.primaryKey] = val;
    }

    get id() {
        if(this.primaryKey == 'id') {
            return this._id;
        }

        return this[this.primaryKey];
    }

    static callAPI(route) {
        return new Promise((resolve, reject) => {
            if(Cache.get(route)) {
                return resolve(Cache.get(route));
            }

            API
                .get(route)
                .then(results => {
                    Cache.set(route, results, 60);

                    return resolve(results);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }

    clean() {
        if(this.isRecord === false) {
            return false;
        }

        let cleanObject = {};

        for(var key of this._metaData) {
            cleanObject[key] = this[key];
        }

        return cleanObject;
    }

    processId(id) {
        if(!id && this.isRecord === true && this.primaryKey !== false) {
            return this.id;
        } else if(this.primaryKey === false && !id && this.record === true) {
            throw Error("Please specify a primary key on a custom api model if it is to act as a proxy.");
        }

        return id;
    }

    recordCall(route, key, id, sub = false) {
        let callId  = this.processId(id);
        
        return this.api
            .get(route.replace("{id}", callId))
            .then(results => {
                if(this.isRecord === true) {
                    if(sub !== false) {
                        results = results[sub];
                    }
        
                    this[key] = results;
                
                    return this;
                }
        
                return results;
            });
    }

    wrapResponse(obj) {
        obj._metaData = Object.keys(obj);        
        obj.isRecord  = true;
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, obj);
    }

    search(route, params) {
        let params = validateSearchParams(params);

        return ApiModel.callAPI(route+params);
    }

    validateSearchParams(params) {
        const defaultParams = {
            orderBy:  "ID DESC",
            page:     1,
            pageSize: 50
        };

        let results = [];

        for(var key of Object.keys(params)) {
            results.push(`${key}=${params[key]}`);
        }

        let tmpResults = results.join('&');

        for(var key of Object.keys(defaultParams)) {
            if(tmpResults.indexOf(key) === -1) {
                results.push(`${key}=${defaultParams[key]}`);
            }
        }

        return '?'+results.join('&');
    }
};