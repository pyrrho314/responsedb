var discussion_insertPoint = "#watch-discussion";
console.log("Loaded insertlinks.js...");
var app = {

ytvideoid: '',
getMore: true,
startIndex: 1,
maxResults: 50,
commentLimit: 1000,
highlight: false,
videoIdCounter: 0,


insertLinksInit: function() {



	app.getMore = true;
	app.ytvideoid = '';
	app.startIndex = 1;

//var container = $("#watch-related");
var container = $(discussion_insertPoint);
$(container).before("<div id='rdb_comments'></div>"); 
$(container).before("<div id='rdb_comments_spacer'>&nbsp;</div>"); 
var ytclcontainer = $("#rdb_comments");
$(ytclcontainer).before("<div id='rdb_header_container'></div>"); 


var loaderImageUrl = chrome.extension.getURL("ajax-loader.gif");
var iconImageUrl = chrome.extension.getURL("icon48.png");

var arrowDownImageUrl = chrome.extension.getURL("arrowDown.png");
var arrowUpImageUrl = chrome.extension.getURL("arrowUp.png");

var icon = $("<div class='rdb_header'><div class='rdb_header_left'><img src='"+iconImageUrl+"' class='rdb_icon'/></div><div class='rdb_header_right'><h3>ResponderDB Summary</h3></div><div class='rdb_arrow_container'><img id='rdb_arrow' src='"+arrowUpImageUrl+"'/></div><div class='rdb_clear'>&nbsp;</div>");


var loader = $("<img src='"+loaderImageUrl+"' class='rdb_loader'/>");
$('#rdb_header_container').append(icon);
$('#rdb_comments').append(loader);

$( "#rdb_arrow" ).click(function() {
  $( "#rdb_comments" ).toggle();
  $( "#rdb_comments_spacer" ).toggle();
  
  if($("#rdb_arrow").attr("src") == chrome.extension.getURL("arrowDown.png")){
  $("#rdb_arrow").attr("src", chrome.extension.getURL("arrowUp.png")); 
  }
  else{
  $("#rdb_arrow").attr("src", chrome.extension.getURL("arrowDown.png")); 
  }
  
  
var responder_container = $(responder_insertPoint);

responder_container.before(responderEL);

});




	app.ytvideoid = app.getParameterByName('v');
	// app.getAllComments();

},


getAllComments: function() {

if(app.getMore){
app.getPartialCommentsData(app.ytvideoid);
	
}

else{

if($('.rdb_comment').length < 1){
 $('#rdb_comments').append("<span class='rdb_notice'>No comments with YouTube links found.<br><br><span>");
  $(".rdb_loader").css("display", "none");
}
 $(".rdb_loader").css("display", "none");
 $('#rdb_comments').append("<span class='rdb_notice'>Search Complete.<span>");
}

},



getPartialCommentsData: function (id){


		var comments_data = null;
		var uniqueNum = new Date().getTime();
		
		var comments_url = 'http://gdata.youtube.com/feeds/api/videos/'+id+'/comments?v=2&alt=json&max-results='+app.maxResults+'&start-index='+app.startIndex+'&cachebust='+uniqueNum;
		
		
		$.getJSON( comments_url, function( data ) {
		
		if(data.feed.entry === undefined){
		app.getMore = false;
		app.getAllComments();
		return;
		}
		else{
		app.startIndex += app.maxResults;
		}
		
		if(app.startIndex > app.commentLimit){
		
		app.getMore = false;
		
		}
		
		$.each(data.feed.entry, function(key, val) {
		
			if(val.content.$t.indexOf("watch?v=") != -1){

			var linksContainer = app.makeLinksFromId(val.content.$t, val.author[0].name.$t);
			
			var linkContainerClearer = $("<div class='rdb_link_container_clearer'>&nbsp;</div>");
			linksContainer.append(linkContainerClearer);
			
			
			
			comment = $("<div class='rdb_comment'></div>");
            
            author = $("<a target='_blank' class='rdb_youtube_user'></a>");
            
			var authorChannelGData = val.author[0].uri.$t;
			var lastSlashPos = authorChannelGData.lastIndexOf("/");
			var authorName =  authorChannelGData.substr(lastSlashPos+1,authorChannelGData.length)
			
			author.attr("href", "http://youtube.com/user/" +authorName);
            author.html(val.author[0].name.$t);
            
            content = $("<div class='rdb_content'></div>");
            content.html(val.content.$t);
            
            comment.append(author);
			comment.append(content);
			comment.append(linksContainer);
			
            $('#rdb_comments').prepend(comment);			
			
			}
			
           
        });
		
		//DO IT AGAIN
		app.getAllComments();
		
		});
		
		
		


},


makeLinksFromId: function (comment, commentauthor){


var str = comment;

var linksContainer = $("<div class='rdb_links_container'></div>");
var regex = /v=/gi, result, indices = [];

while ( (result = regex.exec(str)) ) {

    indices.push(result.index);
	
}

console.log("indices.length: "+indices.length);

var onceOnly = false;

if(indices.length == 1){
onceOnly = true;

}
	
for(var i=0; i < indices.length; i++){

videoId = str.substring((indices[i]+2), (indices[i])+13);


		var link = $("<a target='_blank'>This video does not appear to exist</a>");
		var linkContainer = $("<div class='rdb_link_container'></div>");
		
       var linkhref = "http://www.youtube.com/watch?v="+videoId;
		link.attr("href", linkhref);
		link.attr("class", "rdb_watchlink");
		
		var uniqueLinkId = "vId_"+videoId+"_"+app.videoIdCounter;
		app.videoIdCounter++;
		link.attr("data-vid", uniqueLinkId);
	  
	 app.getVideoTitle(videoId, commentauthor, onceOnly, uniqueLinkId);
		
	   linkContainer.append(link);
	   linksContainer.append(linkContainer);
	   
	   if(indices.length == 1){
	   var thumbcontainer = "<div data-thumb='"+uniqueLinkId+"' class='rdb_links__thumb_container'><a href='"+linkhref+"' class='rdb_links__thumb_container_link'></s></div>";
	    linksContainer.prepend(thumbcontainer);
		
	   }
	   
	   if(i < indices.length-1){
	   linksContainer.append("<br>");
	   }
		
		

}	

return linksContainer;

},




getVideoTitle: function (id, commentauthor, onceOnly, uniqueLinkId){		
		
		var uniqueNum = new Date().getTime();
		var video_url =  'http://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=json'+'&cachebust='+uniqueNum;
		
		
		var getVideoInfo = $.getJSON( video_url, function( data ) {
			
			var video_title = "";		
			var video_owner = "";
			
			video_title = data.entry.title.$t;
			video_owner = data.entry.author[0].name.$t;
			video_thumbnail = data.entry.media$group.media$thumbnail[0].url;
			
			
			var responselink = $("a[data-vid='" + uniqueLinkId + "']");
			responselink.html(video_owner+": "+video_title);
			
			
			
			var commentVideoAuthorMatch = false;
			if(commentauthor == video_owner && onceOnly){
			commentVideoAuthorMatch = true;
			}
			else{
			commentVideoAuthorMatch = false;
			}
			
		
			
			if((app.highlight && commentVideoAuthorMatch) && onceOnly == true){
			
			
			var tclink = responselink.parent().parent().parent();
			tclink.addClass("rdb_highlighted");
			var thumb_html = "<img class=rdb_highlight_thumb src='"+video_thumbnail+"' />";
			$('div[data-thumb="' + uniqueLinkId + '"] a').html(thumb_html);
			}
			
			else{
			responselink.parent().parent().parent().removeClass("rdb_highlighted");
			
			}
			
		});		
		
		
		
},







getParameterByName : function( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}




}//END APP 


chrome.runtime.sendMessage({greeting: "sendenabledsetting"}, function(response) {  
  
  if(response.farewell == "enabled"){
   $(document).ready(function() {
		app.insertLinksInit();
		//setTimeout(polling, 2000)
		});
  }
  
  
});


chrome.runtime.sendMessage({greeting: "sendhighlightsetting"}, function(response) {  
  
  if(response.farewell == "true"){
   app.highlight = true;
  }
  
  
});
 
	
		
function polling(){
	console.trace();
	return
	console.log("il323:polling");
   if( $("#rdb_comments").length == 0 ){
	app.insertLinksInit();
   }	
   else
   {
   
   }
   
   setTimeout(polling, 2000);
}

 