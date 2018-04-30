module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    copy: {
      assets: {
        expand: true,
        src: ["**"],
        dest: "dist/assets",
        cwd: "game/assets/"
      }
    },
    jshint: {
        all: ['game/**/*.js']
    },
    'min': {
        'dist': {
            'src': ['dist/app.js'],
            'dest': 'dist/app.min.js'
        }
    },
    concat: {
      application: {
        src: ['game/lib/*.js', 'game/lib/momentjs/moment.js', 'game/init_app.js', 'game/ledges.js', 'game/mummys.js', 'game/grounds.js', 'game/models/*.js', 'game/init_game.js'],
        dest: 'dist/app.min.js'
      }
    },
    watch: {
      game: {
        files: ['game/*.js', 'game/*/*.js'],
        tasks: ['compile'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      game: {
        options: {
          port: 9092,
          base: ['.', 'dist']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-yui-compressor');


  grunt.registerTask('compile', ['concat', 'copy:assets']);
  grunt.registerTask('default', ['connect:game', 'compile', 'watch']);
};