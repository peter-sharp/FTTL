// helper object to make adding and subtracting classes easier for ie 8 browser compatible class manipulation
var Class = { // FIXME re-write to add to the element.prototype.classList if missing. I.e. in ie 8
  add: function(element,_class){
    var classes = element.className.split(" ");
    classes.push(_class);
    element.className = classes.join(" ");
  },
  remove: function(element,_class){
    var classes = element.className.split(" ");
    classes.splice(classes.indexOf(_class), 1)
    element.className = classes.join(" ");
  }
}




function setActiveTab () {
    var path =          window.location.pathname;
    var currentPage =   path.split('/').pop();
    if (currentPage === '') {
      currentPage = 'index.html';
    }
    var tabs =          document.querySelectorAll('.tab');

    for (t = 0; t <= tabs.length-1; t++) {
        var tab = tabs[t];
        var link =      tab.getAttribute("href");
        //console.log(tab, tab.classList,currentPage,link);
        if(link.indexOf(currentPage) > -1) {
            //console.log(currentPage+"found!");
            Class.add(tab,"current");
        }
    }
}



// accordion pattern adapted from http://www.elated.com/articles/javascript-accordion/
var accordion = {
    that:       this,
    items:      [],
    button: {},
    hideTag: {},

    // Initializes the accordion
    //parameter 1 'visible': int The index of the accordionitem to show on starup
    //parameter 2 'buttonClass': string The class name of the element that will trigger the accorion items visibility
    //parameter 3 'hideTag': string The part of the accordion to be hidden or shown
    init:       function (visible,buttonClass,hideTag) {
      // grab the accordion items from the page
      var itemsNodelist = document.querySelectorAll('.accordionItem');
      this.items = Array.prototype.slice.call(itemsNodelist); // converts the items Nodelist object to an array

      //attaches the toggleItem() event to all HTML elements with the 'accordionItem' class. IDEA turn into object method.
      for (var index = 0; index < this.items.length; index++) {
        var item = this.items[index];
        this.button = item.querySelectorAll(buttonClass);
        this.hideTag = item.querySelectorAll((item.nodeName+">"+hideTag))[0]; //TODO will need to replace for ie 8 support
        // assign onCLick handlers to each item
        var button = this.getFirstChildWithTagName(item, buttonClass);
        button.onclick = this.toggleItem.bind(accordion); //using onClick instead of addEventListener for ie 8 support.
        //Also using bind() to transfer some properties to the onclick event.(not sure if I'm using it correctly)
        this.hideTag.classList.add("hide_tag");
        //set the z-index for each accordion so they stack
        item.style.zIndex = index;

      }

      this.setAccordionItemVisibility(visible);


    },
    //Hide all item bodies except for the one in the argument 'visible'
    //parameter 1 'visible': int Index of the item to be shown
    setAccordionItemVisibility: function(visible){
      for (var index = 0; index < this.items.length; index++) {
        var item = this.items[index];
        var triangle = item.querySelector('.arrow_right');; // FIXME (triangle) will throw an error if this method is used on an element without that class e.g. when used to hide/show a menu.

        if (index !== visible) {
          triangle.classList.remove("rotate_90");//FIXME (triangle)
          item.classList.add("hide");

        }
        else { // rotate the selected item's triangle and remove hide class
          item.classList.remove("hide");
          triangle.classList.add("rotate_90"); // FIXME (triangle)
        }


      }
    },

    getFirstChildWithTagName: function(element,tagname) {
      return element.getElementsByTagName( tagname )[0];

    },
    toggleItem: function (event){
        var target = event.target || event.srcElement;
        event = event || window.event // cross-browser event
        event.stopPropagation
            ? event.stopPropagation()
            : (event.cancelBubble=true); //stop the event from bubbling

        var buttonName = this.button[0];

        var isParentNode = target.parentNode.nodeName === buttonName.nodeName; // HACK there is probably a better way of including child elements.
        var item = (isParentNode)
          ? target.parentNode.parentNode
          : target.parentNode;

        var itemClass = item.className;

        var itemAccordionIndex = this.items.indexOf(item);
        console.log(itemAccordionIndex);
        this.setAccordionItemVisibility(itemAccordionIndex);


    },
}

