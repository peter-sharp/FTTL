

var fs = require('fs')
var path = require('path')

module.exports = function (location,ext,callback) {


    fs.readdir(location, function (err, list) {
      if(err)
          return callback(err);

      var matches = list.filter(function (file) {
          return path.extname(file) === '.' + ext;
     })
    callback(null,matches);
    })
}
