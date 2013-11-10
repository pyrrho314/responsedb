console.log("sr1: summarizeResponses.js extension");

var MASSIVE_DEBUG = false;

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

var spidername = "robot";
var spideridleterm = " ready";
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
							
							},
					}
				);
				

/// FLOATING RIGHT: scan controls
/// FLOATING RIGHT: scan controls
/// FLOATING RIGHT: scan controls

var userscanyoutubeEL = $ ("<input>",
				 	{	type:	"submit",
				 		class:  "USERscanYTVideo",
				 		id: 	"rdb_UdbScanYTVideo",
				 		value: 	"Load from YouTube",
				 		
				 		css: {	"margin-right":"10px",
				 				"margin-top":"14px",
				 				border:"solid gray 1px",
				 				float:"right",
				 				fontSize: "75%",
				 				width:"12em"
				 			 }
				 	}
				 );
summary.append(userscanyoutubeEL);

var usercursecommentsEL = $ ("<input>",
				 	{	type:	"submit",
				 		class:  "USERdbCurseVideo",
				 		id: 	"rdb_UdbCCButton",
				 		value: 	"Load From local iDB",
				 		
				 		
				 		css: {	"margin-right":"10px",
				 				"margin-top":"14px",
				 				border:"solid gray 1px",
				 				float:"right",
				 				fontSize: "75%",
				 				width:"12em"
				 			 }
				 	}
				 );
summary.append(usercursecommentsEL);


userscanyoutubeEL.click( function (event)
	{
		var vid = rdbGetVideoIDFromURL();
		console.log("sR118:", vid);
		n9spider_yt_videoscan(vid, function (event)
			{
				console.log("sR148: completed youtube video scan");
			}
		);
	}
);

usercursecommentsEL.click( function (event)
	{	
		var vid = rdbGetVideoIDFromURL();
		var extants = $(".rdb_link");
		/*extants.css({
						"border-left-style":"dashed",
						"border-right-style":"dashed"
					});
		*/
		extants.animate({opacity:.2
					 },
					 {duration: 3000,
					 });
		
		$(this).prop("disabled", true);			
		n9spider_idb_videoscan(vid, 
			{complete: 
				function (event)
					{
						usercursecommentsEL.prop("disabled", false);
						console.log("sR158: completed idb video retrieval");
					}
			}
		);
	});

/// eof FLOATING RIGHT SCANNER CONTROLS
/// eof FLOATING RIGHT SCANNER CONTROLS
/// eof FLOATING RIGHT SCANNER CONTROLS


var ytsummaryTitle = $("<div>",
						{	css:  { textDecoration:"underline" },
							text: "Youtube Responses"
						});
var ytsummary = $("<div>",
					{	class: "rdbYtSummary"
					});
var othersummaryTitle = $("<div>",
						{	css:{ textDecoration:"" },
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
var spiderActivityEL = $("<div>", {
							class:"spider_acts",
							css:{"border":"solid green 1px",
									padding: "2px",
									marginLeft : "10px",
									float: "right",
									width:"200px",
									textAlign: "center",
									height:"42px", // 48 - padding*2 - border*2
									overflow: "hidden",
									fontSize:"80%"
								},
						});
var spiderStateEl = $("<div>",
						{	class: "spider_state",
							text: spidername + " " + spideridleterm,
							css: { 	margin:"1px",
									padding:"1px",
									border:"solid darkBlue 1px"
								 }
						});
spiderActivityEL.append(spiderStateEl);

insertEL.append(spiderActivityEL);
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
	//c/onsole.log("sR163:showhideright", opened);
	//c/onsole.trace();
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
		this.blur();
	}
);
			
// this is a recursive timeout

var gvtl = rdbGenericVideoLinkTypes;
var genericVideoLinkTypes = gvtl;


