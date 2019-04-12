const bcrypt = require('bcrypt');
const base64url = require('base64url');
const {SHA256} = require('crypto-js');

var sign = (doc, salt, saltRounds) => {
    return new Promise((resolve, reject) => {
        //No need of milliseconds
        //Seconds will go as well
        doc.created = Math.floor(new Date() / 1000);
        var object = {
            data: doc,
        }
        encoded = base64url.encode(object + salt + saltRounds);
        //object.encription = encoded.toString();
        //When adding .encription change encoded to object below
        encoded = SHA256(JSON.stringify(encoded) + salt).toString();
        (async  () => {
            var r;
            try {
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
        var object;
        token = token.split('.');
        
        //For checking whether token only includes two values
        if(token.lenght > 2) {
            throw new Error('Invalid Token');
        } else {
            object = JSON.parse(base64url.decode(token[0]));
            token = JSON.parse(base64url.decode(token[1]));    
        }
        encoded = base64url.encode(object + salt + saltRounds);
        //object.encription = encoded.toString();
        //When adding .encription change encoded to object below
        encoded = SHA256(JSON.stringify(encoded) + salt).toString();
        (async() => {
           var r;
            try {
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

module.exports = {sign, verify};