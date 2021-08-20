'use strict';

const del = require('del');

module.exports = function (grunt) {
  grunt.initConfig({
    mochaTest: {
      default: {
        src: ['build/**/*.unit.js'],
      },
    },
    ts: {
      default: {
        tsconfig: './tsconfig.json',
        src: ['./src/**/*.ts', '!node_modules/**'],
        outDir: './build',
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.json', '!node_modules/**'],
            dest: './build',
          },
        ],
      },
    },
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('clean-build', function () {
    const done = this.async();
    del(['build/**/*']).then(() => done());
  });

  grunt.registerTask('build', ['clean-build', 'copy', 'ts']);
  grunt.registerTask('test', ['build', 'mochaTest']);
};