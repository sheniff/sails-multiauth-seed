var passport          = require('passport'),
    express           = require('express'),
    LocalStrategy     = require('passport-local').Strategy,
    FacebookStrategy  = require('passport-facebook').Strategy,
    TwitterStrategy   = require('passport-twitter').Strategy,
    GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy,
    configAuth        = require('./auth'),
    extend            = require('extend');

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

passport.serializeUser(function(user, done) {
  done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},

function(req, email, password, done) {

    process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findByEmail(email, function(err, user) {
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user && user.length) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {

          // if there is no user with that email, create the user
          User.create({
            email: email
          });
          User.password = User.generateHash(password);
          User.save(function(err, user) {
            if (err)
              throw err;
            return done(null, [user]);
          });
        }
      });
    });
}));


// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

// find a user whose email is the same as the forms email
// we are checking to see if the user trying to login already exists
  User.findByEmail(email, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err)
      return done(err);

    // if no user is found, return the message
    if (!user.length)
      return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    // if the user is found but the password is wrong
    if (!user[0].validPassword(password))
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

    // all is well, return successful user
    return done(null, user);
  });
}));

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================

passport.use(new FacebookStrategy({
  // pull in our app id and secret from our auth.js file
  clientID        : configAuth.facebookAuth.clientID,
  clientSecret    : configAuth.facebookAuth.clientSecret,
  callbackURL     : configAuth.facebookAuth.callbackURL,
  passReqToCallback: true
},

// facebook will send back the token and profile
function(req, token, refreshToken, profile, done) {

  // asynchronous
  process.nextTick(function() {

    var fbData = {
      fbId    : profile.id,               // set the users facebook id
      fbToken : token,                    // we will save the token that facebook provides to the user
      fbName  : [profile.name.givenName, profile.name.middleName, profile.name.familyName].join(' '), // look at the passport user profile to see how names are returned
      fbEmail : profile.emails[0].value,  // facebook can return multiple emails so we'll take the first
    };

    if(!req.user) {   // AUTHENTICATION

      User.findByFbId(profile.id, function(err, user) {

        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user && user.length) {
          // if there is a user id already but no token
          // (user was linked at one point and then removed)
          // just add our token and profile information
          if (!user[0].fbToken) {
            user[0].fbToken = token;
            user[0].fbName  = [profile.name.givenName, profile.name.middleName, profile.name.familyName].join(' ');
            user[0].fbEmail = profile.emails[0].value;

            user[0].save(function(err) {
              if (err)
                return(err);
              return done(null, user[0]);
            });
          }

          return done(null, user); // user found, return that user

        } else {

          // Temporary assign email and name from G data
          var tmpData = {
            name    : profile.name.givenName,
            email   : profile.emails[0].value,
            password: 'x123'
          };

          // if there is no user found with that facebook id, create them
          User.create(extend(true, tmpData, fbData), function(err, user) {

            if (err && !recoverUpdating(err, fbData, done))
              return done(err);

            return done(null, [user]);
          });

        } // else
      }); // find

    } else {   // AUTHORIZATION
      var user = req.user;

      extend(true, user, fbData).save(function(err) {

        if (err)
          return done(err);

        return done(null, [user]);
      });
    }

  }); // nextTick
}));

// =========================================================================
// TWITTER ================================================================
// =========================================================================

