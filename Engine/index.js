/**
 * MondrianJS - Core class
 * @author: Guillaume Nachury
 */

import Promise from "promise-polyfill";

export default class Mondrian{

    constructor({endpoints, depsMap, verbose = false}){
        this.endpointsMap = {};
        this.depsMap = {}

        if(endpoints) this.registerEndpoints(endpoints);
        if(depsMap) this.registerDepsMap(depsMap);

        this.storage = {}
        this.verbose = verbose == true
    }

    /**
     * Register a list of endpoints.
     * Endpoint format : {name, url}
     * 
     * @param {Array} endpointsList Array of endpoint
     */
    registerEndpoints(endpointsList){
        endpointsList.forEach(endpoint => {
            this.endpointsMap[endpoint.name] = endpoint.url;
        });
    }

    /**
     * Register a modules dependancy map
     * 
     * @param {Array} depsMap 
     */
    registerDepsMap(deps){
        this.depsMap = deps;
    }


    /**
     * Pre fetch the module to speedup the process.
     * 
     * @param {Object | Array} target An Remote module or a list of Remote module to load
     */
    prefetch(target){
        if(Array.isArray(target)){
            target.forEach(aTarget => {
                if(this.verbose) console.log("PREFECT : Loading", {aTarget});
                this.load(aTarget).catch(err=> console.error("Prefetch error while loading "+{aTarget}));
            });
        }
        else{
            if(this.verbose) console.log("PREFECT : Loading", {target});
            this.load(target).catch(err=> console.error("Prefetch error while loading "+{target}));
        }
    }


    /**
     * Load a remote component from an endpoint.
     * 
     * @param {Object} Props Load parameters  
     */
    load({endpointURL, endpointName, identifier, selector}){
        return new Promise((res, rej) => {
            let _id = `${endpointURL}/${identifier}`;
            if(endpointName) _id = `${this.endpointsMap[endpointName]}/${identifier}`; 

            let _storedEntity = this.storage[_id];

            if(_storedEntity === undefined){
                _storedEntity = {
                    loaderStatus : -1, // -1 not loaded; 0 loading; 1 loaded
                    watchers : []
                }
            }

            if(this.verbose) console.log(`LOAD REQUEST : ${_id}`);
            if(this.verbose) console.log(`LOAD STATUS : ${_storedEntity.loaderStatus}`);

            const fetch = 'fetch' in window ? window.fetch : require('./fetch.js').fetch; 

            if(_storedEntity.loaderStatus === -1){
                fetch(_id)
                .then(res => res.text())
                .then(srcCode => {
                    const _self = this;
                    //------ WE THE MAGIC HAPPENS -----
                    let remoteModule = {};
                    let _remoteComponent;
                    function define(deps, func){
                        remoteModule = func(...deps.map(dep => _self.depsMap[dep]));
                    }
                    eval(srcCode);
                    //---------------------------------

                    _remoteComponent = remoteModule;
                    if(selector) _remoteComponent = remoteModule[selector];

                    _storedEntity.module = remoteModule;
                    if(this.verbose) console.log(`LOAD REQUEST : complete`);
                    if(_storedEntity.watchers){
                        if(this.verbose) console.log(`LOAD REQUEST : Waking up ${_storedEntity.watchers.length} watcher(s)`);
                        _storedEntity.watchers.forEach(defered => defered.resolve(_remoteComponent))
                    }
                    res(_remoteComponent);
                })
                .catch(err => {
                    if(_storedEntity.watchers){
                        _storedEntity.watchers.forEach(defered => defered.reject(err))
                    }  
                    rej(err);
                })
            }
            else if(_storedEntity.loaderStatus === 0){
                if(this.verbose) console.log(`LOAD REQUEST : waiting for initial load to complete....`);
                _storedEntity.watchers.push({res,rej})
            }
            else if(_storedEntity.loaderStatus === 1){
                if(this.verbose) console.log(`LOAD REQUEST : retrieve from storage`);
                res(selector ? _storedEntity.module[selector]:_storedEntity.module);
            }
        })
    }
}