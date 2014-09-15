/**
 * MainController.js
 *
 * @description :: Main controller of the app, it will mainly control if an
                   user is logged in or not to redirect to the login page or
                   to send him to the OPA.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

  login: function(req, res) {
    // res.view('login', { _layoutFile: './layout_famous.ejs' });
    res.view('login');
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/login');
  },

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // Local login
  lcLogin: passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),

  // Local signup
  lcSignup: passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),

  // Facebook login
  fbLogin: passport.authenticate('facebook', { scope: 'email' }),

  // Facebook login callback
  fbCb: passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),

  // Twitter login
  twLogin: passport.authenticate('twitter'),

  // Twitter login callback
  twCb: passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }),

  // Google login
  gLogin: passport.authenticate('google', { scope: ['profile', 'email'] }),

  // Google login callback
  gCb: passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),

  // =============================================================================
  // JSON AUTHENTICATE ===========================================================
  // =============================================================================

  lcLoginJson: function(req, res) {
    passport.authenticate('local-login', function(err, user) {
      if (err || !user)
        res.badRequest({error: 'Invalid email or password'});
      else
        req.logIn(user, function() {
          res.send({status: 'ok'});
        });
      return;
    })(req, res);
  },

  logoutJson: function(req, res) {
    req.logout();
    res.send({status: 'ok'});
  },

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  // locally --------------------------------
  connect: function(req, res) { res.render('connect-local.ejs', { message: req.flash('loginMessage') }); },
  connectCb: passport.authenticate('local-signup', { successRedirect : '/', failureRedirect : '/connect/local', failureFlash : true }),

  // facebook -------------------------------
  fbConnect: passport.authorize('facebook', { scope : 'email' }),
  fbConnectCb: passport.authorize('facebook', { successRedirect : '/', failureRedirect : '/' }),

  // twitter --------------------------------
  twConnect: passport.authorize('twitter', { scope : 'email' }),
  twConnectCb: passport.authorize('twitter', { successRedirect : '/', failureRedirect : '/' }),

  // google ---------------------------------
  gConnect: passport.authorize('google', { scope : ['profile', 'email'] }),
  gConnectCb: passport.authorize('google', { successRedirect : '/', failureRedirect : '/' }),

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================

  unlink: function(req, res) {
    var user      = req.user;
    user.email    = undefined;
    user.password = undefined;
    user.save(function(err) { res.redirect('/'); });
  },

  fbUnlink: function(req, res) {
    var user     = req.user;
    user.fbToken = undefined;
    user.save(function(err) { res.redirect('/'); });
  },

  twUnlink: function(req, res) {
    var user     = req.user;
    user.twToken = undefined;
    user.save(function(err) { res.redirect('/'); });
  },

  gUnlink: function(req, res) {
    var user    = req.user;
    user.gToken = undefined;
    user.save(function(err) { res.redirect('/'); });
  }
};
