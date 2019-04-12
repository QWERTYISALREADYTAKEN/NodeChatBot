const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const configA = require('config');
const {secret, salt, passSaltRounds, tokenSaltRounds, tokenBck} = require('./Helpers/Helper.js').hashSupport;
let bHash = require('./Helpers/BcryptToken_Pass');
let request = require('http').request;
const messageWebhook = require('./message-webhook');

var access_token = configA.get('facebook.page.access_token');

const fetch = require('node-fetch');
const dialogflow = require('dialogflow');

var createToken = () => {
    return bHash.sign(secret, salt, tokenSaltRounds);
}

var verifyToken = (token) => {
    return bHash.verify(token, salt, tokenSaltRounds);
}
let token = configA.get('ACCESS_TOKEN');

//Creating Token
(async () => {
        try {
            //token = await createToken();
            //var x = await verifyToken(token);
            //console.log(ver);
        } catch(e) {
            console.log(e);
        }
})();

//Modifing for heroku
//process.env stores environmental variables
let port = process.env.PORT || 8989;
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/token', (req, res) => {
    res.send(token);
});

// Adds support for GET requests to our webhook
app.get('/', (req, res) => {
    let VERIFY_TOKEN = configA.get('ACCESS_TOKEN');

      let mode = req.query['hub.mode'];
      let token = req.query['hub.verify_token'];
      let challenge = req.query['hub.challenge'];
    
      if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
      res.sendStatus(403);
    }
});

app.post('/', messageWebhook);

app.listen(port, () => {
    console.log(`Launched on Port: ${port}`);
});

console.log('Server Launched');