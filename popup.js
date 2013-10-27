

function save_options() {

 
  var extEnabledCheckBox = document.getElementById("extensionEnabled");
  
  if(document.getElementById("extensionEnabled").checked == true){
   localStorage["extension_enabled"] = "enabled";
  }
  else
  {
   localStorage["extension_enabled"] = "disabled";
  }
  
  
  if(document.getElementById("highlightEnabled").checked == true){
  localStorage["highlight_enabled"] = "true";
  }
  else
  {
  localStorage["highlight_enabled"] = "false";
  }
 
 
 
}

//var bkg = chrome.extension.getBackgroundPage();

//bkg.console.log('foo');



// Restores select box state to saved value from localStorage.
function restore_options() {
	
setVersionNumber();

  if(localStorage["extension_enabled"] == "enabled"){
  document.getElementById("extensionEnabled").checked = true;
  }
  else{
  document.getElementById("extensionEnabled").checked = false;
  }
  
  
  if(localStorage["highlight_enabled"] == "true"){
  document.getElementById("highlightEnabled").checked = true;
  }
  else{
  document.getElementById("highlightEnabled").checked = false;
  }
  
}


document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#extensionEnabled').addEventListener('change', save_options);
document.querySelector('#highlightEnabled').addEventListener('change', save_options);



function setVersionNumber(){

var manifest = chrome.runtime.getManifest();
var heading = document.getElementById("app_name");

heading.innerHTML = manifest.name+ "<span class='ytcl_notice'>&nbsp;&nbsp;"+manifest.version+"</span>";

}





