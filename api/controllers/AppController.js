/**
 * AppController.js
 *
 * @description :: Entry point to the One Page App
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	index: function(req, res) {
    // res.sendFile('/assets/angular/app/index.html');
    res.render('app/index', {
      // _layoutFile: '../layout_angular.ejs',
      user: req.user[0]
    });
  }
};
