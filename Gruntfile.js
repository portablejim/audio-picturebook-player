/* jshint node:true */
'use strict';

module.exports = function (grunt) {

    // grunt config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: false,
                    beautify: true
                },
                files: {
                    'build/APbP.js': ['src/js/player.js']
                }
            },
            build: {
                options: {
                    mangle: true,
                    compress: true,
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'build/APbP.min.js': ['src/js/player.js']
                }
            }
        },
        sass: {
            dev: {
                options: {
                    force: true,
                    precision: 10,
                    style: 'expanded',
                    loadPath: 'sass'
                },
                files: {
                    'build/APbP.css': 'src/sass/player.scss'
                }
            },
            build: {
                options: {
                    force: true,
                    precision: 10,
                    style: 'compressed',
                    loadPath: 'sass'
                },
                files: {
                    'build/APbP.min.css': 'src/sass/player.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                map: true           // updates existing map from sass
            },
            dev: {
                src: 'build/APbP.css'
            },
            build: {
                src: 'build/APbP.min.css'
            }
        },
        watch: {
            options: {
                livereload : true
            },
            uglify: {
                files: ['src/js/*.js'],
                tasks: ['uglify:dev']
            },
            scss: {
                files: ['src/sass/*.scss'],
                tasks: ['css:dev']
            }
        }
    });

    // load modules
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');

    // all task(s)
    grunt.registerTask('js:dev',    ['uglify:dev']);
    grunt.registerTask('js:build',  ['uglify:build']);
    grunt.registerTask('css:dev',   ['sass:dev', 'autoprefixer:dev']);
    grunt.registerTask('css:build', ['sass:build', 'autoprefixer:build']);

    grunt.registerTask('build:dev',  ['js:dev',   'css:dev']);
    grunt.registerTask('build',      ['js:build', 'css:build']);

    grunt.registerTask('default', ['build:dev', 'watch']);
};

