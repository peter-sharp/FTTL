//  TODO put IE8 support script into separate js file
function ieHTML5support () {
    var isLowerThanIE9 = document.querySelector("HTML").className === "oldie";

    if (isLowerThanIE9){
      document.createElement('HEADER');
      document.createElement('HGROUP');
      document.createElement('NAV');
      document.createElement('MAIN');
      document.createElement('SECTION');
      document.createElement('ARTICLE');
      document.createElement('FOOTER');
    }
}

function showWarning() {

  var main = document.querySelector("MAIN");

  var warning = document.createElement("p");
  warning.innerText = "Your internet explorer version lower than ie9. Up-grade it at http://windows.microsoft.com/en-us/internet-explorer/download-ie";
  alert(main+warning);
  main.appendChild(warning);
}

ieHTML5support();
