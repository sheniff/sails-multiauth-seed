/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {

  '/': {
    controller: 'app',
    action: 'index'
  },

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // Custom routes here...
  'get /login':                   'MainController.login',
  'post /login':                  'MainController.lcLogin',
  'get /logout':                  'MainController.logout',
  'post /signup':                 'MainController.lcSignup',

  'post /login.json':             'MainController.lcLoginJson',
  'get /logout.json':             'MainController.logoutJson',

  // FB auth
  'get /auth/facebook':           'MainController.fbLogin',
  'get /auth/facebook/callback':  'MainController.fbCb',

  // TW auth
  'get /auth/twitter':            'MainController.twLogin',
  'get /auth/twitter/callback':   'MainController.twCb',

  // G auth
  'get /auth/google':             'MainController.gLogin',
  'get /auth/google/callback':    'MainController.gCb',

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  'get /connect/local':            'MainController.connect',
  'post /connect/local':           'MainController.connectCb',

  'get /connect/facebook':         'MainController.fbConnect',
  'get /connect/facebook/callback':'MainController.fbConnectCb',

  'get /connect/twitter':          'MainController.twConnect',
  'get /connect/twitter/callback': 'MainController.twConnectCb',

  'get /connect/google':           'MainController.gConnect',
  'get /connect/google/callback':  'MainController.gConnectCb',

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  'get /unlink/local':            'MainController.unlink',
  'get /unlink/facebook':         'MainController.fbUnlink',
  'get /unlink/twitter':          'MainController.twUnlink',
  'get /unlink/google':           'MainController.gUnlink',

  // If a request to a URL doesn't match any of the custom routes above, it is matched
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};
