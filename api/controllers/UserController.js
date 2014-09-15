/**
 * UserController.js
 *
 * @description :: Exposes some methods to deal with user model
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  // TODO: Remember to verify policies! No API accessible if not logged in!
  current: function(req, res) {
    var current = req.user[0];

    // populate categories data
    XpPerCat.find({user: current.id}).populate('category')
      .exec(function(err, xps) {
        current.xps = xps;
        res.json(current);
      });

  }

};