passport.use(new TwitterStrategy({
  // pull in our app id and secret from our auth.js file
  consumerKey    : configAuth.twitterAuth.consumerKey,
  consumerSecret : configAuth.twitterAuth.consumerSecret,
  callbackURL    : configAuth.twitterAuth.callbackURL,
  passReqToCallback: true
},

// twitter will send back the token and profile
function(req, token, tokenSecret, profile, done) {

  // asynchronous
  process.nextTick(function() {

    var twData = {
      twId         : profile.id,
      twToken      : token,
      twUsername   : profile.username,
      twDisplayName: profile.displayName
    };

    if(!req.user) {   // AUTHENTICATION

      // find the user in the database based on their twitter id
      User.findByTwId(profile.id, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user && user.length) {
          // if there is a user id already but no token
          // (user was linked at one point and then removed)
          // just add our token and profile information
          if (!user[0].twToken) {
            user[0].twToken       = token;
            user[0].twUsername    = profile.username;
            user[0].twDisplayName = profile.displayName;

            user[0].save(function(err) {
              if (err)
                return(err);
              return done(null, user[0]);
            });
          }

          return done(null, user); // user found, return that user
        } else {

          var tmpData = {
            // Temporary assign email and name from TW data
            name    : profile.displayName,
            email   : profile.username + token + '@example.com', // TBDeleted
            password: 'x123'
          };

          User.create(extend(true, tmpData, twData), function(err, user) {

            if (err)
              return done(err);

            // if successful, return the new user
            return done(null, [user]);
          });

        } // else
      }); // find

    } else {   // AUTHORIZATION
      var user = req.user;

      extend(true, user, twData).save(function(err) {

        if (err)
          return done(err);

        return done(null, [user]);
      });
    }
  }); // nextTick
}));

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================

passport.use(new GoogleStrategy({

  clientID        : configAuth.googleAuth.clientID,
  clientSecret    : configAuth.googleAuth.clientSecret,
  callbackURL     : configAuth.googleAuth.callbackURL,
  passReqToCallback: true
},
function(req, token, refreshToken, profile, done) {

  process.nextTick(function() {

    var gData = {
      gId    : profile.id,
      gToken : token,
      gName  : profile.displayName,
      gEmail : profile.emails[0].value
    };

    if(!req.user) {   // AUTHENTICATION

      // try to find the user based on their google id
      User.findByGId(profile.id, function(err, user) {
        if (err)
          return done(err);

        if (user && user.length) {
          // if there is a user id already but no token
          // (user was linked at one point and then removed)
          // just add our token and profile information
          if (!user[0].gToken) {
            user[0].gToken = token;
            user[0].gName  = profile.displayName;
            user[0].gEmail = profile.emails[0].value;

            user[0].save(function(err) {
              if (err)
                return(err);
              return done(null, user[0]);
            });
          }

          return done(null, user);
        } else {

          // Temporary assign email and name from G data
          var tmpData = {
            name    : profile.displayName,
            email   : profile.emails[0].value,
            password: 'x123'
          };

          // if there is no user found with that google id, create them
          User.create(extend(true, tmpData, gData), function(err, user) {
            // If an error is thrown, try to recover updating an existing record
            if (err && !recoverUpdating(err, gData, done))
              return done(err);
            else
              return done(null, [user]);
          });

        } // else
      }); // find

    } else {   // AUTHORIZATION
      var user = req.user;

      extend(true, user, gData).save(function(err) {

        if (err)
          return done(err);

        return done(null, [user]);
      });
    }

  });   // nextTick
}));

// Passport as auth middleware

module.exports = {
 express: {
    customMiddleware: function(app){
      console.log('@@ express middleware for passport @@');
      app.use(passport.initialize());
      app.use(passport.session());

      console.log('@@@@@@@ Lifting middleware for extra static content @@@@@@@');
      app.use('/styles', express.static(process.cwd() + '/assets/angular/.tmp/styles'));
      app.use('/images', express.static(process.cwd() + '/assets/angular/app/images'));
      app.use('/scripts', express.static(process.cwd() + '/assets/angular/app/scripts'));
      app.use('/views', express.static(process.cwd() + '/assets/angular/app/views'));
      app.use('/bower_components', express.static(process.cwd() + '/assets/angular/app/bower_components'));
    }
  }
};

// Helpers

// error recovery: update existing register
function recoverUpdating(err, data, done) {

  if (err.invalidAttributes &&
      err.invalidAttributes.email &&
      err.invalidAttributes.email[0].rule === 'unique') {

    User.findOneByEmail(err.invalidAttributes.email[0].value)
        .exec(function(err, user) {
          if(err) return done(err);

          // Populate with data
          for (var i in data) if (data.hasOwnProperty(i)) {
            user[i] = data[i];
          }

          // Save user
          user.save(function(err, user) {
            if(err) return done(err);
            return done(null, [user]);
          });

        });

    return true;
  }

  else
    return false;
}
