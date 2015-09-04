
//yeah, this code's a bit of a mess

var PageCompiler = {
  base: [],
  contentFiles: [],
  outputFolder: './compiled/',
  fs: require('fs'),
  jsdom: require('../bower_components/jsdom/lib/jsdom.js').jsdom,

  compile: function(base,content,outputLocation){
    this.outputFolder = outputLocation;
    this.getBase(base, function(error){
        if(error) console.log("getBaseFile: "+error);
        PageCompiler.processContent(content);
    });
  },

  read: function(filelocation, callback)
  {
    this.fs.readFile(filelocation, 'utf8', function(error,file)
    {
      if(error) console.log("readFile "+error);
      callback(file);
    })
  },


  manipulateHTML: function (html, currentPage)
  {
      //var with page name
      //nested object with html changes for page
      //loop through using .replace() function to insert changes

    try
    {
      currentPage = currentPage.replace(".hbs", "");
      var document = PageCompiler.jsdom(html);

      var window = document.defaultView;
      var tabs =         window.document.getElementsByClassName('tab');
      for (t = 0; t <= tabs.length-1; t++) {
          var tab = tabs[t];
          var link =      tab.getAttribute("href");
          if(link.indexOf(currentPage) > -1) {
              console.log(currentPage+"found!");
              tab.className += " current";

          }
          //console.log(tab);
      }

      return "<!DOCTYPE html>\n"+window.document.documentElement.outerHTML;
      window.close();

    }
    catch(error)
    {
      console.log(currentPage+": "+window.document.documentElement.outerHTML);
      console.error("jsdom given:"+ typeof html);
      //console.warn('\n'+html);
      throw 'manipulateHTML: '+error;
    }

  },

  getBase: function  (base, callback)
  {
    this.read(base,function(file)
    {
      this.base = file.split('{{content}}');
      callback();
    })
  },

  asyncLoop: function(iterations, func, callback)
  {
    // loop needed for async operations
    var index = 0;
    var done = false;
    var loop =  {
                    next: function()
                    {
                      if (done)
                      {
                        return;
                      }

                      if(index < iterations)
                      {
                        index++;
                        func(loop);
                      }
                      else
                      {
                        done = true;
                        callback();
                      }
                    },

                    iteration: function()
                    {
                      return index -1;
                    },

                    break: function()
                    {
                      done = true;
                      callback();
                    }
                };
    loop.next();
    return loop;
  },


  processContent: function(contentList)
  {

        //console.log("Content files to processs: "+contentList);
        this.asyncLoop(contentList.length,function(loop)
        {
          var index = loop.iteration();
          var fileName = contentList[index];
          PageCompiler.read(fileName,function(file)
          {
            var currentContent = file;
            PageCompiler.combine(this.base, currentContent, function(combined,error)
            {
                if(error) console.log("combine "+error);
                /// file out-put handler here
                var manipulatedHTML = PageCompiler.manipulateHTML(combined,fileName);
                PageCompiler.outputFile(manipulatedHTML ,fileName);
                loop.next();

            })
          })

        },
        function()
        {
          console.log('Finished writing!');
        });
  },

  combine: function(base, content, callback)
  {   //inserts the content file in the middle of the split base file
      var combined = base.slice(); // clones the base array so we don't end up inserting content into the original base
      combined.splice(1,0,content);
      var result = combined.join("");
      callback(result);
  },



  outputFile: function(result,contentFile)
  {
      var outputLocation = this.outputFolder+contentFile.replace(".hbs", ".html");

      if (!this.fs.exists(this.outputFolder.substring(0, this.outputFolder.length - 1)))
      {
          this.fs.mkdir(this.outputFolder, function(error)
          {
              if(error) console.log("outputFile: mkDir: "+error);
          })
      }
      this.fs.writeFile(outputLocation, result, function(error)
      {
                      if(error) console.log("file write "+error);
                      //console.log("\n\nTo "+outputLocation+" \n\nwritten{\n"+result+"\n}");
      })
  }
};

var CLIinterface = {
  baseFile: '',
  contentFiles: [],// select elements from 3 onwards
  outputFolder: '',

  takeInput: function(){
    CLinput = process.argv;
    this.baseFile = CLinput[2];
    this.contentFiles = CLinput.slice(3);// select elements from 3 onwards
    this.outputFolder = this.outputLocation(this.contentFiles);

    if (CLinput[2] == '--help')
    {
      console.log("Page compiler takes a base file and any number of content files and\n outputs a html file for each combined with the base file. \n Text from the content files will be inserted at the {{content}} tag\n in the base file.\n\n Usage:\n page_compiler.js basefile contentfile1 contentfile2 .etc \n\n");
    }
    else if (!CLinput[2]|!CLinput[3])
    {
      console.log("Needs at least two files to work with. \n Use like this:\n page_compiler.js basefile contentfile1 contentfile2 .etc");
    }
    else
    {
      PageCompiler.compile(this.baseFile,this.contentFiles, this.outputFolder);
    }
  },

  outputLocation: function(contentFiles)
  {
      var location = '';
      for (param = 0; param < contentFiles.length-1; param++)
      {
          if(contentFiles[param] == '--file')
          {
              location = contentFiles[param+1];
              contentFiles.slice(0,param);
              break;
          }
      }
      return location;
  },

};

// module.exports.compile = function(base,content,outputLocation){
//   PageCompiler.compile(base,content,outputLocation);
// }; For Gulp
module.exports = function(grunt) {
  grunt.registerTask('compile', 'compiles html documents from a template and content files.', function(template,content,outputLocation) {
    var config = grunt.config.get('compile');

    PageCompiler.compile(config.template,config.content,config.outputLocation);
  });
};

// if(process.argv.length)
//   CLIinterface.takeInput();
