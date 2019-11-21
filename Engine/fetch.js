/**
 * ie11 support
 * Very simple ES5 implementation of window.fetch()
 * ONLY supporting GET method, response.text()
 * 
 * 
 * @author: Guillaume Nachury
 */

 import Promise from 'promise-polyfill';

export const fetch = (url) => new Promise(function(res, rej){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    
    xhr.onload = function(){
        if(xhr.status === 200){
            res({text : () => new Promise(function(res, rej){
                res(xhr.response);
            })}
            )
        }
        else{
            res({code:xhr.status, message: xhr.statusText});
        }
    }

    xhr.send();
});
