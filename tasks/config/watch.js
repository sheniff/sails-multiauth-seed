/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `assets` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {

	grunt.config.set('watch', {
		api: {

			// API files to watch:
			files: ['api/**/*']
		},
		assets: {

			// Assets to watch:
			files: ['assets/**/*', 'tasks/pipeline.js',
				// to ignore
				'!assets/lib',
				'!assets/lib/*',
				'!assets/lib/**/*',
				// Ignoring AngularJS folder completely as we'll use its own watcher
				// '!assets/angular',
				// '!assets/angular/*',
				// '!assets/angular/**/*'
				'!assets/angular/node_modules',
				'!assets/angular/node_modules/*',
				'!assets/angular/node_modules/**/*',
				'!assets/angular/app/.sass-cache',
				'!assets/angular/app/.sass-cache/*',
				'!assets/angular/app/.sass-cache/**/*',
				'!assets/angular/app/bower_components',
				'!assets/angular/app/bower_components/*',
				'!assets/angular/app/bower_components/**/*'
			],

			// When assets are changed:
			tasks: ['syncAssets' , 'linkAssets']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};
