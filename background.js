console.log("loading background.js");
console.log("window.location.href", window.location.href);

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


function browser_event(rq,sender, sendResponse)
{
    console.log("back27: background.js browser_event", rq, sender);
    // @@GLOBAL: possible collision?  or is the enclosure below of "options" safe?
    var options = {sender:sender};
    function rcvAllTabs(thetabs)
    {
        console.log("rcvAllTabs31:", thetabs, options);
        _njn.send_callback_event("all_tabs",
                                 { rq:rq,
                                   all_tabs: thetabs
                                 },
                                 options);
    }
    var tabs = chrome.tabs.query(
        {  },
        rcvAllTabs
        );
    sendResponse({answer:true});
}

var listen_count = 0;
var last_state = null;

function spider_event(rq,sender,sendResponse)
{
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

function element_event(rq,sender, sendResponse)
{
	console.log("bg59: element_event", rq);
	console.log("bg60: sender", sender);
	var cmd = rq.cmd;
	var answer = {};
	answer.ack = true;
	answer.fate = "event_initiated";
	answer.command = rq.cmd;
	
	switch (cmd)
	{
		case "element_save":
			var element_type = rq.element_type;
			rdb_spider.saveElement(element_type, rq.record);
			break;
		case "element_curse":
			console.log("bg74: background receiving element_curse (rq, sender)", rq, sender);
			//  this guy has to know what sort of event is being generated...
			//  that is: lexicon of foreach, complete etc, has to be consistent 
			//  accross all iDB transactions so this guy can operate generically otherwise
			var options = {sender: sender};
			rdb_spider.backgroundHandleRequest(rq, options);
			
			
			// _njn.send_callback_event("complete", rq, options);
			break;
		default:
			answer.fate = "failed";
			answer.reason = "command_unknown";
	}	
	sendResponse( answer );				
}

_njn.listen(
	{ callback: 
			function (rq, sender, sendResponse)
			{
				//var a = window.open();
				//a.document.body.innerHTML = "HELLO THERE";
				console.log("back27: recieving _njn message==>", rq)
				var cmd = rq.cmd;
				if (cmd.indexOf("spider_") >= 0)
				{
					spider_event(rq,sender,sendResponse);
				}
				else if (cmd.indexOf("element_") >= 0)
				{
					element_event(rq,sender,sendResponse);
				} 
				else if (cmd.indexOf("browser_") >= 0)
                {
                    browser_event(rq, sender, sendResponse);
                }
				
				
			}
	});
	

//var a = window.open();
//a.document.body.innerHTML = "HELLO THERE";



