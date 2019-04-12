//Environmental Variables
require('../config/config.js');

console.log(process.env.MONGODB_URI);

const {mongoose, userModel, loginModel} = require('../MongoosePart.js');
const testNames = require('./TestNames.js');
let bHash = require('../Helpers/BcryptToken_Pass.js');
let {accessUser} = require('./TestHelper.js');

const salt = 'youShallNotPass';

var createDb = async(n) => {
    for (var i = 0; i < n; i++) {
    
        var {rand, birthYear, birthDay, birthMonth, sex, name, lastName, emailLast} = testNames.userCreate(testNames);

        var newLoginUser = new loginModel({
            userName: name+rand,
            email: `${name}.${lastName}${rand}@${emailLast}`,
            password: `${name}${birthYear}`
        })
        
        var userObject = {
            userName: name+rand,
            email: `${name}.${lastName}${rand}@${emailLast}`,
            sex: sex,
            firstName: name,
            lastName: lastName,
            age: rand,
            birthYear: birthYear,
            birthDay: birthDay,
            birthMonth: birthMonth,
            comment: 'Too Lazy To Comment',
            passString: `${name}${birthYear}`
        }

        try {
            var r = await newLoginUser.generateToken('auth',salt, 'bt', 1);
            r = await newLoginUser.hash(10, salt);
            r = await newLoginUser.save();
            var check = await bHash.verify(r._doc.tokens[0].token, salt, 1);
            
            var check = await bHash.compare(`${name}${birthYear}`, r._doc.password, 10, salt);
            //Removing Some parts of returned doc
            userObject.loginId = r._doc._id;
            var newUser = new userModel(userObject);
            r = await newUser.save();
            
            //Adding Test Data To DBs
            await accessUser(r._doc.userName);
            
            newUser.objectFilter('sec',r._doc, 'email', 'password');
            console.log(r);
            if (check && check === false) {
                break;
                throw new Error('Match Failed');
            }
        } catch(err) {
            console.log(err);
        }
    }
}

createDb(100);

module.exports = {createDb};