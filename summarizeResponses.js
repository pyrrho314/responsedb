//c/onsole.log("sr1:");

/*
chrome.runtime.sendMessage({greeting: "sendenabledsetting"}, function(response) {  
  
  if(response.farewell == "enabled"){
   $(document).ready(function() {
		app.insertLinksInit();
		//setTimeout(polling, 2000)
		});
  }
  
  
});

var ctq = chrome.tabs.query({active:true});
console.log("sR17:",ctq);
chrome.runtime.sendMessage({greeting: "sendhighlightsetting"}, function(response) {  
  
  if(response.farewell == "true"){
   app.highlight = true;
  }
  
  
});
 */

var iconURL = chrome.extension.getURL("icon48.png");

var insertEL = $("<div>",
				{
					// test: "SREP"
					css: {	border:"solid #d0d0d0 1px",
							height: "48px"
							
						 },
					"class":"summary_element"
				});
				// ACTUALLY SUMMARY EL!!!!!
				
rdb_summary_div = rdb_summary_DIV = insertEL;

insertEL.append( $("<img>",
						{
							src: iconURL,
							css: {display:"table-cell",
									float:"left",
									height: "48px",
								 }
						})
					);

var rstitle = $("<div>",
					{	text: "ResponseDB Summary ",
						css: {	fontSize: "20px",
								verticalAlign: "middle",
								//"margin-left" :"15px",
								//"margin-right":"15px",
								"padding-left":"53px",
								"margin-top":"15px",
								//display: "table-cell",
								height: "auto",
								width:"100%"
							 }
						
					});

var showhideLocalState = null;
if ("rdb_showhide_state" in localStorage)
{
	showhideLocalState = localStorage["rdb_showhide_state"];
}
else
{
	showhideLocalState = false;
}
var showhideOpened = showhideLocalState;	
var showhide = $ ("<input>",
				 	{	type:	"submit",
				 		class:  "showhideButton",
				 		id: 	"showhideSummaryButton",
				 		value: 	"",
				 		css: {	"margin-right":"58px",
				 				"margin-top":"14px",
				 				float:"right",
				 				width:"10em"
				 			 }
				 	}
				 );

var summary = $("<div>",
					{	class: "rdbSummary",
						css:{paddingBottom: "10px",
							 paddingTop: "10px",
							 overflow:"hidden"
							}
					}
				);
				
var usercursecommentsEL = $ ("<input>",
				 	{	type:	"submit",
				 		class:  "USERdbCurseComments",
				 		id: 	"rdb_UdbCCButton",
				 		value: 	"scan comments",
				 		css: {	"margin-right":"58px",
				 				"margin-top":"14px",
				 				border:"solid gray 1px",
				 				float:"right",
				 				fontSize: "60%",
				 				width:"10em"
				 			 }
				 	}
				 );
summary.append(usercursecommentsEL);

usercursecommentsEL.click( function (event)
	{
		var vid = rdbGetVideoIDFromURL();
		console.log("sR118:", vid);
		/*n9spider_yt_videoscan(vid, function (event)
			{
				console.log("sR122: completed videoscan for usercursecommentsEL");
			}
		);*/
	}
);
var ytsummaryTitle = $("<div>",
						{	css:{ textDecoration:"underline" },
							text: "Youtube Responses"
						});
var ytsummary = $("<div>",
					{	class: "rdbYtSummary"
					});
var othersummaryTitle = $("<div>",
						{	css:{ textDecoration:"underline" },
							text: "Other Responses"
						});

var othersummary = $("<div>",
					{
						class: "rdbOtherSummary"
					});

summary.append(ytsummaryTitle);
summary.append(ytsummary);
summary.append($("<br clear='all'/>"));
summary.append(othersummaryTitle);
summary.append(othersummary);
summary.hide();

//rstitle.append(showhide);
insertEL.append( showhide);
showhide.data("opened", showhideOpened);

insertEL.append( rstitle );
insertEL.append($("<br clear='all'/>"));
insertEL.append(summary);
//insertEL.append(showhide);
					
//$("#watch-discussion").before(insertEL);
//$("#watch-description-toggle").before(insertEL);
//insertEL.css("position:absolute;top:0;bottom:0");
//$("body").append(insertEL);

rdb_summary_div_ready=false;


function mkTextRight ()
{
	var opened = $(this).data("opened");
	if (!opened)
	{
		$(this).val("show summary");
	}
	else
	{
		$(this).val("hide summary");
	}
}
mkTextRight.call(showhide);

