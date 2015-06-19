function require(file){
    var head = document.getElementsByTagName('HEAD')[0];
    var script = document.createElement("script");
    script.src = file;
    head.appendChild(script);
};

var universal = require('./universal.js');
QUnit.test( "lightbox test", function( assert ) {
  //Set up fake html javascript elements
    var fixture = $('#qunit-fixture');

    var done = assert.async();
    fixture.load("./tmp/gallery.html main", function(){
      console.info("gallery.html main content loaded");

      assert.ok(fixture);

      Lightbox.init('gallery', 'lighbox');



      assert.equal(Lightbox.show, false );
      assert.equal(Lightbox.gallery.className, 'gallery');
      console.log(Lightbox.lightboxOBJ);
      assert.equal(Lightbox.lightboxOBJ.length, 1);
      assert.equal(Lightbox.lightboxOBJ.className, 'lightbox');
      assert.equal(Lightbox.thumbnails.length, 12);
      done();
  })
});
