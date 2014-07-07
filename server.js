if (process.env.NEW_RELIC_ENABLED) {
  require('newrelic');
}
var WebmakerUserClient = require('webmaker-user-client');
var WebmakerAuth = require('webmaker-auth');
var Habitat = require('habitat');
Habitat.load();


// Configuration
var env = new Habitat();

// Heroku clearbase support
if (!env.get('DB_CONNECTIONSTRING') && env.get('cleardbDatabaseUrl')) {
  env.set('DB_CONNECTIONSTRING', env.get('cleardbDatabaseUrl').replace('?reconnect=true', ''));
}

var auth = new WebmakerAuth({
  loginURL: env.get('LOGIN_URL'),
  secretKey: env.get('SESSION_SECRET'),
  forceSSL: env.get('FORCE_SSL'),
  domain: env.get('COOKIE_DOMAIN')
});
var userClient = new (require('webmaker-user-client'))({
  endpoint: env.get('LOGIN_URL_WITH_AUTH')
});
var db = require('./models')(env.get('db'), userClient, env.get('EVENTS_FRONTEND_URL'));

var app = require('./config')(env, db, auth, userClient);

// Run server
app.listen(env.get('PORT', 1989), function () {
  console.log('Now listening on %d', env.get('PORT', 1989));
});
