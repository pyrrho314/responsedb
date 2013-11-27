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

console.log("Response DB: background element: attaching");

var listen_count = 0;
var last_state = null;
_njn.listen(
	{ callback: 
			function (rq, sender, sendResponse)
			{
				//var a = window.open();
				//a.document.body.innerHTML = "HELLO THERE";
				console.log("back27: heard something!", rq)
				
				var cmd = rq.cmd;
				var response = {ack:true,
								changed:false
							   };
				
				if (last_state != rq.cmd)
				{
					switch(cmd)
					{	
						case "spider_active":
							chrome.browserAction.setBadgeText({text: "busy"})
							break;
						case "spider_idle":
							chrome.browserAction.setBadgeText({text:""});
							break;
					}
					response.changed = true;
				}
							
				switch(cmd)
				{
					case "open_home":
					//@@CHROME @@SPECIFIC
					// this also worked... window.open("cge.html");
					chrome.tabs.create(
						{"url": "cge.html"}
						);
				}
				sendResponse({  ack: true,
								changed: false
							 });
				
			}
	});
	

//var a = window.open();
//a.document.body.innerHTML = "HELLO THERE";



