module.exports = function(grunt) {
  //load all Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadTasks('tasks');
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      development: {
        files: {
          "css/styles.css": "css/styles.less"
        }
      }
    },

    watch: {
      scripts: {
        files: ['**/*.less','*.hbs'],
        tasks: ['less','compile'],
        options: {
          spawn: false,
        }
      },
      templates: {
        files: ['*.hbs'],
        tasks: ['compile'],
        options: {
          spawn: false,
        }
      }

    },

    compile: {
        template:"base.html",
        content:['about.hbs', 'bookaflight.hbs', 'contact.hbs', 'flights.hbs', 'gallery.hbs', 'index.hbs'],
        outputLocation:"./"
    }
  });
  // the default task (running "grunt" in console) is "watch"
  grunt.registerTask('default', ['less','compile','watch']);
}
