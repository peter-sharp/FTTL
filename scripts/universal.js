// helper object to make adding and subtracting classes easier for ie 8 browser compatible class manipulation
var Class = { // FIXME re-write to add to the element.prototype.classList if missing. I.e. in ie 8
  add: function(element,_class){
    var classes = element.className.split(" ");
    classes.push(_class);
    element.className = classes.join(" ");
  },
  remove: function(element,_class){
    var classes = element.className.split(" ");
    classes.splice(classes.indexOf(_class), 1);
    element.className = classes.join(" ");
  }
};



// accordion pattern adapted from http://www.elated.com/articles/javascript-accordion/
var accordion = {
    that:       this,
    items:      [],
    button: [],
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
        console.info(buttonClass);
        
        this.hideTag = item.querySelectorAll((item.nodeName+">"+hideTag))[1]; //TODO will need to replace for ie 8 support
        // assign onCLick handlers to each item
        var button = this.getFirstChildWithClassName(item, buttonClass);
        this.button.push(button);
        console.log(button);
        button.onclick = this.toggleItem.bind(accordion); //using onClick instead of addEventListener for ie 8 support.
        //Also using bind() to transfer some properties to the onclick event.(not sure if I'm using it correctly)
        this.hideTag.classList.add("hide_tag");
        //set the z-index for each accordion so they stack
        item.style.zIndex = (index + 1) * 10;

      }

      this.setAccordionItemVisibility(visible);


    },
    //Hide all item bodies except for the one in the argument 'visible'
    //parameter 1 'visible': int Index of the item to be shown
    setAccordionItemVisibility: function(visible){
      for (var index = 0; index < this.items.length; index++) {
        var item = this.items[index];
        var triangle = item.querySelector('.arrow_right'); // FIXME (triangle) will throw an error if this method is used on an element without that class e.g. when used to hide/show a menu.

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

    getFirstChildWithClassName: function(element,className) {
      return element.getElementsByClassName( className )[0];

    },
    toggleItem: function (event){
        var target = event.target || event.srcElement;
        event = event || window.event; // cross-browser event
        event.stopPropagation
            ? event.stopPropagation()
            : (event.cancelBubble=true); //stop the event from bubbling

        var buttonName = this.button[0];

        var isParentNode = target.parentNode.nodeName === buttonName.nodeName; // HACK there is probably a better way of including child elements.
        var item = (isParentNode)
          ? target.parentNode.parentNode
          : target.parentNode;

       

        var itemAccordionIndex = this.items.indexOf(item);
        console.log(itemAccordionIndex);
        this.setAccordionItemVisibility(itemAccordionIndex);


    },
};
//################### toggler ###################
// hides and changes elements with class names that correspond to the state of a select input
// @param selectName string The class name of the select input element.
//

var Toggler = (function() {
    var toggleItem = {};
    var toggleButton = {};
    var toggled = true;
    
    var isSelected = function (section){
      section.style.display = "";
    };

    var isNotSelected = function (section){
      section.style.display = "none";
    };
    
   var toggle =  function(event) {
      

      var chosenSection = document.querySelector("."+this.choice);

      switch(toggled){
        case chosenSection:
          isSelected(toggleItem);
          toggled = false;
          break;
        default:
          isNotSelected(toggleItem);
          toggled = true;
      }
    
      
    };
    
    return {
      init:function(item,button){
        toggleItem = document.querySelector(item);
        console.info(toggleItem);
        toggleButton = document.querySelector(button);
        document.addEventListener('click',toggleButton,toggle());
    }
  };

   
})();
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
      event = event || window.event; // cross-browser event
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

    };

    this.isSelected = function (section){
      section.style.display = "";
    };

    this.isNotSelected = function (section){
      section.style.display = "none";
    };

    this.selector.onchange = this.changeActiveState.bind(this);
    this.changeActiveState();

};


var LocationSelector = function (selectName,locationCoords) { // extend StateSelector prototype adding gogle maps functionality
  StateSelector.call(this, selectName);
  this.locationCoords= locationCoords;
  console.log("LocationSelector:" + selectName);

  this.isSelected =  function(section) {
    console.log('Currentsection: ',section);
    var chosenCoords= this.locationCoords[this.choice];
    section.style.display = "";
    var zoom = (this.choice == "wellington") ? 17 : 14;
    googleMap.init(chosenCoords[0],chosenCoords[1],zoom);
  };

};

LocationSelector.prototype = Object.create(StateSelector.prototype); // Set prototype to StateSelector's
LocationSelector.prototype.constructor = LocationSelector; // Set the constructor back to LocationSelector







// ################### Valid8tor ###################
var formValidator = {
    requiredFields: document.getElementsByClassName('required'),

    init: function () {
       // console.log('initialising your required fields!')
        for (var i = 0; i < this.requiredFields.length; i++) {
            this.requiredFields[i].onblur= function () {
              var target = event.target || event.srcElement;
              event = event || window.event; // cross-browser event
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
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
  }
};

if(typeof google === 'object' && typeof google.maps === 'object') { //executes the following code if google maps has loaded
  googleMap.init(-45.047550, 168.736855,13);
}


//################### main ###################



accordion.init(0,'title','div');
//accordion.init(0,'.mobile_menu','ul');

var contactLocations = {queenstown:[-45.047550, 168.736855],
wanaka:[-44.718094, 169.119321],
wellington:[-41.287542, 174.776426]};

if (document.body.querySelector('.contact') !== null){
  var locationselector = new LocationSelector("locations",contactLocations);
}



if (document.body.querySelector('.book') !== null){
  formValidator.init();
}

if (matchMedia) {
	var mq = window.matchMedia("(min-width: 1000px)");
  mq.addListener(Toggler.init('.main-menu','.mobile_menu'));
}