var _sR_checkOpts = {
	source: "content_scan",
	author: "anonymous",
	
	callback: function (clue){
		if (!this.count)
		{
			this.count = 1;
		}
		else
		{
			this.count++;
		}
		console.log("sR262: clue callbacks from check comments %%%%%%%%%%%%%%", this.count);
		return; 
		var elID = url2id(clue.URL+clue.author, "rdb_clue_link");
		var url = clue.URL;
		var videoID = clue.videoID;
		var comment = this.commentEL;
		if (url)
		{
			var RDBextant;
			try 
			{
				RDBextant = $("#"+elID);	
			}
			catch (err)
			{
				RDBextant = null;
			}
			
			if (RDBextant && RDBextant.length ==0)
			{
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
								href:url,
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
									id: elID,
									class: "rdb_link"
								});
				rdbgl.append(icon);
				rdbgl.append(newlink);
				
				var extants = comment.find(".rdb_link");
				if (extants.length)
				{
					extants.last().css("border-bottom", "none");
					rdbgl.css("border-top", "none");
					extants.last().after(rdbgl);
				}
				else
				{
					comment.prepend(rdbgl);
				}
									
			}
		}
	}
};

function timeago2time(timeago)
{
	// convert youtube comment "time ago string" to date approximation.
	timeago = $.trim(timeago);
	var terms = timeago.split(" ");
	var quantity = parseInt(terms[0]);
	var units = terms[1];
	if (terms[2] != "ago")
	{
		return 0;
	}
	//c/onsole.log("xr331:", timeago);
	//c/onsole.log("sR332:", terms);
	var timestamp = new Date().getTime();
	
	switch(units)
	{
		case "second":
		case "seconds":
			timestamp  -= (quantity *1000);
			break;
		case "minute":
		case "minutes":
			timestamp -= (quantity * 60000);
			timestamp -= (timestamp % 60000);
			break;
		case "hour":
		case "hours":
			timestamp -= (quantity * 360000);
			timestamp -= (timestamp % 360000);
			break;
		case "day":
		case "days":
			timestamp -= (quantity * 86400000);
			timestamp -= (timestamp % 86400000);
			break;
		case "week":
		case "weeks":
			timestamp -= (quantity *	 604800000);
			timestamp -= (timestamp % 604800000);
			break;
		case "month":
		case "months":
			timestamp -= (quantity * 2.62974e9);
			timestamp -= (timestamp % 2.62974e9);
			break;
		case "years":
		case "year":
			timestamp -= (quantity * 3.15569e10);
			timestamp -= (timestamp % 3.15569e10);
			break;
	}
	
	return timestamp;
}

var _sR_numcomments = 0;
function convert2linksNEW()
{	
	
	// get comments from the page itself
	var comments = $(".comment-text");
	//c/onsole.log("sR323: ",comments.length, "comments in page");
	if (comments.length == _sR_numcomments)
	{
		return;
	}
	else
	{
		_sR_numcomments = comments.length;
	}
	for (var n = 0; n<comments.length; n++)
	{
		//c/onsole.log("sR324: comment", n, "of", comments.length);
		var comment = $(comments[n]);
		var text = comment.text();
		_sR_checkOpts.commentEL = comment;
		
		var uname = $(comment.parent().find("p.metadata > .author > .yt-user-name")[0]);
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
		_sR_checkOpts.author = author;
		
		var ytime = $(comment.parent().find("p.metadata > .time > a")[0]);
		//c/onsole.log("CGE RULES:", ytime.text());
		if (ytime.length)
			_sR_checkOpts.estimated_timestamp = timeago2time(ytime.text());
		
		
		rdb_spider.checkTextForClues(text, _sR_checkOpts)
	}
}

