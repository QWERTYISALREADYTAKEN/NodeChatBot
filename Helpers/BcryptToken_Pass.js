const bcrypt = require('bcrypt');
const base64url = require('base64url');
const {SHA256} = require('crypto-js');

var hash = (pass, saltRounds, salt) => {
    return new Promise((resolve, reject) => {
        var encode = pass + salt + saltRounds;
        (async  () => {
            var r;
            try {
                r = await bcrypt.hash(encode, saltRounds);
                resolve(r);
            } catch(err) {
                reject(err)
            }
        })();
    })
}
var compare = (pass, hash, saltRounds, salt) => {
    return new Promise((resolve, reject) => {
        var encode = pass + salt + saltRounds;
        (async  () => {
            var r;
            try {
                r = await bcrypt.compare(encode, hash);
                resolve(r);
            } catch(err) {
                reject(err);
            }
        })();
    })
}

var sign = (secret, salt, saltRounds) => {
    return new Promise((resolve, reject) => {
        (async  () => {
            var r;
            try {
                //No need of milliseconds
                //Seconds will go as well
                var object = {
                    data: secret,
                }
                encoded = base64url.encode(object + salt + saltRounds);
                //object.encription = encoded.toString();
                //When adding .encription change encoded to object below
                encoded = SHA256(JSON.stringify(encoded) + salt).toString();
                
                r = await bcrypt.hash(encoded, saltRounds);
                r = `${base64url.encode(JSON.stringify(object))}.${base64url.encode(JSON.stringify(r))}`;
                resolve(r);
            } catch(err) {
                reject(err)
            }
        })();
    })
}

var verify = (token, salt, saltRounds) => {
    return new Promise((resolve, reject) => {
        (async() => {
           var r;
            try {
                var object;
                token = token.split('.');

                //For checking whether token only includes two values
                if(token.length !== 2) {
                    throw new Error('Invalid Token');
                } else {
                    try {
                        object = JSON.parse(base64url.decode(token[0]));
                        token = JSON.parse(base64url.decode(token[1]));
                    } catch(err) {
                        throw new Error('Invalid Token');
                    }
                }
                encoded = base64url.encode(object + salt + saltRounds);
                //object.encription = encoded.toString();
                //When adding .encription change encoded to object below
                encoded = SHA256(JSON.stringify(encoded) + salt).toString();
                
                r = await bcrypt.compare(encoded, token);
                if (r === true) {
                    resolve(object.data);
                } else if (r === false) {
                    throw new Error('Invalid Token');
                }
            } catch(err) {
                reject(err);
            }
        })()
    })
}

module.exports = {hash, compare, sign, verify};