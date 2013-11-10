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
				listen_count++;
				
				var cmd = rq.cmd;
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
					sendResponse({ack: true,
									changed: true
								 });
				}				
				else
				{
					sendResponse({  ack: true,
								changed: false
								 });
				}
			}
	});
	