function mkShowHideRight ()
{
	var opened = $(this).data("opened");
	console.log("sR163:showhideright", opened);
	console.trace();
	var rdbs = $(".rdbSummary");
	if (opened)
	{
		/*var clues = rdb_spider.clueList();
		var rdbs    = rdb_summary_div.find(".rdbSummary");
		var rdboths = rdb_summary_div.find(".rdbOtherSummary");
		var rdbyts  = rdb_summary_div.find(".rdbYtSummary");
		
		
		for (var n = 0; n < clues.len; n++)
		{
			if (clue.protocol != "youtube2013")
			{
				var odiv = rdb_clue_div(clue);
				rdboths.append(odiv);
			}
		}*/						
		//$(".summary_element").height("auto");
		rdb_summary_div.height("auto");
		var indoc = $(".summary_element");
		if (indoc.length>0)
		{
			rdbs.slideDown();
		}
		else
		{
			rdbs.show();
		}
	}
	else
	{
		rdbs.slideUp(400, function ()
		{
			$(".summary_element").height("48px");
		
		});
	}
	
}


showhide.click(function () 
	{
		var curstate = $(this).data("opened");
		var newstate = !curstate;
		console.log("sR182: end of showhide click", rdb_spider);
		$(this).data("opened", newstate);
		mkShowHideRight.call(this);
		mkTextRight.call(this);
		
		// SAVE THIS state
		localStorage["rdb_showhide_state"] = newstate; 
		
	}
);
			
// this is a recursive timeout

var gvtl = rdbGenericVideoLinkTypes;
var genericVideoLinkTypes = gvtl;

function convert2links(){
	// console.log("sR103: checking for links to convert");
	
	for (genlinktypename in genericVideoLinkTypes)
	{
		var genlinktype = genericVideoLinkTypes[genlinktypename];
		
		//console.log("sR331:", genlinktype);
		var indicator = genlinktype.indicator;
		var regex = genlinktype.regex;
		var mkURL = genlinktype.mkURL;
		var mkID = genlinktype.mkID;
		var mkClue = genlinktype.mkClue;
		
		var haslinks = $(".comment-text:contains('"+indicator+"')"); //.not(":contains('RDB')");
		//console.log("sR105: found ", haslinks.length, "instances of", genlinktype.site );
		
		for (var n =0;  n<haslinks.length; n++)
		{
			var haslink = $(haslinks[n]);
			var uname = haslink.parent().find(".yt-user-name");
			var author = null;
			
			if (uname.length > 0)
			{
				uname  = uname[0];
				author = $(uname).text();
			}
			else
			{
				author = "unknown";
			}
			var comment = haslink.text()
			var patt = regex;
			var matches = comment.match(patt);
			try 
			{
				if (matches)
				{
					for (var j=0; j<matches.length; j++)
					{
						//console.log("sR181:", regex, comment);
						var groups = patt.exec(matches[j]);
						// console.log("sR183:", comment.match(patt));
						if (groups) 
						{
							var tehURL = mkURL(groups);
							var tehID = mkID(groups);
							//console.log("sR361:", tehURL,  JSON.stringify(groups));
							var tehID =  "rdblink_"+ tehURL.replace(/\.|\/|\?|=|:/g, "_");
							
							
							if (tehURL)
							{
								var RDBextant;
								try 
								{
									RDBextant = $("#"+tehID);	
								}
								catch (err)
								{
									RDBextant = null;
								}
								var videoID = mkID(groups);
								if (RDBextant && RDBextant.length == 0)
								{
									//console.log("sR202: linking ", RDBextant, tehURL, tehID);
									//console.log("sR203: extant length", RDBextant.length);
									
									var tehurl = tehURL;
									var icon = $("<img>",
												{
													src: iconURL,
													css: { display: "table-cell",
															 float: "left",
															height: "16px"
														 }
												});
									var newlink = $("<a>",
												{
													href:tehurl,
													html: " <span style='font-size:70%'> [RDB Generated] </span> ",
													css: {	color:"blue"
														 }
												}).append($("<b>", {text:genlinktype.site + ": " + videoID}));
									//haslink.prepend(newlink);
			
									var rdbgl = $("<div>",
													{
														css: {	padding: "2px",
																border:"solid #4040a0 1px"
															 },
														id: tehID,
														class: "rdb_link"
													});
									rdbgl.append(icon);
									rdbgl.append(newlink);
									
									// haslink.prepend(rdbgl);
									var extants = haslink.find(".rdb_link");
									if (extants.length)
									{
										extants.last().css("border-bottom", "none");
										rdbgl.css("border-top", "none");
										extants.last().after(rdbgl);
									}
									else
									{
										haslink.prepend(rdbgl);
									}
									
									// THIS IS WHERE WE HAVE ADDED A LINK... MAKE IT A HIND
									tehclue = mkClue.call(genlinktype, groups);
									tehclue.source = "content_scan";
									tehclue.content = comment; 
									tehclue.author = author;
									//@review: misnomer... comment should be N9Comment obj not text
									
									rdb_spider.addClue(tehclue);
								}
							}
						}	
					}
				 }
				 else
				 {
				 	// console.log("sR233:", patt, comment);	
				 }
			}
			catch (err)
			{
				console.log("sR238:caught ",err);
				console.log("sR238: ERROR", patt, comment);
				throw err;
			}
		}
	}
}