//################### stateSelector ###################
// hides and changes elements with class names that correspond to the state of a select input
// @param selectName string The class name of the select input element.
//
var StateSelector = function (selectName) {

    console.info("Name of select element: "+selectName);
    this.choice = '';
    this.selector = document.getElementsByName( selectName )[0];
    //console.log("Select object: ",this.selector);
    this.firstname = 'bob';


    this.changeActiveState =  function(event) {
      event = event || window.event // cross-browser event
      var infoSections = document.querySelectorAll(".info");
      var selector = this.selector;

      console.info(this,'.changeActiveState\'s selector:',this.selector);
      this.choice =  selector.options[selector.selectedIndex].value; //gets the string value of the select element
      var chosenSection = document.querySelector("."+this.choice);



      for(var i = 0; i < infoSections.length; i++) {
          var section = infoSections[i];
          switch(section){
            case chosenSection:
              this.isSelected(section);
              break;
            default:
              this.isNotSelected(section);
          }
      }//for

    }

    this.isSelected = function (section){
      section.style.display = "";
    }

    this.isNotSelected = function (section){
      section.style.display = "none";
    }

    this.selector.onchange = this.changeActiveState.bind(this);
    this.changeActiveState();

}


var LocationSelector = function (selectName,locationCoords) { // extend StateSelector prototype adding gogle maps functionality
  StateSelector.call(this, selectName);
  this.locationCoords= locationCoords;
  console.log("LocationSelector:" + selectName);

  this.isSelected =  function(section) {
    console.log('Currentsection: ',section)
    chosenCoords= this.locationCoords[this.choice];
    section.style.display = "";
    var zoom = (this.choice == "wellington") ? 17 : 14;
    googleMap.init(chosenCoords[0],chosenCoords[1],zoom);
  }

}

LocationSelector.prototype = Object.create(StateSelector.prototype); // Set prototype to StateSelector's
LocationSelector.prototype.constructor = LocationSelector; // Set the constructor back to LocationSelector


//################### lightboxGallery (aka the all-nighter monster) ###################
var Lightbox  = { // mostly written during an all nighter so expect the namespace to be confusing

    mediaHolder     : {},
    thumbnails      : [],
    lightboxThumbs  : [],
    lightboxOBJ       : {},
    show            : false,
    controls        : {
      Close:          {},
      Next:           {},
      Prev:           {},
    },
    currentMedia    : {},

    gallery         : {},
    lightbox        : {}, // refference to the
    init                : function(galleryPage,lightbox){
        Lightbox.gallery     = document.querySelector('.'+galleryPage);

        Lightbox.lightboxOBJ    = document.querySelector('.'+lightbox);
        Lightbox.thumbnails  = Lightbox.getMediaInClassElements('row');


    },
    //
    // gets all image and video elements contained in elements of a given classname
    // @param string className The name of the class that cointains media
    // @return array thumbnails An array containing all video and image nodes
    //
    getMediaInClassElements    : function(className){
        var elements    =              Lightbox.gallery.querySelectorAll('.'+className);
        var thumbnails  =              [];
        for ( element  in elements) { // grabbing refferences to all the nodes in the rows
          var elementChildren = elements[element].childNodes; //(includes comment nodes so be careful)
          for(var child in elementChildren) {
            var media = elementChildren[child];
            if(media.nodeName === "IMG" || media.nodeName === "VIDEO"){
              thumbnails.push(media);
            }
          }
        }
        return thumbnails;
    },

    //
    // gets all the control and display elements in the lightbox element
    //
    getLightboxElements: function(lightboxOBJ){
        var objects = {};

        objects.controls.Close = lightboxOBJ.querySelector('.close').querySelector('.centered'); // centered is the inner div we're most likely to click on.
        objects.controls.Next =  lightboxOBJ.querySelector('.next').querySelector('.arrow_right'); // the next and prev hitboxes are
        objects.controls.Prev =  lightboxOBJ.querySelector('.prev').querySelector('.arrow_left');// used for postioning.
        objects.mediaHolder =    lightboxOBJ.querySelector('.media');

        return objects;
    },

    bindClickEventsToItems: function(items, action){
        for(var i in items){
            var item = this.items[i];
            item.onclick = action;
        }
    },

    // gets the element that triggered given event and prevents the event from bubbling further
    getEventTarget :  function(event){
      var target = event.target || event.srcElement;
      event = event || window.event // cross-browser event
      event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true); //stop the event from bubbling
      return target;
    },
    // toggles the lightbox

    toggleLightboxShow :    function(event){ //TODO want to separate functions to initialize the gallery from functions and properties belonging to the lightbox (At least make LightBox Gallery something smaller)


      var target = LightBoxGallery.getEventTarget(event);

      var mediaHolder = LightBoxGallery.mediaHolder; // for some reason properties bound with .bind aren't found in the namespace of functions inside them
      var lightbox =    LightBoxGallery.lightbox;



      var lightboxStyles = window.getComputedStyle(lightbox,null);

      if (!lightbox.show){ // Show the lightbox
          Class.add(lightbox, "show");
          lightbox.show = true;
          lightbox.setCurrentMedia(target); //TODO define setCurrentMedia function


          console.log(self.lightbox.className);
      }


      if(lightbox.getAction(target) === 'close'){
        Class.remove(lightbox, "show");
        lightbox.show = false;
      }
    },

    getAction: function (target){
      var lightbox = LightBoxGallery.lightbox;
      var lightboxBG = lightbox.childNodes[1];
      var targetName = target.className;
      var action = '';

      switch (targetName){
        case lightbox.controls.Next.className:
          action = 'next';
          break;
        case lightbox.controls.Prev.className:
          action = 'prev';
          break;
      }

      var targetIsBGorCloseBtn = (this.show && targetName == lightboxBG.className) ||  (this.show && targetName.indexOf(this.controls.Close.className) > -1);
      if (targetIsBGorCloseBtn) { //hide the lightbox if the background or close-icon is clicked
        action = 'close';
      }

      return action;
    },

    setMedia:  function (media) {

          var source = media.getAttribute("value");
          //console.log("Displaying ",source ," in ",mediaHolder);
          if (media.nodeName === "IMG") {
            var displayMedia = document.createElement("img");
            displayMedia.src = source;
          }

          displayMedia.onload = function () {

            mediaWidth = mediaHolder.offsetWidth;
            mediaHeight = (((displayMedia.height)/(displayMedia.width))*mediaWidth)+"px";

            //console.log(mediaHeight,mediaWidth);
            mediaHolder.innerHTML = displayMedia.outerHTML;

            mediaHolder.style.height = mediaHeight;
          }


    },

    moveToMedia: function (direction) {
          var thumbnails =  LightBoxGallery.thumbnails;
          var newLocation = thumbnails.indexOf(this.currentMedia);

          if(direction === "prev"){
            //previousElementSibling
            newLocation -= 1;
          }

          if(direction === "next"){
            //nextElementSibling
            newLocation += 1;
          }

          // go to the beginning if we click next at the end
          if(newLocation > thumbnails.length-1){
            newLocation = 0;
          }

          // go to the end if we click previous at the begging
          if(newLocation < 0){
            newLocation = thumbnails.length-1;
          }


          setMedia(thumbnails[newLocation]);
          console.log("next:"+thumbnails[thumbnails.indexOf(this.currentMedia)]+" at index: "+thumbnails.indexOf(this.currentMedia));
    }





}