function convert2linksOLD(){
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

// development switch for refactoring convert2liinks
convert2links = convert2linksNEW;



///////////////////////////////
// RDB MODULE (will move to responsedb.js)
///////////////////////////////
//   rdb_clue_div
var _sR_clue_div_id = 0;
function rdb_clue_div(clue, options)
{
	_sR_clue_div_id++;
	var videoID = clue.videoID;
	
	var tehurl = clue.URL;
	if (clue.source != "content_scan")
	{
		//console.log("sR371 clue", clue);
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
					{	html:"link &rarr; ",
						class: "clue_link_label",
						css: {	fontSize:"85%",
								paddingLeft:"10px"
							 }
					});
					
	var newlink = $("<a>",
				{
					href:tehurl,
					class: "clue_link",
					css: {	
						 }
				}).append($("<b>", {text: tehurl}));
	//haslink.prepend(newlink);
	
	////
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	//console.log("&&&&&&&&&&&&&&&&&&&&&&", clue);
	var clueid = clue2id(clue);
	var rdbgl = $("<div>",
				{
					css: {	padding: "2px",
							border:"solid #4040a0 1px",
							//backgroundColor:backcolor
						 },
					class: url2id(videoID,"clueto")
						 + " rdb_link",
					id: clueid
				});
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	//// CREATE THE RETURNED DIV
	////				
	//// AUTHOR'S NAME ELEMENT
	var debugorder = false;
	if (debugorder)
	{
		var order = $("<span>",
					{
						text: _sR_clue_div_id,
						css: { padding:"3px",
								border:"solid black 1px",
								margin:"1em"
							 }
					});
		rdbgl.prepend(order);
	}
	if (clue.author)
	{	
		var author_pretty  = clue.author_pretty? clue.author_pretty: clue.author;
		var author = $("<div>",
					{	text:author_pretty ,
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
		console.log("sR752:", clue);
	}
	
	
	///// COMMENT TIME ELEMENT
	//c/onsole.log("sR648: clue_div", clue);
	var commenttime = clue.timestamp ? 
						clue.timestamp : null;
	if (commenttime)
	{
		var timestamp = $("<div>",
						{	css: {
									float:"right",
								 },
							text: new Date(commenttime).toLocaleString()
							
						}
					 );
		rdbgl.append(timestamp);
		rdbgl.attr("data-timestamp", commenttime);
		//c/onsole.log("sR392: commenttime", commenttime);
	}
	else
	{  // estimated comment time
		var commenttime = clue.estimated_timestamp ?
						            clue.estimated_timestamp: null;
	
		if (commenttime)
		{
		var timestamp = $("<div>",
						{	css: {
									float:"right",
								 },
							text: new Date(commenttime).toLocaleString() + " (estimated)"
							
						}
					 );
		rdbgl.append(timestamp);
		rdbgl.attr("data-timestamp", commenttime);
		//c/onsole.log("sR392: estimated commenttime", commenttime);
		}
	}
	//
	//////
	
	
	
	if (clue.content)
	{
		// first, make the matched text a link.
		
		var content = clue.content;
		content = content.replace(clue.match, "<a href='"+tehurl+"'>"+clue.match+"</a>");
		var cont = $("<div>",
					{	html: content,
						class: "comment_content",
						css: {
								border:"solid gray 1px",
								margin:"2px",
								padding:"3px",
								backgroundColor:"white",
							 }
					});
		rdbgl.append(cont);
	}
	///// PROVNOTES
	/////
	var provnotes = $("<div>", 
					{
					});
	///////////
	//
	//  ///////   //    //////  //////
	//    //    // //  //      /// 
	//	 //   /////// // ////     ///
	//  //   //   // /////// ///////
	// 	
	///// SOURCE DISPLAY ELEMENT
	var source = clue.source ? clue.source : "unidentified"
	var sourcekey = source.split(".")[0];
	var sourceel = $("<div>",
					{	text: sourcekey,
						css:{ 	//float: "left",
								display: "inline-block",
								fontSize:"70%",
								color: "white",
								backgroundColor: "#808080",
								padding:"1px",
								paddingLeft:"3px",
								paddingRight:"3px",
								margin:"1px"
							}
					})
	provnotes.append(sourceel);
	
	///// SITE DISPLAY ELEMENT
	var site = clue.site ? clue.site : null;
	if (site)
	{
		var siteel = $("<div>",
					{	text: site,
						css:{ 	//float: "left",
								display: "inline-block",
								fontSize:"70%",
								color: rcolor,
								backgroundColor: "#505050",
								padding:"1px",
								paddingLeft:"3px",
								paddingRight:"3px",
								margin:"1px"
							}
					})
		provnotes.append(siteel);
	}
	
	
	
	//
	//
	//
	//
	// 
	//rdbgl.append(rlabel);
	rdbgl.append(linklabel);
	rdbgl.append(newlink);
	
	rdbgl.append(provnotes);
	
	
	
	return rdbgl;
}


function rdbInsertClueSorted(parentdiv, newdiv)
{
	// SPECIAL CASE: no children in summary yet.
	var childs = parentdiv.children(".rdb_link"); // children is to ignore nested double votes
	//c/onsole.log("sR473: insert sorted... #of rdb_links", childs.length);
	if (childs.length == 0)
	{
		newdiv.hide()
		parentdiv.append(newdiv);
		newdiv.slideDown();
		return;
	}
	//a lert("element #"+childs.length);
	// ELSE there are oldersiblings
	// SPECIAL CASE: new div has no time (get timestamp here too)
	var timeattr = newdiv.attr("data-timestamp");
	var last = parentdiv.children().last();
	
	//c/onsole.log("sR481: insert sorted", timeattr);
	var timestamp = parseInt(timeattr);
	
	if (! timestamp)
	{
		newdiv.hide();
		parentdiv.append(newdiv);
		newdiv.slideDown();
		//last.css("border-bottom", "none");
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
			newdiv.hide()
			newdiv.insertBefore(sibling);
			newdiv.css("border-bottom","none");
			newdiv.slideDown();
			return;
		}
	}
	
	// ELSE it is newest, append afterall
	// last is now second to last... note
	last.css("border-bottom", "none");
	
	newdiv.hide();
	parentdiv.append(newdiv);
	newdiv.slideDown();
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

var _sR_scan_html_for_comments = false;

var observer = new MutationObserver(function(mutations) {
	//alert("asdf");
  // THIS IS NO LONGER BEING CALLED ON YOUTUBE PAGES
  // AS OF 2013/11/7 (that is the page doesn't mutate)
  mutations.forEach(function(mutation) {
    if (true) //(mutation.type != "attributes")
    {
    	//console.log("sR159:",mutation,mutation.type);
  	}
  });
  
  var location= $("#comments-view"); //$("#watch-discussion");
  var wcont = $(".watch_content");
  var pagecontainer = $("#page-container");
  var summary = $(".summary_element");
  //c/onsole.log("sR509: summary length", summary.length, summary);
  if (summary.length < 1)
  {
		if (location)
		{
			location.before(rdb_summary_DIV);
		}
		if (wcont)
		{
			wcont.prepend(rdb_summary_DIV);
		}
		
		rdb_summary_div_ready = true;
		var showhide = $("#showhideSummaryButton");
		console.log("sR514: ",summary.length); 
		mkShowHideRight.call(showhide);
  /*  		mutations.forEach(function(mutation) {
			if (mutation.type != "attributes")
			{
				console.log("sR159:",mutation,mutation.type);
			}
		  });
  */
  }
  if (_sR_scan_html_for_comments)
  {
  		dconvert2links(); 
  }		
});

var opts =  {childList:true, attributes:false, subtree:true};
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

var _N9_SCANONSTART = false
_njn.register("idb_connected", function (event)
	{
		if (!_N9_SCANONSTART)
		{ return;}
		var vidid = rdbGetVideoIDFromURL();

		n9spider_idb_videoscan(vidid, 
			{complete: 
				function ()
				{
					console.log("sR443: scan success", this, rdb_spider);
					
					// this.n9video.yt_scan_comments();
				}
			}
		);
	}
);
function user_caused_dbCurseComments()
{
	var vidid = rdbGetVideoIDFromURL();

	console.log("sR505: user_caused_dbCurseComments", window.location.href, vidid);
	n9spider_idb_videoscan(vidid, 
		function ()
		{
			console.log("sR443: scan success", this);
			//rdb_spider.dbCurseComments({video_id:this.videoID});
		
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

function clue2id(clue, type)
{
	if (!type)
	{
		type = "unique";
	}
	
	switch(type)
	{
		case "unique":
			return url2id(clue.URL + clue.author, "unique");
	}
	return null;
	
}
	
function rdbProcessClue(cmd, clue)
{
 	console.log("sR445:rdbProcessClue", cmd, clue);
	var tehdiv = rdb_clue_div(clue);
	var pclueEL = $("#"+clue2id(clue)); //@@NAMECON
	
	if (pclueEL.length > 0) // if (cmd == "clue_update")
	{
		pclueEL.stop(true);
		pclueEL.slideUp(function () { this.remove();})
	
	}
	
	
	
		
	if (false) // @@DEBUG: COMOUT: (clueEL.length)
	{
		//clueEL.css("border-color", "red");
		//clueEL.css("background-color","lightYellow");
		//clueEL.hide();
		//c/onsole.log("sR695:", clue);
		//return;
		var rdboths = rdb_summary_div.find(".rdbOtherSummary");
		
		var tehdiv = rdb_clue_div(clue);
		//c onsole.log("sR483:", cmd, clue);
		rdbInsertClueSorted(rdboths, tehdiv);	
		var clueset = $("."+url2id(clue.videoID, "clue"));
		clueset.detach();
		var newclue = $(clueset[0]);
		var duplclue = $("<div>",
						{	css:{
									margin:"5px",
									marginLeft:"30px"
								}
						});
		var subset = clueset.slice(1);
		subset.css({"border": "none",
					"border-left":"solid black 1px"
					});
		subset.find(".clue_link, .clue_link_label").remove();
		duplclue.append(subset);
		newclue.append(duplclue);
		
		tehdiv = newclue;
	}
		
 	if (false) //@@DEBUG @@COMMOUT:(clue.protocol == "youtube2013")
	{
		
		var rdboths = $(".rdbOtherSummary");
		var rdbyts = $(".rdbYtSummary");
		var n9vid = rdb_spider.videos_by_id[clue.videoID];
		console.log("sR448:", clue.videoID, n9vid);
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
		var source = clue.source ? clue.source : "default";
		if (source == "default")
		{
			
		}
		else if (source == "content_scan")
		{
			tehdiv.css("background-color","#e0f0e0");
		}
		else if (source.indexOf("idb.") >= 0)
		{
			tehdiv.css("background-color","#e0e0ff");
		}
		
		var rdboths = rdb_summary_div.find(".rdbOtherSummary");
		console.log("sR1120:", source);
		//c onsole.log("sR483:", cmd, clue);
		rdbInsertClueSorted(rdboths, tehdiv);	
		//rdboths.append(tehdiv);
	}
 }
	
function rdbProcessClueOLD(cmd, clue)
{
 	console.log("sR445:rdbProcessClue", cmd, clue);
	//if (false)
	if (false) // if (cmd == "clue_update")
	{
		var previousdiv = $("."+url2id(clue.URL, "cluediv")); //@@NAMECON local convention in sR
		//console.log("sr1050: removing old clue div", previousdiv);
		for (var n = 0; n<previousdiv.length; n++)
		{
			var pdiv = $(previousdiv[n]);
			var pdivdata = pdiv.data("clue");
			console.log("sR1055: pdiv data", pdivdata);
			
			if (pdivdata === clue)
			{
				console.log("pdivdata === clue");
				//div.remove();
			}
			if (pdivdata.content == clue.content)
			{
				console.log("content === content");
				pdiv.stop(true);
				pdiv.slideUp(function () { this.remove();})
			}
		}
	}
	
	var tehdiv = rdb_clue_div(clue);
	var clueEL = $("#"+clue2id(clue)); //@@NAMECON
		
	if (false) // @@DEBUG: COMOUT: (clueEL.length)
	{
		//clueEL.css("border-color", "red");
		//clueEL.css("background-color","lightYellow");
		//clueEL.hide();
		//c/onsole.log("sR695:", clue);
		//return;
		var rdboths = rdb_summary_div.find(".rdbOtherSummary");
		
		var tehdiv = rdb_clue_div(clue);
		//c onsole.log("sR483:", cmd, clue);
		rdbInsertClueSorted(rdboths, tehdiv);	
		var clueset = $("."+url2id(clue.videoID, "clue"));
		clueset.detach();
		var newclue = $(clueset[0]);
		var duplclue = $("<div>",
						{	css:{
									margin:"5px",
									marginLeft:"30px"
								}
						});
		var subset = clueset.slice(1);
		subset.css({"border": "none",
					"border-left":"solid black 1px"
					});
		subset.find(".clue_link, .clue_link_label").remove();
		duplclue.append(subset);
		newclue.append(duplclue);
		
		tehdiv = newclue;
	}
		
 	if (false) //@@DEBUG @@COMMOUT:(clue.protocol == "youtube2013")
	{
		
		var rdboths = $(".rdbOtherSummary");
		var rdbyts = $(".rdbYtSummary");
		var n9vid = rdb_spider.videos_by_id[clue.videoID];
		console.log("sR448:", clue.videoID, n9vid);
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
		var source = clue.source ? clue.source : "default";
		if (source == "default")
		{
			
		}
		else if (source == "content_scan")
		{
			tehdiv.css("background-color","#e0f0e0");
		}
		else if (source.indexOf("idb.") >= 0)
		{
			tehdiv.css("background-color","#e0e0ff");
		}
		
		var rdboths = rdb_summary_div.find(".rdbOtherSummary");
		console.log("sR1120:", source);
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

_njn.register("spider_event",
		function(event)
		{
			//console.log("sR1035: spider event",event)
			var spidact = $(".spider_acts");
			var etype = event.event
			switch (etype)
			{
				case "comment_scan":
					var author = event.comment.get("author");
					var comment = event.comment;
					var content = comment.get("content");
					var msg = "comment by "+event.comment.get("author");
					
					//DEBUG STATEMENT
					if (author == "pyrrho314" && (content.indexOf("cute") >=0))
					{
						console.log("sR1049:",comment.get("content"),comment);
						console.trace();
					}
					
					showSpiderMsg(msg)
					break;
				case "found_clue":
					var clue = event.clue;
					showSpiderMsg("found clue "+ clue.author, {color:"blue"});
					break;
				default:
					showSpiderMsg(event.event)
			}
			
			showSpiderState(event);
		}
		);
		
function showSpiderState(event)
{
	var spact = $(".spider_acts");
	var spate = $(".spider_state");
	var etype = event.event;
	var css0 = {"color":"green",
				"background-color":"#e0ffe0"};
	var css1 = {"color":"black",
				"background-color":"white"};
	
	try
	{
		var msg = ""
		switch(etype)
		{
			case "comment_scan":
				msg = "scanning "+event.comment.get("video_id");
				return;
				break;
			case "found_clue":
				//msg = "found " + event.clue.videoID;
				//css0.color = "darkYellow";
				// not a status
				return;
				break;
			case "idb_start_videoscan":
				msg = "loading IDB for "+ event.video_id;
				break;
			case "idb_finish_videoscan":
				msg = spideridleterm;
				break;
	
			default:
				msg = event.event
		}
		var newmsg = spidername + " " + msg;
		var oldmsg = spate.text();
		if (newmsg != oldmsg)
		{
			spate.text(newmsg);
			spate.stop(true);
			spate.css(css0);
			spate.animate (css1,
						{duration:1550,
						complete: function ()
						 {
						 	//$(this).css(css1);
						 }
						});
			console.log("sR1241:", newmsg);
		}
		
		if (msg == spideridleterm)
		{
			_njn.send({cmd: "spider_idle"}, 
				{
					callback: function (msg)
					{
						console.log("sR1264:", msg);
					}
				});
			
		}
		else
		{
			var r = Math.random()*256;
			var g = Math.random()*256;
			var b = Math.random()*256;
			_njn.send({cmd:"spider_active"},
				{	callback: function (msg)
					{	if (MASSIVE_DEBUG)
							{
								console.log("sR1278: send acked", msg)
							}
					}
				});
			
		}
		
	} catch (err)
	{
		console.log(event);
		throw err;
	}	
}
function showSpiderMsg(msg, css)
{
	var spact = $(".spider_acts");
	var spate = $(".spider_state");
	var msg = $("<div>",
				{	text: msg
				}
				).hide();
	if (css)
	{
		msg.css(css);
	}
	if (spate.length>0) msg.insertAfter(spate);
		else spact.prepend(msg);
		
	msg.slideDown(350, function ()
						{ $(this).slideUp(850, 
							function ()
							{ 
								$(this).remove();
							});
						});
}


// THIS FUNCTION IS AT BOTTOM SO IT CAN DEPEND ON ANY OF THE ABOVE
function InsertSummaryIntoDocument()
{	// note the summary div is initialized and dynamically modified...
	// so the job here is to find a place to put it and put it once.
  var it_IDcommentsview = $("#comments-view"); //$("#watch-discussion");
  var it_IDpage 		= $("#page"); 
  var it_IDwatchcontent = $("#watch7_content");
  var it_IDpagecontainer = $("#page-container");
  
  var it_prio = [
  					it_IDpage,
  					it_IDcommentsview,
  					it_IDwatchcontent,
  					it_IDpagecontainer
  				];
  var summary = $(".summary_element");
  var insert_target = null;
  
  for (var n=0; n<it_prio.length; n++)
  {
  	if (it_prio[n].length)
  	{
  		console.log("first able target, #"+n);
  		insert_target = it_prio[n];
  		break;
  	}
  }
  
  if (summary.length < 1 && insert_target)
  	{
		console.log("sR1332:", rdb_summary_DIV);
		insert_target.prepend(rdb_summary_DIV);
		rdb_summary_div_ready = true;
		var showhide = $("#showhideSummaryButton");
		console.log("sR514: ",summary.length); 
		mkShowHideRight.call(showhide);
	}
}

// on body ready: insert the summary div soemwhere
$("body").ready( function ()
{
	InsertSummaryIntoDocument();
}	);