///////////////////////////////
// RDB MODULE (will move to responsedb.js)
///////////////////////////////
//   rdb_clue_div
function rdb_clue_div(clue, options)
{
	var videoID = clue.videoID;
	
	var tehurl = clue.URL;
	if (clue.source != "content_scan")
	{
		console.log("sR371 clue", clue);
	}
	  /*
	var icon = $("<img>",
				{
					src: iconURL,
					css: { display: "table-cell",
							 float: "left",
							height: "16px"
						 }
				});
	*/
	/*
	var labelcolor = clue.rcolor ? clue.rcolor: "black";
	var rlabel  = $("<span>",
					{
						text: " response:  ",
						css: {	fontSize: "70%",
								
								color: labelcolor
							 }
					}
				  );
	*/
	var rcolor = clue.rcolor ? clue.rcolor: "white";
	
	var linklabel = $("<span>",
					{	html:"<br clear='all'/>direct link &rarr; ",
						css: {	fontSize:"85%",
								paddingLeft:"10px"
							 }
					});
					
	var newlink = $("<a>",
				{
					href:tehurl,
					css: {	
						 }
				}).append($("<b>", {text: tehurl}));
	//haslink.prepend(newlink);
	
	////
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	var rdbgl = $("<div>",
					{
						css: {	padding: "2px",
								border:"solid #4040a0 1px",
								//backgroundColor:backcolor
							 },
						class: url2id(videoID,"clue")
							 + " rdb_link"
					});
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	////				
	//// AUTHOR'S NAME ELEMENT
	if (clue.author)
	{	var author = $("<div>",
					{	text:clue.author ,
						css: {	fontSize:"115%",
								display:"inline-block",
								backgroundColor:"white",
								padding: "2px",
								fontWeight: "bold",
								color: "black"
							 }
					});
		//rdbgl.prepend("<br clear='all'/>");
		rdbgl.prepend(author);
	}
	
	
	///// COMMENT TIME ELEMENT
	var commenttime = clue.timestamp ? clue.timestamp : null;
	if (commenttime)
	{
		var timestamp = $("<div>",
						{	css: {
									float:"right",
								 },
							text: new Date( commenttime).toLocaleString()
							
						}
					 );
		rdbgl.append(timestamp);
		rdbgl.attr("data-timestamp", commenttime);
		console.log("sR392: commenttime", commenttime);
	}
	
	///// PROVNOTES
	/////
	var provnotes = $("<div>", 
					{	
					});
					
	///// SOURCE DISPLAY ELEMENT
	var source = clue.source ? clue.source : "unidentified"
	var sourceel = $("<div>",
					{	text: source.split(".")[0],
						css:{ 	float: "left",
								fontSize:"70%",
								color: "white",
								backgroundColor: "black",
								padding:"1px",
								margin:"1px"
							}
					})
	provnotes.append(sourceel);
	
	///// SOURCE DISPLAY ELEMENT
	var site = clue.site ? clue.site : null;
	if (site)
	{
		var siteel = $("<div>",
					{	text: site,
						css:{ 	float: "left",
								fontSize:"70%",
								color: rcolor,
								backgroundColor: "black",
								padding:"1px",
								margin:"1px"
							}
					})
		provnotes.append(siteel);
	}
	rdbgl.append(provnotes);
	//rdbgl.append(rlabel);
	rdbgl.append(linklabel);
	rdbgl.append(newlink);
	
	
	if (clue.content)
	{
		var cont = $("<div>",
					{	text: clue.content,
						css: {
								border:"solid gray 1px",
								margin:"2px",
								padding:"3px",
								backgroundColor:"white",
							 }
					});
		rdbgl.append(cont);
	}
	
	return rdbgl;
}


function rdbInsertClueSorted(parentdiv, newdiv)
{
	// SPECIAL CASE: no children in summary yet.
	var childs = parentdiv.find(".rdb_link");
	//c/onsole.log("sR473: insert sorted... #of rdb_links", childs.length);
	if (childs.length == 0)
	{
		parentdiv.append(newdiv);
		return;
	}
	//a lert("element #"+childs.length);
	// ELSE there are oldersiblings
	// SPECIAL CASE: new div has no time (get timestamp here too)
	var timeattr = newdiv.attr("data-timestamp");
	var last = parentdiv.children().last();
	
	console.log("sR481: insert sorted", timeattr);
	var timestamp = parseInt(timeattr);
	
	if (! timestamp)
	{
		parentdiv.append(newdiv);
		last.css("border-bottom", "none");
		return;
	}
	
	// ELSE there are siblings and this div has a timestamp
	for (var n =0; n<childs.length; n++)
	{
		var sibling = $(childs[n]);
		var sibltime = sibling.attr("data-timestamp");
		//c/onsole.log("sR501:", sibltime , sibltime>=timestamp ? ">=" : "<",timestamp);
		if (!sibltime || (timestamp <= sibltime))
		{
			newdiv.insertBefore(sibling);
			newdiv.css("border-bottom","none");
			return;
		}
	}
	
	// ELSE it is newest, append afterall
	last.css("border-bottom", "none");
	parentdiv.append(newdiv);
}
function rdbGetURLParm ( key ) {
  //key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS =    "[?&]"
  				+ key
  				+ "=([^&#]*)";
  var regex = new RegExp( regexS );
  var value = regex.exec( window.location.href );
  if( value == null )
    return null;
  else
    return value[1];
}

