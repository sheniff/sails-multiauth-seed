/**
 * DevController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

function generateCategories (cb) {
  sails.log.info('[PopulateDB] Removing existing Categories...');

  Category.destroy().exec(function(err, categories) {

    sails.log.info('[PopulateDB] Removed ' + categories.length + ' categories.');

    var categories = [
      { name: 'Abs', description: 'Enjoy strengthening your middle body!' },
      { name: 'Chest', description: 'Get a real iron chest!' },
      { name: 'Shoulders', description: 'Didn\'t you want to fly? Start training those!' },
      { name: 'Arms', description: 'Be the king of the beach this summer with some nice triceps!' },
      { name: 'Back', description: 'The exercises to get that back you always wanted!' },
      { name: 'Legs', description: 'Amazeballs legs are now possible, try these exercises!' },
      { name: 'Cardio', description: 'Keep your heart running!' }
    ];

    Category.create(categories).exec(function(err, cats) {
      sails.log.info('[PopulateDB] Created ' + cats.length + ' categories.');
      cb();
    });

  });
}

module.exports = {

  // We'll use it to populate DB (dev only)
  populatedb: function(req, res) {

    // generateCategories(function() {
    //   res.redirect('/category');
    // });

  },

  generateCategories: function(req, res) {
    generateCategories(function() {
      res.redirect('/category');
    });
  },

  clearUsers: function(req, res) {
    User.destroy().exec(function(err, users) {
      res.redirect('/user');
    });
  }

};
