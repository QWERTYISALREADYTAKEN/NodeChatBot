//For Sending Emails
//const nodemailer = require('nodemailer');

//Checks whether return value is empty or not
function emptyHandler(r, callback) {
    if (!r || r.length === 0 || Object.values(r).length === 0) {
        callback();
    } else {
        return r;
    }
}

//For searching with min and max values
//Link works like this - http://*url/specific_page/?key[1]=value[1]&key[2]=value[2]...&key[n]=value[n]
//For seraching min & max
//http://*url/specific_page/?other=values...&key_min=number...&other=values - Minimum level (inclusive)
//http://*url/specific_page/?other=values...&key_max=number...&other=values - Maximum level (inclusive)
//http://*url/specific_page/?other=values...&key_min_max=number...&other=values - minimum and maximum levels (inclusive)
function boundaryCreator(object) {
    var keys = Object.keys(object);
    var checker = true;
    keys.includes('id')? keys[keys.indexOf('id')] = '_id': checker = false;
    var returnObject = {};
    keys.forEach((current) => {
        if (current.includes('_') && current.charAt(0) !== '_') {
            var split = current.split('_');
            var values = object[current].split('/').map(e => e = parseInt(e));
            for (var i = 1; i < split.length; i++) {
                if (split[i] === 'min') {
                    if (!returnObject[split[0]]) {
                        returnObject[split[0]] = {$gte: values[i-1]}
                    } else {
                        returnObject[split[0]].$gte = values[i-1];
                    }
                } else if (split[i] === 'max') {
                    if (!returnObject[split[0]]) {
                        returnObject[split[0]] = {$lte: values[i-1]}
                    } else {
                        returnObject[split[0]].$lte = values[i-1];
                    }
                }
            }
        } else {
            if (checker === true) {
                if (current === '_id') {
                    returnObject[current] = object['id'];
                } else {
                    returnObject[current] = object[current];
                }
            } else {
                returnObject[current] = object[current];
            }
        }
    })
    return returnObject;
}

var statusChanger = (type =`def`) => {
    var status;
    if (type === 'type' || type === 'url') {
        return status = 404;
    } else if (type === 'body') {
        return status = 403;
    } else if (type === 'empty' || type === 'Empty') {
        return status = 409;
    } else if(type === 'auth') {
        return status = 401;
    }else if (type === 'def') {
        return status = 500;
    }
}

var errorCreator = (number, url = ``, message = ``) => {
    if (number === 404) {
        throw new Error(`Error 404: Not Valid Url - ${url}`);
    } else if (number === 403) {
        throw new Error ('Error 403: Forbidden');
    } else if (number === 409) {
        throw new Error ('Error 409: Response is Empty');
    } else if(number === 401) {
        throw new Error('Authorization Required');
    }else if (number === 500) {
        throw new Error(message);
    }
}

var emailObjects = (service, appAdminEmail, appAdminpass, addresant, addresat, subject, text) => {
    var transporter = nodemailer.createTransport({
      service: service,
      auth: {
        user: appAdminEmail,
        pass: appAdminpass
      }
    });
    
    var mailOptions = {
      from: addresat,
      to: addresat,
      subject: subject,
      text: text
    };
    
    return {transporter, mailOptions}
}

//Filtering Returning Objects
var objectFilter = function(type, object = {}, ...arguments) {
    
    var del = (object, key) => {
        delete object[key];
    }
    
    var customFunction = (object) => {
        for (current of arguments) {
            if (object[current]) {
                del(object, [current]);
            }
        }
    }
    
    //Returned r is cursor of the actual files and so to remove use r._doc.Removable_Key
    //Deleting tokens and password
    var mainFunction = (object) => {
        if (type === 'sec') {
            arguments.push('tokens','password');
            customFunction(object);
        } else if (type === 'cstm') {
            customFunction(object);
        } else {
            throw new Error(`${type} is not recognized. type 'sec' or 'cstm'`);
        }
    }
    
    if (typeof object === 'object' && Object.keys(object).length !== 0) {
        mainFunction(object);
        return object;
    } else if (typeof object === 'object' && Object.keys(object).length === 0) {
        mainFunction(this._doc);
    } else {
        arguments.push(object);
        mainFunction(this._doc);
    }
    
}

var hashSupport = {
    salt: 'youShallNotPass',
    passSaltRounds: 10,
    tokenSaltRounds: 1
}

module.exports.emptyHandler = emptyHandler;
module.exports.boundaryCreator = boundaryCreator;
module.exports.errro = errorCreator;
module.exports.stts = statusChanger;
module.exports.objectFilter = objectFilter;
module.exports.hashSupport = hashSupport;
//module.exports.emailObjects = emailObjects;