//
//
////////////////////////////////
////////////////////////////////
////////////////////////////////
var target = document.querySelector('#watch-discussion');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type != "attributes")
    {
    	//c onsole.log("sR159:",mutation.type);
  	}
  });
  var location= $("#comments-view"); //$("#watch-discussion");
  var summary = $(".summary_element");
  //c/onsole.log("sR509: summary length", summary.length, summary);
  if (summary.length < 1)
  {
		location.before(rdb_summary_DIV);
		rdb_summary_div_ready = true;
		var showhide = $("#showhideSummaryButton");
		console.log("sR514: ",summary.length); 
		mkShowHideRight.call(showhide);
  }
  convert2links(); 
});

var opts =  {attributes:true, subtree:true};
//c/onsole.log("sR413:",observer.observe);
observer.observe(target,opts);

//
//
//

_njn.register("spider_event", function (event)
	{
		//c/onsole.log("sR421: spider_event", event);
	}
);


function rdbGetVideoIDFromURL()
{
	var vidid;
	vidid = rdbGetURLParm("v");
	return vidid;
}
////// SCAN VIDEO AT SITE

_njn.register("idb_connected", function (event)
	{

		var vidid = rdbGetVideoIDFromURL();

		console.log("sR440:", window.location.href, vidid);
		n9spider_l2s_videoscan(vidid, 
			function ()
			{
				console.log("sR443: scan success", this);
				rdb_spider.dbCurseComments({video_id:this.videoID});
				
				// this.n9video.yt_scan_comments();
			}
			);
	}
);
function user_caused_dbCurseComments()
{
	var vidid = rdbGetVideoIDFromURL();

	console.log("sR505: user_caused_dbCurseComments", window.location.href, vidid);
	n9spider_l2s_videoscan(vidid, 
		function ()
		{
			console.log("sR443: scan success", this);
			rdb_spider.dbCurseComments({video_id:this.videoID});
		
			// this.n9video.yt_scan_comments();
		}
	);
}
function url2id(url, pre)
{
	var prefix = pre? pre : "";
	
	var id = url.replace(/\.|\/|\?|=|:/g, "_");
	return pre+"__"+id;
}
	
function rdbProcessClue(cmd, clue)
{
 	//c/onsole.log("sR445:", clue);
	var clueEL = $("."+url2id(clue.videoID, "clue"));
	if (clueEL.length)
	{
		clueEL.css("opacity", ".5");
		clueEL.css("background-color","lightYellow");
		clueEL.hide();
		console.log("sR695:", clue);
		//return;
	}
		
 	if (false) //clue.protocol == "youtube2013")
	{
		
		var rdboths = $(".rdbOtherSummary");
		var rdbyts = $(".rdbYtSummary");
		var n9vid = rdb_spider.videos_by_id[clue.videoID];
		//c onsole.log("sR448:", clue.videoID, n9vid);
		if (n9vid)
		{
			var div = n9spider_yt_video_div({n9_video: n9vid} );
			div.css("width","150px");
			div.css("height", "200px");
			div.css("float","left");
			rdbyts.append(div);
		}
	}
	else
	{
		var tehdiv = rdb_clue_div(clue);
		var source = clue.source ? clue.source : "default";
		if (source == "default")
		{
			
		}
		else if (source == "content_scan")
		{
			tehdiv.css("background-color","#e0f0e0");
		}
		else if (source.indexOf("spider.") >= 0)
		{
			tehdiv.css("background-color","#e0e0ff");
		}
		
		var rdboths = rdb_summary_div.find(".rdbOtherSummary");
		
		//c onsole.log("sR483:", cmd, clue);
		rdbInsertClueSorted(rdboths, tehdiv);	
		//rdboths.append(tehdiv);
	}
 }
_njn.register("clue_new", 
				function (clue) { rdbProcessClue("new_clue", clue);}
			 );
_njn.register("clue_update", 
				function (clue) { rdbProcessClue("clue_update",clue);}
			 );