// ################### Valid8tor ###################
var formValidator = {
    requiredFields: document.getElementsByClassName('required'),

    init: function () {
       // console.log('initialising your required fields!')
        for (var i = 0; i < this.requiredFields.length; i++) {
            this.requiredFields[i].onblur= function () {
              var target = event.target || event.srcElement;
              event = event || window.event // cross-browser event
              event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true); //stop the event from bubbling

                console.log("Validated!");
                if (!target.value) { //note that 'this' in this context reffers to the object the event listener is attached to.
                    Class.remove(target,'success');
                    Class.add(target,'error'); //add the style required to tell the user it's needed
                }else{
                    Class.remove(target,'error');
                    Class.add(target,'success'); //add the style required to tell the user they've won
                }

            }.bind(formValidator);

        }

    }
};

// ################### ElementCloner ###################

var elementCloner = {
  clone: function (origin, target, keepTarget) { // put on an event handler set target to this. origin must be a class
    console.log("cloning...");
    var clonee = document.querySelector((origin.indexOf(".")>-1) ? origin : "."+origin);
    var clone = clonee.cloneNode(true);
    var targetParent = target.parentNode;
    targetParent.insertBefore(clone, target);
    console.log("cloned: ",clonee.className," to ",target.className);
  }
}

//################### GoogleMap ###################
var googleMap = {
  init: function(lat,lng,zoom) {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
      center: new google.maps.LatLng(lat,lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
  }
}

if(typeof google === 'object' && typeof google.maps === 'object') { //executes the following code if google maps has loaded
  googleMap.init(-45.047550, 168.736855,13);
}


//################### main ###################


if (document.body.querySelector('.current') == null){
  setActiveTab();
}
accordion.init(0,'HGROUP','div');
//accordion.init(0,'.mobile_menu','ul');

var contactLocations = {queenstown:[-45.047550, 168.736855],
wanaka:[-44.718094, 169.119321],
wellington:[-41.287542, 174.776426]}

if (document.body.querySelector('.contact') !== null){
  var locationselector = new LocationSelector("locations",contactLocations);
}

if (document.body.querySelector('.gallery') !== null && document.body.querySelector('.lightbox') !== null){
  Lightbox.init('gallery','lightbox');
}

if (document.body.querySelector('.book') !== null){
  formValidator.init();
}
