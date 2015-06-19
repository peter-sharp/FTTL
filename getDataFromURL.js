// var http = require('http');
// var arguments = process.argv.slice(2);
//
//
//  var addresses = [];
//  arguments.forEach(function(argument){
//   argument =  (argument.indexOf('http://') > -1) ? argument : 'http://' + argument;
//   addresses.push(argument);
// })
//
// function readHTTP (address,callback){
//   http.get(address,function(response){
//     var page = '';
//     response.setEncoding('utf8');
//     response.on('data',function(chunk) {
//       page += chunk;
//     })
//     response.on('end',function() {
//       callback(null,page,address); //returns the address and its page
//     })
//   }).on('error',function(err){
//     return callback("problem with request: " + err.message);
//   })
// }
//
//
//
//
//
// function getSitesInList (list, callback) {
//   var calledTimes = 0; //stores the number of completed requests
//
//   function countCompletedRequests (count,callback) {
//     calledTimes++;
//     if(calledTimes == count)
//         callback();
//     // console.log("called "+count+" times.")
//   }
//
//   // main function
//   var pages = {};
//   list.forEach(function(address){
//     //console.log(address);
//     readHTTP(address,function(err, page,address){
//       pages[address] = page;
//       countCompletedRequests(list.length,function(){
//         var orderedPages = [];
//
//         list.forEach(function(item){
//             orderedPages.push(pages[item]);
//         })
//         callback(null, orderedPages);
//
//       })//countCompletedRequest
//       if(err){
//         return callback(err);
//       }
//     })//readHTTP
//   });
// }
//
//
//
// getSitesInList(addresses,function(err,pages){
//
//   console.log(pages.join('\n'));
// });

var http = require('http');
var bl = require('bl');
var results = [];
var count = 0;

function printResults (){
  for(var i = 0; i < 3; i++)
    console.log(results[1]);
}

function httpGet (index) {
  http.get(process.argv[2+index], function (response) {
    response.pipe(bl(function (err, data){
      if (err)
        return console.error(err);

      results[index] = data.toString();
      count++

      if (count == 3)
        print results();
    }))
  })
}


for (var i = 0; i < 3; i++)
  httpGet(i);
