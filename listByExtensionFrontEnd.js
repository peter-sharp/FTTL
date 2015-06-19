var listByExtension = require('./listByExtension.js');

listByExtension(process.argv[2],process.argv[3],function(err,list){
  console.log(list.join('\n'));
})
