var fs = require('fs');

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-replace');

	require('load-grunt-tasks')(grunt); //babel

	grunt.registerTask('default', [
		'clean:pre',

		'copy:scss',
		'copy:scss_plugins',

		'concat:js',
		'babel',
		'sass:build',
		'postcss:prefix',
		'postcss:min',
		'replace',
		'build_complete',
		'uglify',
	]);

	grunt.registerTask('js', [
		'clean:js',
		'concat:js',
		'babel',
		'replace:js',
		'build_complete',
		'uglify',
	]);

	grunt.registerTask('serve', [
		'default',
		'builddocs',
		'connect',
		'watch'
	])

	grunt.registerTask('builddocs',[
		'clean:builddocs',
		'shell:builddocs',
		'sass:builddocs',
		'postcss:builddocs',
	]);

	grunt.registerTask('build_complete', '', function() {
		var files, i, n, source, name, path, modules = [];

		// amd definitions must be changed to be not anonymous
		// @see https://github.com/selectize/selectize.js/issues/89
		files = [];
		for (i = 0, n = files_js_dependencies.length; i < n; i++) {
			path = files_js_dependencies[i];
			name = path.match(/([^\/]+?).js$/)[1];
			source = grunt.file.read(path).replace('define(factory);', 'define(\'' + name + '\', factory);');
			modules.push(source);
		}

		path = 'build/js/tom-select.js';
		source = grunt.file.read(path).replace(/define\((.*?)factory\);/, 'define(\'tomselect\', $1factory);');
		modules.push(source);

		// write output
		path = 'build/js/tom-select.complete.js';
		grunt.file.write(path, modules.join('\n\n'));
		grunt.log.writeln('Built "' + path + '".');
	});

	var files_js = [
		'src/contrib/*.js',
		'src/*.js',
		'!src/.wrapper.js',
		'!src/defaults.js',
		'!src/tom-select.js',
		'src/tom-select.js',
		'src/defaults.js',
	];

	var files_js_dependencies = [
		'node_modules/sifter/sifter.js',
		'node_modules/microplugin/src/microplugin.js',
	];

	var scss_plugin_files	= [];

	// enumerate plugins
	(function() {
		var selector_plugins = grunt.option('plugins');
		if( !selector_plugins ){
			selector_plugins = '*'; // default to all plugins
		}


		if (selector_plugins.indexOf(',') !== -1) {
			selector_plugins = '{' + selector_plugins.split(/\s*,\s*/).join(',') + '}';
		}

		// javascript
		files_js.push('src/plugins/' + selector_plugins + '/*.js');

		// scss (css)
		var matched_files = grunt.file.expand(['src/plugins/' + selector_plugins + '/plugin.scss']);
		for (var i = 0, n = matched_files.length; i < n; i++) {
			var plugin_name = matched_files[i].match(/src\/plugins\/(.+?)\//)[1];
			scss_plugin_files.push({src: matched_files[i], dest: 'build/scss/plugins/' + plugin_name + '.scss'});
		}

	})();

	var autoprefixer = require('autoprefixer')(
		{"overrideBrowserslist": [
			"last 1 major version",
			">= 1%",
			"Chrome >= 45",
			"Firefox >= 38",
			"Edge >= 12",
			"Explorer >= 10",
			"iOS >= 9",
			"Safari >= 9",
			"Android >= 4.4",
		]}
	);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// delete old build files
		clean: {
			pre: ['build/*'],
			js: ['build/*.js'],
			builddocs: ['build/docs/*']
		},

		// copy scss files to build folder
		copy: {
			scss:{
				files: [{
					'build/scss/tom-select.scss': ['src/scss/tom-select.scss'],
					'build/scss/tom-select.default.scss': ['src/scss/tom-select.default.scss'],
					'build/scss/tom-select.bootstrap3.scss': ['src/scss/tom-select.bootstrap3.scss'],
					'build/scss/tom-select.bootstrap4.scss': ['src/scss/tom-select.bootstrap4.scss'],
				}]
			},
			scss_plugins:{
				files: scss_plugin_files
			},
		},

		// replace @@version with current package version
		replace: {
			options: {
				prefix: '//@@',
				variables: {
					'version': '<%= pkg.version %>',
					'js': '<%= grunt.file.read("build/js/tom-select.js").replace(/\\n/g, "\\n\\t") %>',
				},
			},
			js: {
				files: [
					{src: ['src/.wrapper.js'], dest: 'build/js/tom-select.js'},
				]
			},
			// add version to css & scss headers
			css_post: {
				files: [
					{expand: true, flatten: false, src: ['build/css/*.css'], dest: ''},
					{expand: true, flatten: false, src: ['build/scss/*.scss'], dest: ''},
				]
			}
		},


		// compile css from scss
		sass: {
			options:{
				style:'expanded',
			},
			build: {
				files: [{
					'build/css/tom-select.css': ['src/scss/tom-select.scss'],
					'build/css/tom-select.default.css': ['src/scss/tom-select.default.scss'],
					'build/css/tom-select.bootstrap3.css': ['src/scss/-tom-select.bootstrap3.scss'],
					'build/css/tom-select.bootstrap4.css': ['src/scss/-tom-select.bootstrap4.scss'],
				}]
			},
			builddocs: {
				files: [{
					expand: true,
					flatten: true,
					ext: '.css',
					src: ['doc_src/css/*.scss'],
					dest: 'build/docs/css'
				}],
			}
		},

		// autoprefix && cssnanao
		postcss: {
			prefix: {
				options:{
					map: {
						inline: false, // save all sourcemaps as separate files...
					},
					processors: [
						//require('pixrem')(), // add fallbacks for rem units
						autoprefixer,
					]
				},
				files: [{expand: true, flatten: false, src: ['build/css/*.css'], dest: ''}],
			},
			min: {
				options: {
					map: {
						inline: false, // save all sourcemaps as separate files...
					},
					processors: [
						require('cssnano')() // minify the result
					]
				},
				files: [{
					'build/css/tom-select.min.css': ['build/css/tom-select.css'],
					'build/css/tom-select.default.min.css': ['build/css/tom-select.default.css'],
					'build/css/tom-select.bootstrap3.min.css': ['build/css/tom-select.bootstrap3.css'],
					'build/css/tom-select.bootstrap4.min.css': ['build/css/tom-select.bootstrap4.css'],
				}]
			},
			builddocs:{
				options:{
					map: {
						inline: false, // save all sourcemaps as separate files...
					},
					processors: [
						autoprefixer,
						require('cssnano')() // minify the result
					]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['build/docs/css/*.css'],
					dest: 'build/docs/css'
				}],
			},
		},

		// combine all the plugin.js files and tom-select.js into one file
		concat: {
			options: {
				stripBanners: true,
				separator: grunt.util.linefeed + grunt.util.linefeed
			},
			js: {
				files: {
					'build/js/tom-select.js': files_js,
				}
			},
		},

		// babel compile js
		babel: {
			options: {
				sourceMap: true
			},
			build: {
				files: {
					'build/js/tom-select.js': ['build/js/tom-select.js']
				}
			}
		},

		// run server at http://localhost:8000 to view documentation and run examples
		connect: {
			server:{
				options: {
					base: 'build/docs',
				}
			}
		},

		// generate /build/docs
		// see .eleventy.js for configuration
		shell: {
			builddocs: {
				command: 'npx @11ty/eleventy',
			},
		},

		// create .min.js files
		uglify: {
			main: {
				options: {
					'banner': '/*! tom-select.js - v<%= pkg.version %> | https://github.com/orchidjs/tom-select | Apache License (v2) */\n',
					'report': 'gzip',
					'ascii-only': true
				},
				files: {
					'build/js/tom-select.min.js': ['build/js/tom-select.js'],
					'build/js/tom-select.complete.min.js': ['build/js/tom-select.complete.js']
				}
			}
		},

		// watch for changes to files in /doc_src or /src
		watch: {
			docs:{
				files:[
					'doc_src/**',
				],
				tasks:[
					'builddocs',
				]
			},
			src:{
				files: [
					'src/**',
				],
				tasks: [
					'default',
					'builddocs',
				]
			}
		}
	});
};
