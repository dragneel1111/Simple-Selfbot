const axios = require("axios");
var request = require("request");
var http = require('http');

async function expand(shortUrl, options, callback) {
    // options are optional, the function can still be used like this: expand(shortUrl, callback)
    if(typeof options == 'function') {
        callback = options;
        options = {};
    }

    var defaultOptions = { 
    	method: "HEAD"
      , url: shortUrl
      , followAllRedirects: true
      , timeout: 10000
      , pool: pool
	};

    // merge the user-supplied options with the default options
    for(var attribute in options) {
        defaultOptions[attribute] = options[attribute];
    }

	var pool = new http.Agent({'maxSockets': Infinity});
    request(defaultOptions, function (error, response) {
        if (error) {
            callback(error);
        } else {
            callback(undefined, response.request.href);
        }
    }).setMaxListeners(Infinity);
}
async function expandUrl(url) {
    return new Promise((resolve, reject) => {
expand(url, function(err, longUrl){
   resolve({shortUrl: url, longUrl: longUrl})
   reject(err)
})
})
}

async function expand2(url) {
    let link;
    try {
        const res = await axios({
            method: "get",
            url: url,
            maxRedirects: 0,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.58 Mobile Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
            },
        });
        link = res.headers.location;
    } catch (err) {
        if (Math.trunc(err.response.status / 100) === 3) {
            link = err.response.headers.location;
        } else {
            throw err;
        }
    } finally {
        return link;
    }
};

async function expandUrl2(url) {
    return new Promise((resolve, reject) => {
        expand2(url).then(async(longUrl) =>{
            resolve({shortUrl: url, longUrl: longUrl})
            reject('not found')
         })
    })
}
module.exports = { expandUrl, expandUrl2 }
//expandUrl("https://desudrive.com/link/?id=eVYzczJaUk9LU0lUMzFEWVk0am9XQkY1ajBwY25zVk9ZcWlIalJnZlk4aS9rU0x1SEpZUUtCd0k3OFZZdHNsWnpnPT0=").then(console.log)