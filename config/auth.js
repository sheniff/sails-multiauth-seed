// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth' : {
    'clientID'      : '616448298443694', // your App ID
    'clientSecret'  : '6e2b4972cced6a6577f6e07fccd62d4c', // your App Secret
    'callbackURL'   : 'http://localhost:1337/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey'     : 'NasAkk2KzwSucDHtrBDOdaPFA',
    'consumerSecret'  : 'qUNS21eOsu3Ld0ado5aj0ox2JKWH7mEtDrBfUx0Xn0EdW8OMwK',
    'callbackURL'     : 'http://localhost:1337/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID'      : '637723672343-bl690ftl8sn4r173kb9e0lb0ajghlb72.apps.googleusercontent.com',
    'clientSecret'  : 'wgttE2yXEGWOPNYSGDDkntgx',
    'callbackURL'   : 'http://localhost:1337/auth/google/callback'
  }

};
