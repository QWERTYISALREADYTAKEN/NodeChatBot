const mngs_Model = require('../MongoosePart.js').loginModel;
const {emptyHandler, errro, objectFilter, stts} = require('../Helpers/Helper.js');
const {salt, passSaltRounds, tokenSaltRounds} = require('../Helpers/Helper.js').hashSupport;

//Usable only with express and mongoose
var authenticate = async(req, res, next) => {
    //This takes authToken from request header
    var token = req.header('x-auth');
    var status = 200;
    var r;
    if (token !== 'noAuth') {
        try {
            r = await mngs_Model.findByToken(token, salt, tokenSaltRounds, 'auth');
            r = emptyHandler(r, () => {status = stts('auth'); errro(status)});

            //Removing token
            //r = objectFilter('sec', r._doc, '_id');
            //r = emptyHandler(r, () => {status = errro('Empty'); errro(status)});

            //req.r = r;
            req.r = r;
            req._id = r._doc._id;
            req.userName = r._doc.userName;
            req.token = token;
            status !== 200? req.status = status : req.status = 200;
            next();
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.status(status).send(err.message);
        }
    }
}

module.exports = {authenticate};