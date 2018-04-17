var fs = require('fs');
var https = require('https');
var express = require('express');
var Session = require('express-session');
var google = require('googleapis');

var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;

var key = new Promise((resolve, reject) => {
  fs.readFile('/home/dhjn/develop/pki-localhost/certs/localhost.key', (err, key) => {
    if (err) reject(err);
    resolve(key);
  });
});
var cert = new Promise((resolve, reject) => {
  fs.readFile('/home/dhjn/develop/pki-localhost/certs/localhost.crt', (err, cert) => {
    if (err) reject(err);
    resolve(cert);
  });
});
var webCredentials = new Promise((resolve, reject) => {
  fs.readFile('./oauth2credentials.json', (err, credentials) => {
    if (err) reject(err);
    resolve(JSON.parse(credentials.toString()).web);
  });
});

Promise.all([webCredentials, key, cert]).then(([webCredentials, key, cert]) => {

  var app = express();
  app.use(Session({
    secret: 'somesupersecretpassword',
    resave: true,
    saveUninitialized: true
  }));

  var ClientId = webCredentials.client_id;
  var ClientSecret = webCredentials.client_secret;
  var RedirectionUrl = webCredentials.redirect_uris;

  function getOAuthClient() {
    return new OAuth2(ClientId, ClientSecret, RedirectionUrl[0]);
  }

  function getAuthUrl() {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
      'https://www.googleapis.com/auth/plus.me'
    ];
    var url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes // If you only need one scope you can pass it as string
    });
    return url;
  }

  app.use("/oauth2callback", function(req, res) {
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code;
    oauth2Client.getToken(code, function(err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if (!err) {
        oauth2Client.credentials = tokens;
        session["tokens"] = tokens;
        res.send(`
          <h3>Login successful!!</h3>
          <a href="/details">Go to details page</a>
          `);
      } else {
        res.send(`
            <h3>Login failed!!</h3>
            `);
      }
    });
  });

  app.use("/details", function(req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.credentials = req.session["tokens"];

    new Promise(function(resolve, reject) {
      plus.people.get({
        userId: 'me',
        auth: oauth2Client
      }, function(err, response) {
        resolve(response || err);
      });
    }).then(function(data) {
      console.log(data);
      res.send(`
            <img src=${data.image.url} />
            <h3>Hello ${data.name.givenName}</h3>
            `);
    })
  });

  app.use("/", function(req, res) {
    var url = getAuthUrl();
    res.send(`
            <h1>Authentication using google oAuth</h1>
            <a href=${url}>Login</a>
            `)
  });
  var https_options = {
    key: key,
    cert: cert
  };
  var port = 3000;
  var server = https.createServer(https_options, app);
  server.listen(port);
  server.on('listening', function() {
    console.log(`HTTPS Server listening to ${port}`);
  });

});

// export for testing

if (process.env.TESTING) {
  module.exports.getAuthUrl = getAuthUrl;
}
