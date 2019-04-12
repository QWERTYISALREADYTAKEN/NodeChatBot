var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];
    
    Object.keys(envConfig).forEach((current, i) => {
        process.env[current] = envConfig[current];
    })
} else {
    var config = require('./config.json');
    var envConfig = config.production;
    
    Object.keys(envConfig).forEach((current, i) => {
        process.env[current] = envConfig[current];
    })
};
