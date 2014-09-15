/**
* User.js
*
* @description :: User information. Can have many trainings and one set
                  as current training.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    name: {
      type: 'string'
    },

    email: {
      type: 'string',
      unique: true
    },

    picture: {
      type: 'string'
    },

    // Local authentication

    password: {
      type: 'string',
      required: true
    },

    // FB Auth

    fbId: 'string',
    fbToken: 'string',
    fbEmail: 'string',
    fbName: 'string',

    // TW Auth

    twId: 'string',
    twToken: 'string',
    twDisplayName: 'string',
    twUsername: 'string',

    // G Auth

    gId: 'string',
    gToken: 'string',
    gEmail: 'string',
    gName: 'string',

    //Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();

      // removing some sensitive info
      delete obj.password;
      delete obj.fbId;
      delete obj.fbToken;
      delete obj.twId;
      delete obj.twToken;
      delete obj.gId;
      delete obj.gToken;

      return obj;           // return the new object without password
    },

    generateHash: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    },

    // checking if password is valid
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  },

  afterCreate: function(user, cb) {}
};
