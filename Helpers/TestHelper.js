const {userModel} = require('../MongoosePart.js');

function generator() {
    var nums = [0,1,2,3,4,5,6,7,8,9];
    var letters = ['a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','k','K','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z'];
    return {nums, letters};
}


function randomString(length = 'noL') {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (length === 'noL') {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

var listElement = function(type, description, inputValue, sum, year, month, day) {
    this.type = type;
    this.description = description;
    this.inputValue = inputValue;
    this.percentage = 100;
    this.id = randomString(10);
    this.created = new Date(year, month, day);
}

var objectCreator = (index = 1)=> {
    var valueRand = Math.floor((Math.floor(Math.random()*(5000-1000)) + 1000)/100)*100;
    var typeRand = Math.floor(Math.random()*(3-1)) + 1;
    var yearRand = Math.floor(Math.random()*(2019-2006)) + 2006;
    var monthRand = Math.floor(Math.random()*(12-0));
    var dayRand = Math.floor(Math.random()*(29-1)) + 1;
    var type;
    if (typeRand === 1) {
        type = 'income';
    } else if (typeRand === 2) {
        type = 'expenses';
    }
    
    var description = `Description ${index}`;
    var data = new listElement(type, description, valueRand, 0, yearRand, monthRand, dayRand);
    
    return data;
}

var accessUser = async (userName) => {
    try {
        var r = await userModel.findOne({userName: userName});
        
        var loopRand = Math.floor(Math.random()*(101-35)) + 35;
        
        for (var i = 1; i <= 50; i++) {
            var data = objectCreator(i);
            console.log(data);
            if (data.type === 'income') {
                r._doc.data.income.push(data);
                r.save();
            } else if (data.type === 'expenses') {
                r._doc.data.expenses.push(data);
                r.save();
            }
            console.log(data);
        }
        
        console.log(r);
    } catch(err) {
        console.log(err);
    }
}

//accessUser('Elizabeth20')

module.exports = {accessUser};