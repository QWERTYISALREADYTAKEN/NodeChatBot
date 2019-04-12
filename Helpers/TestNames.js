module.exports = {
    names: {
        boyNames: ['Liam','Noah','Elijah','Logan','Mason','James','Aiden','Ethan','Lucas','Jacob','Michael','Matthew','Benjamin','Alexander','William','Daniel','Jayden','Oliver','Carter','Sebastian'],
        girlNames: ['Emma','Olivia','Ava','Isabella','Sophia','Mia','Amelia','Charlotte','Abigail','Emily','Harper','Evelyn','Madison','Victoria','Sofia','Scarlett','Aria','Elizabeth','Camila','Layla'],},
    surnames: {
        list: ['Smith','Jones','Taylor','Williams','Brown','Davies','Evans','Wilson','Thomas','Roberts','Johnson','Lewis','Walker','Robinson','Wood','Thompson','White','Watson','Jackson','Wright','Green','Harris','Cooper','King','Lee','Martin','Clarke','James','Morgan','Hughes','Edwards','Hill','Moore','Clark','Harrison','Scott','Young','Morris','Hall','Ward']
    },
    email: {
        list: ['yahoo.com', 'gmail.com', 'mail.com', 'hotmail.com']
    },
    userCreate: function (testNames) {
        var rand = Math.floor(Math.random() * (66 - 18)) + 18;
        var sexRand = Math.floor(Math.random() * (3 - 1)) + 1;
        var nameRand = Math.floor(Math.random() * (20 - 0));
        var lastNameRand = Math.floor(Math.random() * (40 - 0));
        var emailRand = Math.floor(Math.random() * (4 - 0));
        var birthDay = Math.floor(Math.random() * (29 - 1))+1;
        var birthMonth = Math.floor(Math.random() * (11 - 0));
        var birthYear = new Date().getFullYear() - rand;
        var sex;
        var name;
        if (sexRand === 1) {
            name = testNames.names.boyNames[nameRand];
            sex = 'Male';
        } else if (sexRand === 2) {
            name = testNames.names.girlNames[nameRand];
            sex = 'Female';
        }
        var lastName = testNames.surnames.list[lastNameRand];
        var emailLast = testNames.email.list[emailRand];

        return {rand, birthYear, sex, name, lastName, birthDay, birthMonth, emailLast}
    },
    userObject: function(userCreate, testNames) {
        var {rand, birthYear, sex, name, lastName, emailLast} = userCreate(testNames);
        
        var userObj = {
            userName: name+rand,
            email: `${name}.${lastName}${rand}@${emailLast}`,
            password: `${name}${birthYear}`,
            sex: sex,
            firstName: name,
            lastName: lastName,
            age: rand,
            birtYear: birthYear,
            comment: 'Too Lazy To Comment'
        }
        
        return userObj;
    }
}