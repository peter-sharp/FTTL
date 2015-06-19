var gulp = require('gulp');
var PageCompiler = require('./page_compiler.js');

gulp.task('default', function() {
  PageCompiler.compile('base.html',['about.hbs', 'bookaflight.hbs', 'contact.hbs', 'flights.hbs', 'gallery.hbs', 'index.hbs'], './');

});

var watcher = gulp.watch('./**.hbs',['default']);
watcher.on('change', function(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
