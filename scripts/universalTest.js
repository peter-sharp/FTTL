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

      Lightbox.init('gallery', 'lightbox');



      assert.equal(Lightbox.show, false );
      assert.equal(typeof Lightbox.gallery, 'object');
      assert.equal(Lightbox.gallery.constructor, 'function HTMLElement() { [native code] }');
      assert.equal(Lightbox.gallery.className, 'gallery');

      assert.equal(typeof Lightbox.lightboxOBJ, 'object');
      assert.equal(Lightbox.lightboxOBJ.constructor, 'function HTMLElement() { [native code] }');
      assert.ok(Lightbox.lightboxOBJ.className.indexOf('lightbox') > -1);
      assert.equal(Lightbox.thumbnails.length, 12);
      done();
  })
});
