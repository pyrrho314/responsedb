function initialiseSettings(){

if(typeof localStorage["extension_enabled"] == 'undefined'){
	localStorage["extension_enabled"] = "enabled";
    }
	
if(typeof localStorage["highlight_enabled"] == 'undefined'){
	localStorage["highlight_enabled"] = "true";
    
	
	console.log("localStorage['highlight_enabled']: "+localStorage["highlight_enabled"]);
	}	

}
initialiseSettings();


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "sendenabledsetting"){
      sendResponse({farewell: localStorage["extension_enabled"]});
	  }
	 else if(request.greeting == "sendhighlightsetting"){
	 sendResponse({farewell: localStorage["highlight_enabled"]});
	 }
	 else{
	 
	 }
  });






