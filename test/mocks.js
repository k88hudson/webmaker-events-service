
var fakeUser = {
  id: 1,
  email: 'jane@jsmith123123.com',
  username: 'jsmith123123',
  isAdmin: 1,
  isCollaborator: 0,
  isSuspended: 0,
  sendNotifications: 0,
  sendEngagements: 0,
  sendEventCreationEmails: 0,
  wasMigrated: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  bio: 'I really like to make things',
  location: 'Toronto, Canada',
  preflocale: 'en-US',
  subscribeToWebmakerList: 0,
  isSuperMentor: 0,
  isMentor: 0,
  sendMentorRequestEmails: 0,
  sendCoorganizerRequestEmails: 0
};
module.exports.fakeUser = fakeUser;
module.exports.addFakeUser = function (req, res, next) {
  req.session.user = fakeUser;
  req.session.email = fakeUser.email;
  next();
};

var WebmakerAuth = require('webmaker-auth');
var auth = new WebmakerAuth({
  loginURL: 'http://test.test',
  secretKey: 'test'
});
auth.handlers = {
  authenticate: function (req, res, next) {
    req.session.user = fakeUser;
    req.session.email = fakeUser.email;
    res.json({
      user: fakeUser,
      email: fakeUser.email
    });
  },
  exists: function (req, res, next) {
    if (req.body.username === fakeUser.username) {
      res.send(200);
    } else {
      res.send(404);
    }
  },
  verify: function (req, res) {
    if (!req.session.email && !req.session.user) {
      return res.send({
        status: 'No Session'
      });
    }
    res.send({
      status: 'Valid Session',
      user: req.session.user,
      email: req.session.email
    });
  },
  create: function (req, res, next) {
    res.session.user = fakeUser;
    res.session.email = fakeUser.email;
    res.json({
      user: fakeUser,
      email: fakeUser.email
    });
  },
  logout: function (req, res) {
    req.session.email = req.session.user = null;
    res.json({
      status: 'okay'
    });
  },
  bind: function (app) {
    app.post('/verify', self.handlers.verify);
    app.post('/authenticate', self.handlers.authenticate);
    app.post('/create', self.handlers.create);
    app.post('/logout', self.handlers.logout);
    app.post('/check-username', self.handlers.exists);
  }
};
module.exports.auth = auth;

module.exports.userClient = {
  returnUser: function (query, cb) {
    return cb(null, fakeUser);
  },
  returnUsers: function (query, cb) {
    return cb(null, [fakeUser]);
  },
  get: {
    byId: this.returnUser,
    byEmail: this.returnUser,
    byUsername: this.returnUser,
    byIds: this.returnUsers,
    byEmails: this.returnUsers,
    byUsernames: this.returnUsers
  },
  update: {
    byEmail: this.returnUser,
    byId: this.returnUser,
    byUsername: this.returnUser
  }
};
