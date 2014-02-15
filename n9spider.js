// DEBUG FLAGS
// Clue Tracker
TRACKER_PHRASE = "update here"; // false

function n9spider_yt_userscan(username, map, create_domicile)
{
    var enclosed_username = username;
    var enclosed_map = map;
    var enclosed_create_domicile = create_domicile;
    _yt_spiderlib.map = map;
    
    
    var spider = _yt_spiderlib.map;
    
    console.log("spid3: username="+username+" create_domicile="+create_domicile);
    if (dbg_stopscan)
    { // should change this to non-dbg as am using it for global state
        return;
    }
    
    spider.broadcastEvent(
    			{   event:  "scan_user",
                    domain: "yt",
                    username : username
                });
     _njn.executeCallback("map_message", 
                                {"message":""
                                }
                            );
    $.ajax({type:"get",
            dataType:"json",
            url:"http://gdata.youtube.com/feeds/api/users/"
                +username+
                "/uploads?alt=json&max-results=10",
            success: function (data) {
                console.log("userscan return");
                console.log(data);
                var spider = _yt_spiderlib;
                n9spider_yt_feedparse_responses(enclosed_username,
                                                data.feed,
                                                enclosed_map,
                                                Date.now().valueOf(),
                                                enclosed_create_domicile);
                spider.broadcastEvent(
                    {   event:  "end_scan_user",
                        domain: "yt",
                        username : enclosed_username
                    });
                
                },
            error: function(jqXHR, error, errorThrown) {
                    var spider = _yt_spiderlib;
                
                    if (jqXHR.status&&jqXHR.status==403)
                    {   
                        console.log("spid44:", jqXHR,error, errorThrown);
                        
                        if (jqXHR.responseText.indexOf("too_many") >= 0)
                        {
                            // I guess this flag is not just debug and should be
                            // renamed.
                            dbg_stopscan = true;
                        
                            _njn.executeCallback("map_message", 
                                    {"message":"Youtube throttling us down, wait a bit, too many requests."}
                                    );
                        	spider.broadcastEvent(
                            {   event:  "end_scan_user",
                                domain: "yt",
                                username : enclosed_username
                            });
                        }
                        else
                        {
                             _njn.executeCallback("map_message", 
                                    {"message":"Forbidden to scan "+enclosed_username}
                                    );
                        }
                    }
                }
            });
}


function n9spider_idb_videoscan(videoID, options)
{
	console.log("spid87: options", options);
	// signature above is original one...
	// but it can be totally options based, mcay?
	var lspider = rdb_spider;
	
	if (typeof(videoID) == "object")
	{
		options = videoID;
		videoID = options.videoID;
			
	}
	else
	{
		options.videoID = videoID;
	}
	
	
	if ("complete" in options)
	{
		options.idb_complete = options.complete;
		delete options.complete;
	}
	
	console.log("spid110: idb_videoscan options to idb_videoscan",options);
	
	//c/onsole.trace();
	// @@DOCO: NOTE, I use call and apply to turn option into this a lot!!!!! warning
	// I need a consistent paradigm but in general it's to give callback access to the
	// options relating to them. And it's fun.  Self modifying code song time!
	var spider = _yt_spiderlib;
                
	lspider.broadcastEvent(
				{	event:"idb_start_videoscan",
					video_id: videoID,
					options: options
				});
	function when_gv_complete()	
	{	//@@DEV @@TODO: I don't like how I used $extend on the options
		var video = this.n9video;
		var videoID = this.videoID;
		var complete_func = this.idb_complete;
		this.comments_done = complete_func;
		console.log("spid107:", this);
		return;
		//alert("pased");
		if (video && this.get_comments)
		{
			console.log("spid77:idb_videoscan retrieved:", video.get("video_id"));
			if (video)
			{
				var videoID = video.get("video_id");
				console.log("spid84: "+video.get("video_id")+" found in local IDB");
				rdb_spider.rdbCurseComments
				(
					 {
						video_id: videoID,
					 },
					 $.extend
						(
							options, 
							{
								foreach: function (comment)
								{
									var content = comment.get("content");
								
									rdb_spider.checkCommentForClues(comment);
									var author = comment.get("author");
									var author_pretty = comment.get("author_pretty");
									/*
									console.log("spid133: author", author_pretty, author);
									if (author == "nitelite78" || author_pretty == "nitelite78")
									{
										console.log("spid136:", comment.get("content"), comment);
									}
									*/
								},
								complete: function ()
								{
									var spider = _yt_spiderlib;
									console.log("spid135: complete dbGetVideo");
									lspider.broadcastEvent(
										{ event: "idb_finish_videoscan"
										});
									if (this.comments_done)
									{
										this.comments_done.call(this); // @@this decision
										console.log("spid162:", this.comments_done);
										alert("pause");
									}
								}
							}
						)
					
				);	
			}
			// conditional above should not return without calling complete function
		}
		else
		{	// if we are not getting comments, we're done, call the complete
			// otherwise it's called from the rdbCurseComments callback
			this.complete.call(this);
		}
	}	
	
	if (options && options.gv_complete)
	{
		options.idb_gv_complete = options.gv_complete;
	}
	
	options.gv_complete = when_gv_complete;	
	console.log("spid184: idb_videoscan options in idb_videoscan", options);
	lspider.rdbGetVideo(
		{
			video_id: videoID, 
		},
		options);
}

    	
function n9spider_yt_videoscan(video_id, complete_func, options)
{
	// @@NOTE: this function has weird option names ... videoID and n9complete
	// @@NOTE: this function is going to be checking idb for stuff it already has
	// @@    : since youtube isn't updating those types of records, it's just new ones.
	// @@    : HOWEVER: it does go ahead and contact youtube about the video in question
	// @@    : because any caller has likely already checked that. ? right ?
	
    //var enc_func = complete_func;
    if (typeof(video_id) == "object")
    {
    	// then options are really first arg
    	options = video_id;
    }
    else
    {
    	if (!options) options = {};
    	options.videoID = video_id;
    	options.n9complete = complete_func;
    }
    
    $.ajax({type: "get",
            dataType: "json",
            url: "http://gdata.youtube.com/feeds/api/videos/"+options.videoID+"?alt=json",
            context: options,
            success: function (data)
                {
                	var entry;
                	if (data.entry)
                	{
                		entry = data.entry;
                	}
                	else
                	{
                		entry = data.feed.entry;
                    }
                    
                    console.log("spid66: videoscan returns", data);
                    var username = entry.author[0].name.$t;
                    var map = _njn.inline("get_map")[0];
                    var now = new Date().getTime();
                    var feed = {entry:[entry]};
                    
                    var get_comments;
                    if ("get_comments" in this) 
                    	{ get_comments = this.get_comments}
                    else 
                    	{get_comments = false; } // this is the @@DEFAULT
                    
                    var vid = n9spider_yt_video_from_entry(entry, options);
                    
                    
                    /*
                    if (false)
                    { //@@WARNING probably bad for map integration as is
                    	n9spider_yt_videofeed_parse(feed, 
                    						{username:username,
                    						 feed: feed,
                                             map:  map,
                                             event_time: now,
                                        	 create_domicile: false,
                                        	 get_comments: get_comments
                                        	});
                    }
                    */
                    
                    console.log("spid126:", get_comments, this);
                    if (get_comments)
                    {
                    	console.log("spid245: video yt getting comments", vid);
                    	console.log("spid246: this", this);
                    	var commentfeedurl = vid.get("comments_feed")+"?alt=json";
                    	n9spider_yt_recurseComments(
                    		{	username: username,
                    			comments_url: commentfeedurl,
                    			max: 250,
                    			foreach: this.foreach
                    		});
                    	/*
                    		$.ajax({type:"get",
								dataType:"json",
								url: commentfeedurl,
								success: function (data) {
									//c/onsole.log("spid93: comments reply");
									//c/onsole.log(data);
									n9spider_yt_feedparse_comments( 
										{ 	username:	username, 
											feed:		data.feed,
											map: 		null,
											create_domicile: false,
											foreach: this.foreach,
										});
									var nexturl = n9spider_yt_getlink(data.feed.link, "next");
					
						
									console.log("spid68: next comment url --> "+nexturl);
								}
							   }
							  );
						*/
                    } 
                    if (this.n9complete)
                    {
                    	this.n9video = vid;
                        this.n9complete.call(this);
                    }
                }
            });
}
function n9spider_yt_feedparse_responses(username, feed, map, event_time, create_domicile)
{
	return n9spider_yt_videofeed_parse(feed, {feed: feed,
												username:username,
												map:map,
												event_time: event_time,
												create_domicile:create_domicile,
											  }
										);
}

function n9spider_yt_video_from_entry(entry, options)
{
	
	var username = entry.author[0].name.$t;
    var links = entry.link;
	var responsesurl = null;
	var videourl = null;
	var event_time =null;
	if (! ("event_time" in options))
	{
		event_time =  Date.now().valueOf(); 
	}
	for (var n = 0; n < links.length; n++)
	{
		var link = links[n];
		if (link.rel.indexOf("alternate")>=0)
			{   videourl = link.href; }
	}
	console.log("spid32:");
	console.log(responsesurl);
	console.log(videourl);
	
	
	var video_dict = {  "author":username,
						"media":entry.media$group,
						"entry":entry,
						"user_locale":"youtube",
						"last_scan":event_time,
						"video_url":videourl
					};

	var vid = _yt_spiderlib.addVideo(video_dict);
	video_dict.n9_video = vid;
	_njn.executeCallback("video_entry", video_dict);
	
	var commentlink = entry["gd$comments"]["gd$feedLink"];
	
	var commentsurl = commentlink.href + "?alt=json";
	var enclosed_username = username;
	//var enclosed_create_domicile = create_domicile;
	_njn.execute("spider_event",
					{   event:  "video_scan",
						domain: "yt",
						username : enclosed_username,
						video : vid
					});
	return vid;
	
}

function n9spider_yt_videofeed_parse(feed, options)
{
	var username = options.username;
	var feed 			= options.feed;
	var map  			= options.map;
	var event_time 		= options.event_time;
	var create_domicile = options.create_domicile;
	var get_comments 	= true;
	if ("get_comments" in options)
	{
		get_comments = options.get_comments;
	}
	
    if (! event_time)
    {
        event_time = Date.now().valueOf();
    }
    console.log("spid18:");
    console.log(feed);
 
 	var videoid = n9spider_yt_get_videoid_from_videoentry(feed.entry[0]);
 	
    var entries = feed.entry;
    if (! entries) { return;}
    for (var i = 0; i < entries.length; i++)
    {
        var entry = feed.entry[i];
        var links = feed.entry[i].link;
        var responsesurl = null;
        var videourl = null;
        for (var n = 0; n < links.length; n++)
        {
            var link = links[n];
            if (link.rel.indexOf("video.responses")>=0)
            {
                responsesurl = link.href+"?alt=json&max-results=50";
            }
            if (link.rel.indexOf("alternate")>=0)
            {   videourl = link.href; }
        }
        //c/onsole.log("spid32:");
        //c/onsole.log(responsesurl);
        //c/onsole.log(videourl);
        var video_dict = {  "author":username,
                            "media":entry.media$group,
                            "entry":entry,
                            "user_locale":"youtube",
                            "last_scan":event_time,
                            "video_url":videourl
                        };

        var vid = _yt_spiderlib.addVideo(video_dict);
        video_dict.n9_video = vid;
        _njn.executeCallback("video_entry", video_dict);
        
        var commentlink = feed.entry[i]["gd$comments"]["gd$feedLink"];
        
        var commentsurl = commentlink.href + "?alt=json";
        var enclosed_username = username;
        var enclosed_create_domicile = create_domicile;
        _njn.execute("spider_event",
                        {   event:  "video_scan",
                            domain: "yt",
                            username : enclosed_username,
                            video : vid
                        });
        var numcom = 0;
        if (videoid in _yt_spiderlib.comments_by_video_id)
        	{
        		numcom = _yt_spiderlib.comments_by_video_id[videoid].length;
        	}
		console.log("spid319: number comments already ", numcom);
                    
        function recurseComments(username, commentsurl, max) {
            // @@ NOTE: DOES NOT RECURSE YET!  use setTimeout
            var enclosed_username = username;
            $.ajax({type:"get",
                dataType:"json",
                url: commentsurl,
                success: function (data) {
                    //c/onsole.log("spid93: comments reply");
                    //c/onsole.log(data);
                    n9spider_yt_feedparse_comments( enclosed_username, 
                                                    data.feed,
                                                    map,
                                                    enclosed_create_domicile);
                    var nexturl = n9spider_yt_getlink(data.feed.link, "next");
                	
                        
                    console.log("spid315: next comment url --> "+nexturl);
                    console.log("spid316: ", _yt_spiderlib.comments_by_video_id);
                    console.log("spid317: ", data.feed.entry[0]);
                    var videoid = n9spider_yt_get_videoid_from_commententry(data.feed.entry[0]);
                    var numcom = _yt_spiderlib.comments_by_video_id[videoid].length;
                    console.log("spid319: number comments already ", numcom, "vs", max);
                    
                    if (numcom < max && nexturl) 
                    	setTimeout(recurseComments, 1500, username, nexturl, 250);
                }
               }
              );
        }
        recurseComments(username, commentsurl, 250);
    }
}

function n9spider_yt_recurseComments(options)
{
	var username = options.username;
	var commentsurl = options.comments_url;
	var max = options.max ? options.max: 20;

	// @@ NOTE: DOES NOT RECURSE YET!  use setTimeout
	var enclosed_username = username;
	$.ajax({type:"get",
		dataType:"json",
		url: commentsurl,
		context:options,
		success: function (data) {
			//c/onsole.log("spid93: comments reply");
			//c/onsole.log(data);
			var options = $.extend(
				{	username:this.username, 
					feed: data.feed,
					map: null,
					create_domicile: false
				}, this);
				
			n9spider_yt_feedparse_comments(options);
			var nexturl = n9spider_yt_getlink(data.feed.link, "next");
			
				
			console.log("spid315: next comment url --> "+nexturl);
			console.log("spid316: ", _yt_spiderlib.comments_by_video_id);
			console.log("spid317: ", data.feed.entry[0]);
			var videoid = n9spider_yt_get_videoid_from_commententry(data.feed.entry[0]);
			var numcom = _yt_spiderlib.comments_by_video_id[videoid].length;
			console.log("spid319: number comments already ", numcom, "vs", max);
			
			if (numcom < max && nexturl) 
				setTimeout(n9spider_yt_recurseComments, 1500,{username: username,
															  comments_url: nexturl,
														    max: 250
														     });
		}
	   }
	  );
}
        
function n9spider_yt_getlink(links, id, strip_prot)
{
    for (var n = 0; n<links.length; n++)
    {
        //c/onsole.log("spid74:rel="+links[n].rel);
        if (links[n].rel.indexOf(id) >=0)
        {
            var href = links[n].href;
            
            return href;
        }
    }
    return null;
}
function n9spider_yt_get_videoid_from_commententry(entry)
{
	var vidid = entry.yt$videoid.$t;
	return vidid
}
function n9spider_yt_get_videoid_from_videoentry(entry)
{
	var vididurlparts = entry.id.$t.split("/");
	var vidid = vididurlparts[vididurlparts.length-1];
	return vidid;
	
}
function n9spider_yt_getcategory(entry)
{
    if (entry.category)
    {
        var cats = entry.category;
        for (var n = 0; n < cats.length; n++)
        {
            var cat = cats[n];
            if (cat.scheme.indexOf("categories.cat")>0)
            {
                return {
                        label: cat.label,
                        term: cat.term
                       };
            }
        }
    }
    return null;
}
function n9_strip_protocol(href)
{
    if (!href)
    {   return null;
    }
    var parts = href.split(":");
    if (parts.length == 1)
    {
        return parts[0];
    }
    return parts[1];
}

function n9spider_comment2map(comment, map, create_domicile)
{
    //c/onsole.log(comment);
    //c/onsole.log(map);
    if (!map)
    {
        map = _njn.inline("get_map")[0];
    }
    var author = comment.get("author");
    var video_author = comment.get("video_author");
    var vidid = comment.get("video_id");
    var to = map.getMainItem(video_author);
    var from = map.getMainItem(author);
    
    if (!from && create_domicile)
    {
        //c/onsole.log("spid157: temporary create-domicile-from-comment  code");
        var r = -1
        var ang = 0;
        var x = y = -1;
        //if (true) 
        while (    x < 0 
                || y < 0 
                || x > map.scene.width 
                || y > map.scene.height)
        {
            r = (Math.random()*to.props.size * 10) + 10;
            ang = Math.random()*2*Math.PI;
        
            x = r*Math.cos(ang);
            y = r*Math.sin(ang);
            console.log("spid186:"+x+","+y);
        }
        var pretty_auth = author[0].toUpperCase()+ author.slice(1);
        map.newDomicile({   item_name: "House "+author,
                            x: to.x + x,
                            y: to.y + y,
                            size: 5,
                            resident: author_from_uri
                        });
        from = map.getMainItem(author);
        map.serverStoreItem(from);
    }
    //c/onsole.log("to");
    //c/onsole.log(to);
    //c/onsole.log("from");
    //c/onsole.log(from);
    if (to && from)
    {
        map.newRelationship({ from:from, to:to, video_id:vidid}); 
        //residentdict[author] = true;
        _njn.executeCallback("video_entry_comment", 
                {   username: video_author,
                    commenter:author,
                    selector: ".info-"+vidid
                })
    }
}

function n9spider_yt_feedparse_comments(username, feed, map, create_domicile)
{
	var options = {};
	
	if (typeof(username) == "object")
	{
		options = username;
		username = options.username;
		feed = options.feed;
		map = options.map;
		map = options.create_domicile;
	}
	
	var each_comment_func = options.foreach;
	
    var commentobjs = feed.entry;
    var residentdict = {}; // to not draw more than one relat per vid
    //c/onsole.log("spid93:comment feed");
    if (! commentobjs)
    {
        console.log("no entry ->"+username);
        console.log(feed)
        return;
    }
    //c/onsole.log(feed);
    for (var n=0; n< commentobjs.length; n++)
    {
        var commentobj = commentobjs[n];
        var author = commentobj.author[0].name.$t;
        /*
        console.log("spid473:&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log("spid473:&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log("spid473:&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log("spid476:", author);
        console.log("spid477:&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log("spid477:&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log("spid477:&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        */ 
        var author_from_uri = commentobj.author[0].uri.$t.split("/");
        var vidid = feed.id.$t.split("/");
        vidid = vidid[vidid.length-2];
        author_from_uri = author_from_uri[author_from_uri.length-1];
        var comment = _yt_spiderlib.addComment({  video_author: username,
                                    entry: commentobj,
                                    video_id: vidid
                                });
                                
    	if (options && options.foreach)
    	{
    		options.foreach.call(options, comment);
    	}

        _njn.execute("spider_comment", {comment:comment});
        _njn.execute("spider_event", {  event:"comment_scan",
                                        comment:comment
                                     });
    	
    	
        //c/onsole.log("spid118: "+ author_from_uri+" " +author);
        //c/onsole.log(map.items_by_resident);
        
        
        //c/onsole.log("spid58: author = "+author);
        if (map)
        {
        	var author_has_item =   author          in map.items_by_resident 
								||  author_from_uri in map.items_by_resident;
			if ( create_domicile == true || author_has_item  )
			{
				//@@REFACTOR: author is the pretty name, just use author from uri in 
				// the first place.  @@GOAL: use the optimal unique identifier that works
				// in URLs... but also probably to support aliases if needed...
				//c/onsole.log("spid92: makeRelationship (Comment) with " + username);
				var to = map.getMainItem(username);
				var from = map.getMainItem(author);
			
				if (!from)
				{
					// youtube is doing wierd things with names
					// if possible I like to use whatever
					// is appropriate on the /user/xyzxyz URIs
					from = map.getMainItem(author_from_uri);
					author = author_from_uri
				}
				if (!from && create_domicile)
				{
					//c/onsole.log("spid157: temporary create-domicile-from-comment  code");
					var map = _njn.executeInline("get_map")[0];
					var r = -1
					var ang = 0;
					var x = y = -1;
					//if (true) 
					while (    x < 0 
							|| y < 0 
							|| x > map.scene.width 
							|| y > map.scene.height)
					{
						r = (Math.random()*to.props.size * 10) + 10;
						ang = Math.random()*2*Math.PI;
				
						x = r*Math.cos(ang);
						y = r*Math.sin(ang);
						console.log("spid186:"+x+","+y);
					}
					var pretty_auth = author[0].toUpperCase()+ author.slice(1);
					map.newDomicile({   item_name: "House "+author,
										x: to.x + x,
										y: to.y + y,
										size: 5,
										resident: author_from_uri
									});
					from = map.getMainItem(author_from_uri);
					map.serverStoreItem(from);
				}
				if (to && from)
				{
					map.newRelationship({ from:from, to:to, video_id:vidid}); 
					residentdict[author] = true;
					_njn.executeCallback("video_entry_comment", 
							{   username: username,
								commenter:author,
								selector: ".info-"+vidid
							});
				}
			}
        }
    }
}

var dbg_stopscan = false;
function n9spider_yt_slowscan_namelist(namelist, map, delay, create_domicile)
    {
        if (!delay) { delay = 6000}
        console.log("slowscan spider");
        _njn.execute("spider_event",
            {   event: "slowscan",
                domain: "yt",
                delay: delay,
                username : namelist[0],
                userlist : namelist        
            });
        
        n9spider_yt_userscan(namelist[0], map, create_domicile);
        namelist = namelist.slice(1);
        if (dbg_stopscan == true){console.log("debug stop scan");return;}
        if (namelist.length>0)
        {
            setTimeout(function () {
                n9spider_yt_slowscan_namelist(  namelist, 
                                                map, 
                                                delay, 
                                                create_domicile);
            },delay);
        }
        else
        {
            _njn.execute("spider_event",
                {   event: "end_slowscan",
                    domain: "yt"
                });
        }
    }
    
function n9spider_yt_scanall(map)
{
    if (!map)
    {
        map = _njn.executeInline("get_map")[0];
    }
    if (false)
    {
        var domiciles = map.items_by_type["Domicile"];
        var namelist = [];
        dbg_stopscan = false;
        for (var n=0; n< domiciles.length; n++)
        {
            var domicile = domiciles[n];
            console.log(domicile.props);
            if (domicile.props)
            {
                if (domicile.props.resident)
                {
                    if (!( domicile.props.resident in namelist ))
                    {
                        namelist[namelist.length]=domicile.props.resident;
                        //n9spider_yt_userscan(domicile.props.resident, map);
                    }
                }
            }
        }
        console.log(namelist);
    }
    
    var namelist = map.getItemResidentList();
    console.log("spid216:");
    console.log(namelist);
    
    n9spider_yt_slowscan_namelist(namelist,map);
    return;
}

function n9spider_yt_video_div(args)
{
    //c/onsole.log("spid163: args videodiv");
    //c/onsole.log(args);
    var post_date = args.n9_video.get("post_date");
    var video_id = args.n9_video.get("video_id");
    var video = args.n9_video;
    
    //c/onsole.log("spid393: yt_video_div");
    //c/onsole.log(video);
    var video_viewed = video.get("video_viewed");
    var bgcolor = "#FFFFFF";
    if (video_viewed)
    {
        bgcolor = "#d0d0d0";
    }
    
    var newel = $("<div>",
                    {   css: {  
                                border:"solid black 1px",
                                margin:"2px",
                                padding:"1px",
                                width:"95%",
                                backgroundColor: bgcolor
                             },
                        video_id: video_id,
                        id: "card_"+video_id, //@@NAMECON: id for card shaped div
                        class: "video_card"
                    }
                    );

	
    
    var datestr = new Date(post_date).toString();
    var dateparts = datestr.split(" ");
    dateparts = dateparts.splice(0,5);
    datestr = dateparts.join(" ");
    
    
    // video ID element
    newel.append($("<span>",
						{text:video_id,
					    	css:{ fontSize:"60%"
					    		}
					    }
				  )
				);
	// datestring element
    newel.append ($("<div>",
                    {
                        css:{fontSize:"90%",
                             rightMargin:"10px"},
                        html: datestr
                    })
                 );
    ///////////////////
	///// video thumbnail
	//////////
	var thumbel =    $("<a class='video_thumb' video_id='"+ video_id +"'>").append(
		$("<img>", 
		{   src : video.get("thumbnail"),
			width:"90%",
			css: {paddingLeft:"5px"}
		})
		);
	

    newel.append( thumbel );
    newel.append ($("<span>", 
                        {
                            href: video.get("video_url"),
                            html:"video by: <b>"+args.n9_video.get("author")+"</b> ",
                            css:{   
                                    fontStyle:"italic",
                                    fontSize:"70%"
                                }
                        }
                    )
                  );
    newel.append ($("<br/>"));
    newel.append ($("<span>", 
                        {
                            href: video.get("video_url"),
                            text: video.get("title"),
                            css:{   fontSize:"80%",
                                    fontWeight: "bold"
                                }
                        }
                    )
                  );
    
    var vidid = video_id;
    newel.append( $("<div>",
                        {   css: {fontSize:"50%"},
                            text:"est. # comments: "
                                    + video.get("comments_count")
                        }
                    )
                );
    
    newel.append( $("<div>",
                        {
                            class: "info-"+vidid,
                            css:{   width:"90%",
                                    float:"right"
                                }
                        }
                    )
                );
    
    newel.append( $("<br clear='all'/>"));
    newel.attr("data-timestamp",post_date);
    
    return newel;
}





//// SPIDER STUFF BELOW

// YT USER
function N9YTUser(userprops) {
    N9Morsel.call(this);
    if ("_obj" in userprops)
    {
        this.record = userprops;
        return;
    }
    if (!userprops)
    {
        userprops = {};
    }
    //console.log("spid508:");
    //console.log(userprops);
    var uname =     userprops.username
                ||  userprops.author;
                
    if (!uname)
    {
        throw { error:"bad_arguments",
                msg:"can't add User with no name"
              }
    }
    
    this.set("username", uname);
    this.set("last_scan", userprops.last_scan ?
                            userprops.last_scan
                            : 0);
    this.set("user_locale", "youtube");
    this.set("video_url", userprops.video_url);
    
    this.set_objval("name", this.get("username"));
    this.set_objval("db_name", "spiderdb");
    this.set_objval("namespace", "youtube");
    this.set_objval("collect_name", "users");
}       
N9YTUser.prototype = new N9Morsel();


// YT VIDEO
function N9YTVideo(vidprops) {
    N9Morsel.call(this);
    //c/onsole.log("spid346:");
    //c/onsole.log(vidprops);
    
    if ("_obj" in vidprops)
    {
        this.record = vidprops;
    }
    else
    {
        //c/onsole.log("spid561:");
        //c/onsole.log(vidprops);
        var entry = vidprops.entry;
        this.set("author_pretty", entry.author[0].name.$t);
        var urilist = entry.author[0].uri.$t.split("/");
        this.set("author", urilist[urilist.length-1]);
        
        this.set("video_id_full", vidprops.entry.id.$t);
        var vidurlist = vidprops.entry.id.$t.split("/");
        this.set("video_id", vidurlist[vidurlist.length-1]);
        
        this.set("title", vidprops.entry.title.$t);
        
        this.set("post_date", new Date(vidprops.entry.published.$t).valueOf());
        this.set("entry",vidprops.entry);
        //this.set("init_props", vidprops);
        var timestamp = new Date(entry.published.$t).getTime();
        this.set("timestamp", timestamp);
        if (!entry.gd$comments)
        {
            this.set("comments_count", 0);
            this.set("comments_feed",0);
        }
        else
        {
            this.set("comments_count", entry.gd$comments.gd$feedLink.countHint);
            this.set("comments_feed", entry.gd$comments.gd$feedLink.href);
        }
        this.set("first_comment_scan", 0);
        this.set("last_comment_scan", 0);
        if ("video_url" in vidprops)
        {
            this.set("video_url", vidprops.video_url);
        }
        
        this.set("category", n9spider_yt_getcategory(entry));
        this.set("description", entry.content.$t);
        if (!entry.gd$rating)
        {
            this.set("rating", {    rating: 0,
                                    max: 5,
                                    min: 1,
                                    num_raters: 0
                               });
        }
        else
        {
            this.set("rating", {    rating: entry.gd$rating.average,
                                    max: entry.gd$rating.max,
                                    min: entry.gd$rating.min,
                                    num_raters: entry.gd$rating.numRaters
                                });
        }
        this.set("responses_feed", n9spider_yt_getlink(entry.link, "video.responses"));
        this.set("duration", parseFloat(entry.media$group.yt$duration.seconds));
        fcount = n9_safeget(entry, "yt$statistics.favoriteCount");
        this.set("stats", { favorite_count: fcount?fcount:0});
        vcount = n9_safeget(entry, "yt$statistics.viewCount");
        this.set("view_count", vcount ? vcount:0);
        this.set("thumbnail", entry.media$group.media$thumbnail[0].url);
        
        this.setMorselVal("_obj.name", this.get("video_id"));
        this.setMorselVal("_obj.db_name", "spiderdb");
        this.setMorselVal("_obj.namespace", "youtube");
        this.setMorselVal("_obj.collect_name", "videos");
    }
};
N9YTVideo.prototype = new N9Morsel();
N9YTVideo.prototype.yt_scan_comments = function ()
{
    console.log("spid489:scan_comments");
    var last_scan = this.get("last_comment_scan");
    var this_time = new Date().getTime();
    
    this.set("last_comment_scan", this_time);
    var depth = 1; // if we've seen this video before, then only get one pag
    var first_scan = this.get("first_comment_scan");
    if (!first_scan)
    {
        depth = 10; // 25 comments per depth 6==150
        this.set("first_comment_scan", new Date().getTime());
    }
    var entry = this.get("entry");
    var commentsurl = this.get("comments_feed")+"?alt=json";
    var count_hint = this.get("comments_count");
    function recurseComments(username, commentsurl, max) {
            // @@ NOTE: DOES NOT RECURSE YET!  use setTimeout
            console.log("spid496:video.recurseComments "
                        + " " +username
                        + " " +commentsurl
                        + " " + max);
            var enclosed_username = username;
            if (typeof(max) == "undefined")
            {
                max = 1;
            }
            var enc_max = max;
            
            $.ajax({type:"get",
                dataType:"json",
                url: commentsurl,
                success: function (data) {
                    //c/onsole.log("spid93: comments reply");
                    //c/onsole.log(data);
                    var map = _njn.inline("get_map")[0];
                    n9spider_yt_feedparse_comments( enclosed_username, 
                                                    data.feed,
                                                    map);
                                                    //enclosed_create_domicile);
                    var nexturl = n9spider_yt_getlink(data.feed.link, "next");
                    console.log("spid519: next comment url --> "+nexturl);
                    enc_max--;
                    console.log("spid520: yt spider count down step #"+enc_max);
                    if  (enc_max && nexturl)
                    {
                        // @@HARDCODED: milleseconds between comments get3
                        setTimeout(function()   { recurseComments(enclosed_username,
                                                    nexturl,
                                                    enc_max);
                                                },30000);
                                                    
                    }
                },
                error: function (data) {
                    //a/lert("didn't work homie");
                    console.log("spid533: it didn't work");
                    dbg_error = data;
                    console.log(data);
                }
               }
              );
        }
    var video_author = this.get("author");
    recurseComments(video_author, commentsurl, depth);
}
N9YTVideo.prototype.authorLink = function ()
{
    var userlink = "www.youtube.com/user/"+ this.get("author");
    return userlink;
}

// YT Comment
function N9YTComment(commentprops) {
    N9Morsel.call(this)
    if ("_obj" in commentprops)
    {
        this.record = commentprops;
    }
    else
    {
        var entry = commentprops.entry;
        this.set("author_pretty", entry.author[0].name.$t);
        var urilist = entry.author[0].uri.$t.split("/");
        this.set("author", urilist[urilist.length-1]);
        this.set("video_author", commentprops.video_author);
        this.set("video_id", entry.yt$videoid.$t)
        this.set("entry", commentprops.entry);
        //this.set("init_props", commentprops);
        this.set("comment_id", entry.id.$t);
        
        var timestamp = new Date(entry.published.$t).getTime();
        this.set("timestamp", timestamp);
        this.set("comment_state", 0);
        //c/onsole.log("spid385:");
        //c/onsole.log(this);
        var repleeid = n9spider_yt_getlink( entry.link,
                                    "in-reply-to");
        this.set("replee_id", repleeid);
        this.set("content", entry.content.$t);
        this.set("channel_id", entry.yt$channelId.$t);
        
        this.setMorselVal("_obj.name", this.get("comment_id"));
        this.setMorselVal("_obj.db_name", "spiderdb");
        this.setMorselVal("_obj.namespace", "youtube");
        this.setMorselVal("_obj.collect_name", "comments");
    }
    
}
N9YTComment.prototype = new N9Morsel();
N9YTComment.prototype.comment_state_schema = [   {css:
                                    {backgroundColor:"white",
                                        color: "black"
                                    }},
                                    {css:
                                    {   backgroundColor:"#f0f0f0",
                                        color: "#a0a0a0"
                                    }},
                                    {css:
                                    {backgroundColor:"LightYellow",
                                        color: "black"
                                    }},
                                    {css:   {   backgroundColor:"LightGreen",
                                                color: "black"
                                    }},
                                    {css:   {   backgroundColor:"LightBlue",
                                                color: "black"
                                            }
                                    },
                                    {css:   {   backgroundColor:"black",
                                                color: "green"
                                            }
                                    },
                                    {css: { backgroundColor:"black",
                                            color: "yellow"
                                          }
                                    },
                                    {css:{  backgroundColor:"black",
                                            color: "red"
                                         }
                                    }
                                ];

N9YTComment.prototype.advanceState = function ()
{
    var cs = this.get("comment_state");
    if (!cs && cs != 0)
    {   
        console.log("spid617: comment_state is NaN-->"+cs);
        cs = 0;
        console.log("cs = "+cs);
    }
    this.set("comment_state", cs+1);
    console.log("spid636:");
    console.log(this.record);
    if (this.get("comment_state") >= this.comment_state_schema.length)
    {
        console.log("spid626: comment_state wrapping from -->", cs);
        this.set("comment_state", 0);
    }
    return this.get("comment_state");
}

N9YTComment.prototype.applyCommentStateCSS = function(div, newstate)
{
    var state;
    var argtype = typeof(newstate);
    if (argtype == "undefined")
    {
        //c/onsole.log("spid631: css apply: newstate undefined")
        state = this.get("comment_state");
        if (state==undefined)
        {
            state = 0;
            this.set("comment_state", state);
        }
    }
    else
    {
        state = this.setState(newstate);
    }
    //c/onsole.log("spid643:");
    //c/onsole.log(state);
    var state_scheme = this.comment_state_schema[state];
    var css = state_scheme.css;
    //c/onsole.log("spid703:");
    //c/onsole.log(css);
    div.css(state_scheme.css)
}

N9YTComment.prototype.divNIM = function(comment_id, replyor)
{
    var comment_id_split = comment_id.split("/")
    var comment_frag = comment_id_split[comment_id_split.length-1];
    
    var msg_text = "Comment Not In Memory, id = " + comment_frag;
    var div = $("<div>",
        {   css: {
                border:"solid yellow 1px",
                padding:"2px",
                color:"lightGray",
                margin:"1px",
                },
            class: "comment_div",
            "data-timestamp": replyor.get("timestamp"),
            "data-comment_id": comment_id,
            id: this.divID(comment_id)
           
        });
    
    var msg = $("<div>",{
                            css: {  fontSize:"30%"
                                 },
                            text: msg_text
                        });
    
    var date = $("<span>",
                {   css: {  float:"right",
                            color: "lightRed",
                            fontSize:"70%",
                            padding:"1px"
                         },
                    text: "unknown"
                });
                
    // prepends
    
    div.prepend("<br>");
    div.prepend(date);
    
    var prettyauth =  $("<span>",
            {   css: {  float:"left",
                        fontSize:"70%",
                        fontDecoration:"italic",
                        paddingRight :"10px"
                     },
                text: "unknown author"
            });  
    div.prepend(prettyauth);
    div.prepend(msg);
    div.append($("<div>",
                {   class: "comment_replies "+ "replies_to_"+this.divID(comment_id),
                    css: {  margin: "3px"
                        }
                }   
               ));
    //div.data("comment_obj", this);
    //c/onsole.log(div.data());
    this.applyCommentStateCSS(div);
    return div;   
}
N9YTComment.prototype.div = function()
{
    var div = $("<div>",
        {   css: {
                border:"solid black 1px",
                padding:"2px",
                margin:"1px"
                },
            class: "comment_div",
            "data-timestamp": this.get("timestamp"),
            "data-comment_id": this.get("comment_id"),
            "data-replee_id": this.get("replee_id"),
            id: this.divID(),
            text: this.get("content")
        });
    
    var now = new Date().getTime();
    var thendate = new Date(this.get("timestamp"))
    var then = thendate.getTime();
    var date = $("<span>",
                {   css: {  float:"right",
                            fontSize:"70%",
                            padding:"1px"
                         },
                    text: thendate
                });
    var duration = Math.floor(Math.abs(now-then)/1000/60/60/24);
    var durationEL = $("<span>",
                        {   text: " " + duration+ " days ago"
                        });
                        
                
    // prepends
    div.prepend("<br>");
    date.append(durationEL);
    div.prepend(date);
    if (this.get("author") != this.get("author_pretty"))
    {
        var author = $("<span>",
                {   css: {  float:"left",
                            fontSize:"70%",
                            fontWeight:"bold",
                            padding :"1px"
                         },
                    text: "("+this.get("author")+")"
                });
        div.prepend(author);
    }

    var prettyauth =  $("<span>",
            {   css: {  float:"left",
                        fontSize:"70%",
                        fontDecoration:"italic",
                        paddingRight :"10px"
                     },
                text: this.get("author_pretty")
            });  
    div.prepend(prettyauth);
    
    div.append($("<div>",
                {   class: "comment_replies"
                            + " replies_to_"+this.divID(this.get("comment_id")),
                    css: {  margin: "3px"
                        }
                }   
               ));
    //div.data("comment_obj", this);
    //c/onsole.log(div.data());
    this.applyCommentStateCSS(div);
    return div;
}

N9YTComment.prototype.divID = function (raw_id)
{
    var cid;
    if (raw_id)
    {
        cid = raw_id;
    }
    else
    {
        cid = this.get("comment_id");
    }
    var divid = n9escapeID(n9_strip_protocol(cid));
    return divid;
}
N9YTComment.prototype.setState = function (newstate)
{
    var argtype = typeof(newstate);
    console.log("spid721:"+argtype+ "::"+newstate);
    switch(argtype)
    {
        case "number":
            this.comment_state = newstate;
            break;
    }
    if (this.comment_state >= this.comment_state_schema.length)
    {
        console.log("asked to set state to illegal state: "+ newstate)
        this.comment_state = 0;
    }
    return this.comment_state;
}


// CONFIG TABLES

/* @@DEVCON2
//  I have realized that the fact that I use the regex once on the whole comment and 
//  again after I have taken it out leads to wierdity, specifically the \s getting 
//  stripped from the watch link (due to where I placed the paren)
//  must sort out eventually... perhaps with rules for the regexes and the groups
//  or maybe the adapter function have to be well planned...  ?!@?!  you were warned
*/

function groupsToDict(clue, groups)
{
	var adaptor = clue.group_adaptor;
	var newdict = {"whole":groups[0]};
	if (adaptor)
	{
		
		for (var n=0; n<adaptor.length;n++)
		{
			var key = adaptor[n];
			newdict[key] = groups[n+1];
		}
		return newdict;
	}
	else
	{
		return null;
	}
}

rdbGenericVideoLinkTypes = {
	watchlink: { 	site: "Youtube Watchlink",
				indicator: "watch?v=",
				protocol: "youtube2013",
				regex: /(\s|\/)(watch\?v=([a-zA-Z0-9]+?))(\s|$)/g,
				rcolor: "lightGray",
				group_adaptor: ["lead_space",
								"watch_frag",
								"video_id",
								"end_video_id"
								],
				mkURL: function (groups)
						{
							var gdict = groupsToDict(this, groups);
							if ("watch_frag" in gdict)
							{
								var tehpath = "http://www.youtube.com/"+gdict.watch_frag;
								return tehpath;
							}
						},
				mkID: function (groups)
						{
							var gdict = groupsToDict(this, groups);
							if ("video_id" in gdict)
							{
								return gdict.video_id;
							}
						},
				mkClue: function (groups)
						{
							//c/onsole.log("spid1317:", groupsToDict(this, groups));
							var clue = $.extend(true, {}, this);
							clue.videoID = this.mkID(groups);
							clue.URL = this.mkURL(groups);
							clue.site = this.site;
							clue.typename = "watchlink";
							return clue;
						}
			 },
	youdoubled: { 	site: "Confrep's Site",
					indicator: "youdoubled",
					protocol: "clipbucket2013",
					regex: /youdoubled\s+(.*?)\s/g,
					rcolor: "yellow",
					mkURL: function (groups)
						{
							if (groups.length>1)
							{
								var tehurl= "http://youdoubled.com/watch_video.php?v="+groups[1];
								//console.log("sR228:", tehurl);
								return tehurl;
							}
						},
					mkID: function (groups)
						{
							if (groups.length>1)
							{
								return groups[1];
							}
						},
				mkClue: function (groups)
						{
							var clue = $.extend(true, {}, this);
							
							clue.videoID = this.mkID(groups);
							clue.URL = this.mkURL(groups);
							clue.site = this.site;
							clue.typename = "youdoubled";
							return clue;
						},
				validateID: function (id)
					{
						//var numbers = id.search(/\d/);
						//var lowers  = id.search(/[a-z]/);
						//var uppers  = id.search(/[A-Z]/);
						var len = id.length;
						//var rightlen = (len >10) && (len <16);
						var rightlen = (len == 12);
						return rightlen;
						//return numbers && lowers && uppers && rightlen;
					}
			},
	youtube: { 	disabled: true,
				site: "Youtube",
				indicator: "youtube",
				protocol: "youtube2013",
				regex: /(^|\s)youtube\s+([a-zA-Z0-9]+?)(\s|$)/g,
				group_adaptor: ["lead_space",
								"video_id",
								"end_video_id",
								],
				rcolor: "lightBlue",
				mkURL: function (groups)
						{
							var gdict = groupsToDict(this, groups);
							if ("video_id" in gdict)
							{
								var tehpath = "http://www.youtube.com/watch?v="
												+gdict.video_id;
								return tehpath;
							}
						},
				mkID: function (groups)
						{
							var gdict = groupsToDict(this, groups);
							if ("video_id" in gdict)
							{
								return groups[1]
							}
						},
				mkClue: function (groups)
						{
							var clue = $.extend(true, {}, this);
							clue.videoID = this.mkID(groups);
							
							clue.URL = this.mkURL(groups);
							clue.site = this.site;
							clue.typename = "youtube";
							return clue;
						},
				validateID: function (id)
					{
						//var numbers = id.search(/\d/);
						//var lowers  = id.search(/[a-z]/);
						//var uppers  = id.search(/[A-Z]/);
						var len = id.length;
						//var rightlen = (len >10) && (len <16);
						var rightlen = (len == 11);
						/*console.log("spid1283: validate youtube id:", 
									len, 
									rightlen, '"'+id+'"',
									this);
						*/
						return rightlen;
						//return numbers && lowers && uppers && rightlen;
					}
			 },
	vimeo: { 	site: "Vimeo",
					indicator: "vimeo",
					protocol: "vimeo2013",
					regex: /vimeo\s+(.*?)\s/g,
					rcolor: "orange",
					mkURL: function (groups)
						{
							if (groups.length>1)
							{
								var tehurl= "http://vimeo.com/"+groups[1];
								//console.log("sR268:", tehurl);
								return tehurl;
							}
						},
					mkID: function (groups)
						{
							if (groups.length>1)
							{
								return groups[1];
							}
						},
					mkClue: function (groups)
						{
							var clue = $.extend(true, {}, this);
							
							clue.videoID = this.mkID(groups);
							clue.URL = this.mkURL(groups);
							clue.site = this.site;
							clue.typename = "vimeo";
							return clue;
						},
					validateID: function (id)
					{
						var allnums = (id.search(/[a-zA-Z]/) == -1);
						return allnums;
					}
			},
	dailymotion: { 	site: "DailyMotion",
					indicator: "dailymotion",
					protocol: "dailymotion2013",
					regex: /dailymotion\s+\/?video\/(.*?)\s/g,
					rcolor: "lightBlue",
					mkURL: function (groups)
						{
							//console.log("sR149:", groups);
							if (groups.length>1)
							{
								var tehurl= "http://www.dailymotion.com/video/"+groups[1];
								//console.log("sR321:", tehurl);
								return tehurl;
							}
						},
					mkID: function (groups)
						{
							if (groups.length>1)
							{
								return groups[1];
							}
						},
				mkClue: function (groups)
						{
							var clue = $.extend(true, {}, this);
							
							clue.videoID = this.mkID(groups);
							clue.URL = this.mkURL(groups);
							clue.site = this.site;
							clue.typename = "dailymotion";
							return clue;
						}
			},
	web: { 	site: "The Web",
					indicator: "theweb",
					protocol: "webURL",
					regex: /theweb\s+(.*?)\s+(.*?)\s+(.*?)\s/g,
					mkURL: function (groups)
						{
							//console.log("sR149:", groups);
							if (groups.length>1)
							{
								var tehurl= "http://www.dailymotion.com/video/"+groups[2];
								//console.log("sR321:", tehurl);
								return tehurl;
							}
						},
					mkID: function (groups)
						{
							if (groups.length>1)
							{
								return groups[1];
							}
						},
				mkClue: function (groups)
						{
							var clue = $.extend(true, {}, this);
							
							clue.videoID = this.mkID(groups);
							clue.URL = this.mkURL(groups);
							clue.site = this.site;
							clue.typename = "dailymotion";
							return clue;
						}
			}
	};


// SPIDER LIBRARY

function N9YTSpiderLib (){
    this.users_by_id = {};
    this.videos_by_id = {};
    this.videos_by_author = {};
    this.videos_by_commenter = {};
    this.comments_by_author = {};
    this.comments_by_video_author = {};
    this.comments_by_video_id = {};
    this.comments_by_resident_video_author = {};
    this.comments_by_resident_author = {};
    this.comments_by_id = {};
    this.users = [];
    this.clues = [];
    this.clues_by_url = {};
    this.clues_by_youtubeID = {};
    this.comments = [];
    this.videos = [];
    this.db = null;
    
    // O
    const db_name = "yt_db";
    var request = this.idb_rq = indexedDB.open(db_name, 2);
    var enc_this = this;
    request.onsuccess = function (event) 
    {
        enc_this.db = event.target.result;
        _njn.execute("idb_connected",{"spider":enc_this});
    }

    request.onerror = function (event) {
        alert("can't access IndexedDB");
    }
    request.onupgradeneeded = function (event)
        {
            var db = event.target.result;
            
            var usersStore = db.createObjectStore("users", 
                            {keyPath: "payload.username"});
            
            var videosStore = db.createObjectStore("videos", 
                            {keyPath: "payload.video_id"});
            videosStore.createIndex( "by_author", 
                                    "payload.author", 
                                    {unique:false});
            var commentsStore = db.createObjectStore("comments", 
                            {keyPath: "payload.comment_id"});
            commentsStore.createIndex("by_video_author", 
                                        "payload.video_author",
                                        {unique:false});
            commentsStore.createIndex("by_author",
                                        "payload.author",
                                        {unique:false});
            commentsStore.createIndex("by_video_id",
                                        "payload.video_id",
                                        {unique:false});
                                        
            
        };
    };
N9YTSpiderLib.prototype = {
    map : null,
    db_mode: "self_reliant",
    users:null,
    users_by_id: null,
    
    videos:null,
    videos_by_author:null,
    videos_by_url:null,
    videos_by_commenter:null,
    
    clues: null, 
    clues_by_url: null,
    clues_by_youtueID: null,
    comments: null,
    comments_by_author:null,
    comments_by_video_author:null,
    comments_by_video_id:null,
    comments_by_resident_author: null,
    comments_by_resident_video_author: null,
    
    
    _getMap: function ()
    {
        if (this.map) { return this.map;}
        var map = _njn.inline("get_map")[0];
        this.map = map;
        return map;
    },
    _absorbMap: function (map)
    {
        if (map) {this.map = map;}
        else { this._getMap();}
        return this.map;
    },
    addToDictOfLists: function (dict, key, val)
    {
        
        if (!(key in dict))
        {
            dict[key] = [];
        }
        var list = dict[key];
        list[list.length] = val;
    },
    addToList: function (list, val)
    {
        list[list.length] = val;
    },
    addClue: function (clue)
    {
    	var source_precedence =	
    		[	"idb.checkCommentForClues",
    			"content_scan",
    			"default"
    		];
    	//console.log("spid1526: addclue, clue followed by trace", clue);
    	//console.trace();
    	
    	var tracker = false;
    	tracker = clue.content.indexOf(TRACKER_PHRASE) >= 0;
    	
    	
    	console.log("spid1795: ", clue.URL in this.clues_by_url);
    	if (clue.URL in this.clues_by_url)
    	{
    		var stored_clue = this.clues_by_url[clue.URL];
    		var old_clue = $.extend({}, stored_clue);
    		var new_clue = $.extend({}, clue);
    		
    		var spnew = source_precedence.indexOf(new_clue.source);
    		var spold = source_precedence.indexOf(old_clue.source);
    		if  (spnew == -1) {spnew = source_precedence.length}
    		if  (spold == -1) {spold = source_precedence.length}
    		var newwins = false;
    		console.log("spid1538:spnew vs old:", spnew,spold);
    		
    		if (spnew <= spold )
    		{
    			newwins = true;
    		}
    		// lessor index wins to keep list winner first in source
    		else
    		{
    			newwins = false;
    		}
    		
    		if (newwins)
    		{
    			$.extend(stored_clue, new_clue);
    			//stored_clue.old_clue = old_clue;
    		}
    		else
    		{
    			// @@review: ineffecient, multiple copies of new and old clue 
    			// @@review: to preserve stored_clue
    			//var newclue = $({},clue);
    			//$.extend(newclue, old_clue);
    			//$.extend(stored_clue, newclue);
    			//stored_clue.new_clue = new_clue;
    			// THIS SHOULD SAVE ANY OLD info not in the winning clue...
    			// but atm there is none
    		}
    		
    		_njn.execute("clue_update", stored_clue);
    		_njn.execute("spider_event",
    				{
    					event:"found_clue",
    					clue:clue
    				});
    		console.log("n9spid1148: updating clue, already present", stored_clue); 
    		
    		return stored_clue;
    	}
    	else
    	{
    		//c/onsole.log("n9spid1176: accepting clue, clue");
    	}
    	
    	this.clues_by_url[clue.URL] = clue;
    	this.clues[this.clues.length] = clue;
    	if (tracker)
    	{
    		console.log("spid1668: (tracker) addClue");
    		console.trace();
    	}
    	if (tracker)
    	{
    		console.log("spid1862: about to send clue_new (tracker)", clue);
    	}
    	_njn.execute("clue_new", clue);
    	_njn.execute("spider_event",
    				{
    					event:"found_clue",
    					clue:clue
    				});
    	//console.log("spid1157:", this.clues_by_url);
    	return clue
    },
    
    addComment: function (commentprops, mem_only)
        {
            var map = this._getMap();
            
            var comment = new N9YTComment(commentprops);
            
            // check if we have it and update
            var comment_id = comment.get("comment_id");
            var extant_comment = this.comments_by_id[comment_id];
            if (extant_comment)
            {
                var comment_state = extant_comment.get("comment_state");
                $.extend(extant_comment, comment);
                extant_comment.comment_state = comment_state;
                return extant_comment;
            }
            
            
            this.comments_by_id[comment.get("comment_id")]=comment;
            
            var to = comment.get("video_author");
            var from = comment.get("author");;
            this.addToDictOfLists(  this.comments_by_resident_author,
                                        from,
                                        comment);
            this.addToDictOfLists(  this.comments_by_resident_video_author,
                                        to,
                                        comment);
            
            //if (!this.comments[comment.author])
            //{
            //    this.comments[comment.author] = [];
            //}
            this.addToDictOfLists(  this.comments_by_author,
                                    comment.get("author"), 
                                    comment);
            this.addToDictOfLists(  this.comments_by_video_author, 
                                    comment.get("video_author"),
                                    comment);
            this.addToDictOfLists(  this.comments_by_video_id,
                                    comment.get("video_id"),
                                    comment);
            //c/onsole.log("spid494 comment adding:"+this.comments.indexOf(comment));
            ///c/onsole.log(comment);
            this.addToList(this.comments, comment);
            
            var video = this.videos_by_id[comment.video_id];
            this.addToDictOfLists(  this.videos_by_commenter, 
                                    comment.author,
                                    video
                                );
            if (!mem_only)
            {
                this.saveElement("comments", comment.record);
            }
            
            
            // @@TODO cover this with a flag, perhaps review... here b/c
            // at the moment I was thinking that yes, this is where
            // we will always dispatch comment-analysis, but also
            // there is no doubt reason to sometimes not to check the comment.
            // now I think it probably needs to move/refactor
            // TRYING MOVING THIS this.checkCommentForClues(comment);
            
            return comment;
        },
    addUser: function (userprops, mem_only)
        {
            console.log("spid648: addUser");
            console.log(userprops);
            var user = new N9YTUser(userprops);
            console.log("idb.adduser:",user);
            var uname = user.get("username") 
                            ? user.get("username")
                            : user.get("author");
                            
            if (!uname)
            {
                throw { error:"bad_arguments",
                        msg:"can't add User with no name"
                      }
            }
            
            user.set("username", uname);
            if(!uname) {console.log("UNAME FALSE!"); throw "ufalse";}
            this.users_by_id[uname] = user;
            this.addToList(this.users, user);
            if (!mem_only)
            {   this.saveElement("users", user.record);
            }
            return user;
        },
    addVideo: function(vidprops, mem_only)
        {
            var uname = vidprops.author;
            this.updateUser(vidprops, mem_only);
            var video = new N9YTVideo(vidprops);
            //c/onsole.log("spid517:");
            //c/onsole.log(video);
            var video_id = video.get("video_id");
            if (video_id in this.videos_by_id)
            {
                // then we'll remove
                var oldvideo = this.videos_by_id[video_id];
                var indexof = this.videos.indexOf(oldvideo);
                this.videos[indexof] = video;
                var authors_vids = this.videos_by_author[video.author];
                var avindex = authors_vids.indexOf(oldvideo);
                authors_vids[avindex] = video;
            }
            else
            {
                this.videos[this.videos.length] = video;
                this.addToDictOfLists(this.videos_by_author, video.author, video);
            }
            this.videos_by_id[video.get("video_id")] = video;
            if (!mem_only) { this.saveElement("videos", video.record); }
            return video;
            //this.video[video.video_id] = video
        },
    backgroundHandleRequest: function (rq, options)
    {
    	var cmd = rq.cmd;
		var answer = {};
		answer.ack = true;
		answer.fate = "event_initiated";
		answer.command = rq.cmd;

		switch(cmd)
		{ 
			case "element_curse":
				// these functions have to fire back callbacks as if they came from
				// the local pageprocess from the clients pov, using the novem juristicitonal
				// node (_njn).
				console.log("spid2016:", rq, options);
//				_njn.send_callback_event("complete", rq, options);
				switch (rq.func_name)
				{
					case "dbGetVideo":
						this.rdbGetVideo(  rq.query,
										{gv_complete: function (arg)
											{
												console.log("spid2024:", this, arg);
												_njn.send_callback_event("complete", 
																{
																rq: rq,
																video_record:this.n9video.record
																},
																options); 
												_njn.send_callback_event("gv_complete", 
																{
																rq: rq,
																video_record:this.n9video.record
																},
																options); 
											}
										});
						//_njn.send_callback_event("complete", rq, options);				
						break;
				}
				break;
			default:
				break;
			
		}
    }
    ,
    backgroundHandleReply: function (rq, options)
    {
    }
    ,
    broadcastEvent: function (event, options)
    {
    	console.log("spid2059: spider.broadcastEvent", event, options);
    	if (!options) options = {};
    	_njn.execute("spider_event", event);
    	
    	options.broadcast = true;
    	_njn.send({ cmd: "spider_event",
					event: event
				  },
				  options
				  );
    	
    },
    clueList: function ()
    {
    	return this.clues;
    },
  	// @@CALLBACK @@INTERPROCESS
  	executeAlternateMode: function (func_name, query, options)
  	{
  		addHistory(options, "executeAlternateMode");
  		// @@there
  		console.log("spider2011: func_name", func_name, query, options);
  		switch(this.db_mode)
  		{
  			case "send_to_background":
  				console.log("spid2014: send_to_background", func_name, query, options);
  				_njn.send({cmd:"element_curse",
  							func_name: func_name,
  							query: query,
  						  },
  						  	options
  						  );
  				return true;
  				break;
  			case "self_reliant":
  			default:
  				return false;
  		}
  	},
    updateUser: function (vidprops, mem_only)
        {
            var morsel;
            if ("_obj" in vidprops)
            {
                morsel = vidprops;
                vidprops = morsel.payload;
            }
            var uname = vidprops.author;
            if (!(uname in this.users_by_id))
            {
                this.addUser(vidprops)
            }
            this.users_by_id[vidprops.author]
                .setMorselVal(  "payload.last_scan", 
                                vidprops.last_scan);
            if (!mem_only)
            { 
                this.saveElement(
                        "users", 
                        this.users_by_id[vidprops.author].record);
            }
        },
    hintsFromSearch: function (searchfeed, callback)
    {
        var entry = n9_safeget(searchfeed, "feed.entry");
        if (!entry)
        {
            return;
        }
        var entries = searchfeed.feed.entry;
        var vids = [];
        for (var n = 0 ; n < entries.length; n++)
        {
            var entry = entries[n];
            var thevid = vids[vids.length] 
                       = new N9YTVideo({entry:entry});
            /*console.log("n91260:",  vids[n].get("author_pretty"),
                                    "}{",
                                    vids[n].get("author")
                        );
            */
            if (callback)
            {
            
                callback(thevid);
            }
        }
    },
    
    hintSearch: function (qstring, callback)
    {
        console.log("spid1254: hintSearch");
        $.ajax({type:"get",
                dataType:"json",
                url:"//gdata.youtube.com/feeds/api/videos",
                data:   {q       : qstring,
                         orderby : "published",
                         v       : "2",
                         alt     :"json"
                        },
                _spider: this,
                complete: function (data)
                 {
                    var feed = JSON.parse(data.responseText);
                    console.log("spid1262:", feed);
                    this._spider.hintsFromSearch(feed,callback);
                 }
                }
               );
    },
    
    getVideo: function (query)
    {
        console.log(query);
        if ("video_id" in query)
            {
                //console.log("658:");
                return this.videos_by_id[query.video_id];
            }
    },
    
    listCommenters: function ()
    {
        var total_comments = 0;
        for (var key in this.comments)
        {
            console.log("spid439:"+key
                            + n9_strmul(" ", 20-key.length)
                            + "# of comments = "
                            + this.comments[key].length
                        );
            total_comments += this.comments[key].length;
        }
        console.log("spid447: total = "+total_comments);
    },
    listUsers: function ()
    {
        for (var key in this.users_by_id)
        {
            var last_scan = this.users_by_id[key]
                                .record
                                .payload
                                .last_scan;
            console.log("spid331:"+key
                        + n9_strmul(" ", 20-key.length)
                        + "last_scan = " + last_scan+ "->"
                                            + new Date(last_scan)
                        );
        }
    },
    listVideos: function ()
    {
    },
    prepareBulkdata: function ()
    {
        var morsels = [];
        var videos = [];
        var comments = [];
        var users = [];
        var bulk_data = {   bulk_morsels: ["users","videos","comments"],
                            videos:  videos,
                            users:   users,
                            comments: comments
                        };
        console.log("spid1190: bulk dump users");
        for (var n=0; n < this.users.length ; n++)
        {
            var udata = this.users[n].prepareServerData();
            users[users.length] = udata;
        }
        console.log("spid1190: bulk dump videos");
        for (var n=0; n < this.videos.length ; n++)
        {
            videos[videos.length] = this.videos[n].prepareServerData();
        }
        console.log("spid1190: bulk dump comments");
        for (var n=0; n < this.comments.length ; n++)
        {
            var comment = this.comments[n];
            comments[comments.length] = this.comments[n].prepareServerData();
        }
        return bulk_data;
    },
    requestServerBulkdata: function (userlist)
    {
        
        if (!userlist)
        {   
            var map = _njn.inline("get_map")[0];
            userlist = map.getItemResidentList();
        }
        console.log("spid1267: request start "+new Date());
        var ulist = userlist.slice(0);
        function deferredRequest(ulist)
        {
            
            var  user = ulist.shift();
            
            $.ajax({url:    "/morsels/morsel_bulk_request",
                type:   "post",
                dataType:"json",
                data:  {users: JSON.stringify([user])
                       },
                context: this,
                complete: function (data) {
                        console.log("spid1270: request answered "+ new Date());
                        var response = JSON.parse(data.responseText);
                        console.log(response);
                        this.ingestServerBulkdata(response.bulk_data);
                    }
                });
            setTimeout(deferredRequest, 1000, ulist);
        }
        deferredRequest(ulist);
    },
    ingestServerBulkdata: function (bulk_data)
    {
        function deferredIngest(morsellist)
        {
            var morsel = morsellist.shift();
            var map = _njn.inline("get_map")[0];
            var spider = _njn.inline("get_spider")[0];
            
            var comment = spider.addComment(morsel);
            n9spider_comment2map(comment);
            _njn.execute("spider_event",
                            {   "event":"comment_scan",
                                comment:comment,
                                source:"server"
                            });
            if (morsellist.length>0)
            {
                setTimeout(deferredIngest, 10, morsellist);
            }
            else
            {
                console.log("spid1303: request end "+new Date());
        
            }
        }
        var bulk_morsels = bulk_data.bulk_morsels;
        //bulk_morsels = ["comments"];
        for (var n = 0; n < bulk_morsels.length; n++)
        {
            var morsel_category = bulk_morsels[n];
            var morsels = bulk_data[morsel_category];
            //console.log("spid1309: morsel_category="+morsel_category);
            
            switch (morsel_category)
            {
                case "comments":
                    deferredIngest(morsels.slice(0));
                    break;
                case "users":
                case "videos":
                    for (var i=0; i< morsels.length; i++)
                    {
                        //console.log("spid1319: "+morsel_category);
                        
                        var morsel = morsels[i];
                        console.log(morsel);
                        var map = _njn.inline("get_map")[0];
                        switch(morsel_category)
                        {
                            case "users":
                                this.addUser(morsel);
                                break;
                            case "videos":
                                this.addVideo(morsel);
                                break;
                        }
                    }
                    break;
            }
        }
    },
    sendServerBulkdata: function (tehdata)
    {
        if (!tehdata)
        {
            tehdata = this.prepareBulkdata();
        }
        
        $.ajax( {   url : "/morsels/morsel_bulk_submit",
                    type: "post",
                    dataType: "json",
                    data: { bulk_data: JSON.stringify(tehdata)},
                }
              );
    },
    dbCurseElements: function (element_type, query, options)
    {
    	// actually, what's a general strategy, the object oriented queries are
    	// due to knowledge about the indexes involved etc... so.
    	
    },
    saveElement: function (element_type, record)
    {
    	console.log("spid2260: save element", element_type, this.db_mode);
    	
    	switch(this.db_mode)
    	{
    		case "send_to_background":
    			_njn.send( {cmd: "element_save",
    						element_type: element_type,
    						record: record
    						});
    			break;
    			
    		case "self_reliant":
    		default:
				var transaction = this.db.transaction([element_type], "readwrite");
		
				transaction.oncomplete = function (event) {
					//c/onsole.log("spid823: oncomplete");
				};
				transaction.onerror = function (event){
					console.log("spid826: onerror");
					console.log(event);
					// handle erros my brahman
				};
		
				var objectStore = transaction.objectStore(element_type);
				var request = objectStore.put(record);
				request.onsuccess = function(event){
					// success!
				}
		}
    },
    clearDB: function ()
    {
        var objectStore;
        objectStore = this.db
                            .transaction("comments", "readwrite")
                            .objectStore("comments");
        objectStore.clear();
        objectStore = this.db
                            .transaction("users", "readwrite")
                            .objectStore("users");
        objectStore.clear();
        objectStore = this.db
                            .transaction("videos", "readwrite")
                            .objectStore("videos");
        objectStore.clear();
    },
    checkTextForClues: function (content, extrainfo)
    {
    	var tracker = false;
    	if (content.indexOf("update here:") >=0)
    	{
    		tracker = true;
    		console.log("spid2281:", content, extrainfo);
    	}
    	var genericVideoLinkTypes = rdbGenericVideoLinkTypes;
    	var timestamp = extrainfo.timestamp ? extrainfo.timestamp: null;
    	var source = extrainfo.source ? extrainfo.source: "unknown.checkTextForClues";
    	if (!extrainfo.source)
    	{
    		console.log("spid2127:", extrainfo);
    		console.trace();
    	}
    	
    	//c/onsole.log("sR2269: checkingTextForClues", extrainfo);
    	var author = extrainfo.author ? extrainfo.author: null;
    	var author_pretty = extrainfo.author_pretty ? extrainfo.author_pretty: null;
    	var clueCallback = extrainfo.callback ? extrainfo.callback: null; 
    	var estimated_timestamp = extrainfo.estimated_timestamp ? extrainfo.estimated_timestamp: null;
    	
    	
    	//c/onsole.log("spid2276:", genericVideoLinkTypes);
    	//c/onsole.log("spid2077: checkTextForClues", estimated_timestamp, extrainfo);
    	for (genlinktypename in genericVideoLinkTypes)
		{
			var genlinktype = genericVideoLinkTypes[genlinktypename];
		
    		if (genlinktype.disabled == true)
    		{
    			//c/onsole.log("spid2138: linktype disabled ->", genlinktype.site)
    			continue;
    		}
			var indicator = genlinktype.indicator;
			var regex = genlinktype.regex;
			var mkURL = genlinktype.mkURL;
			var mkID = genlinktype.mkID;
			var mkClue = genlinktype.mkClue;
			var validateID = genlinktype.validateID;
			
			var hasclue = regex.exec(content);
			
			//c/onsole.log("spid2296: hasclue", regex, hasclue);
			
			if (hasclue)
			{
				if (tracker)
				{
					console.log("spid2327: hasclue", hasclue);
				}
				var matches = content.match(regex);
				if (tracker)
				{
					console.log("spid2155: tracker:",  matches, content);
				}
				
				try 
				{
				// @@DEBUG
					if (matches)
					{
						for (var j=0; j<matches.length; j++)
						{
							if (tracker)
							{	console.log("spid2166 (tracker) matches",j,":", matches[j])
							}
							var groups = regex.exec(matches[j]);
							if (tracker)
							{
								console.log("sR2348: (tracker)", groups);
							}
							
							if (groups) 
							{
								// rdb_spider should be this!
								var clue = mkClue.call(genlinktype, groups);
								var validid = false
								if (validateID)
								{
									validid = validateID.call(clue, clue.videoID);
								}
								else
								{
									validid = true; // no function means they are all valid
								}
								/*console.log("spid1970: valid id?", 
													validid, 
													' . id is "'+clue.videoID+'"',
													 clue);
								*/
								
								if (tracker)
								{
									console.log("spid2372: (tracker)", validid, clue);
								}
								if (validid)
								{
									//c onsole.log("spid1944:adding CLUE ", regex, content);
									clue.content = content;
									
									clue.match = groups[0];
									if (source)
									{
										clue.source = source;
									}
									if (timestamp)
									{
										clue.timestamp = timestamp;
									}
									if (estimated_timestamp)
									{
										clue.estimated_timestamp = estimated_timestamp;
									}
									if (author)
									{
										clue.author = author;
									}
									if (author_pretty)
									{
										clue.author_pretty = author_pretty;
									}
									rdb_spider.addClue(clue);
									if (extrainfo && ("callback" in extrainfo))
									{
										extrainfo.callback.call(extrainfo, clue);
										
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
					console.log("spid1960:caught ",err);
					throw err;
				}
			}
		}
    },
    checkCommentForClues: function(comment)
    {
    	var content = comment.get("content");
    	this.checkTextForClues(content, {   author: comment.get("author"),
    										author_pretty: comment.get("author_pretty"),
    										timestamp: comment.get("timestamp"),
    										source: "idb.checkCommentForClues"
    									}
    						   );
	},
	
	
	
	// @@DEPRECATED SEE rdbCurseComments
    // @@DEPRECATED
    // @@DEPRECATED
    // @@DEPRECATED 
    dbCurseComments: function (query, callback) // deprecated see rdb version
    {
    // @@DEPRECATED
    // @@DEPRECATED
    // @@DEPRECATED
    // @@DEPRECATED
    	
        var cbtype = typeof(callback);
        var options = null;
        
        // PARAMETER JUGGLING to adopt function xyz(options) call signature
        if (cbtype == "function")
        {
        	options = {complete:callback};
        }
        else
        {
        	options = callback;
        	callback = options.callback;
        }
        //c onsole.log("spider: dbcurse comments");
        var spider  = rdb_spider;
        var enc_callback = callback;
        // spider == this!!! (right?)
        var tx = this.db.transaction("comments");
        var vidstore = tx.objectStore("comments");
        var index;
        var range;
        if ("video_id" in query )
        {
            index = vidstore.index("by_video_id");
            range = IDBKeyRange.only(query.video_id);
        }
        
        index.openCursor(range).onsuccess = function (event)
        {
        	try
        	{
        		rdb_dbg_cursedcommentcount++;
        	} catch(err)
        	{
        		rdb_dbg_cursedcommentcount = 1;
        	}
        	//console.log("spid2065:dbCurseComments", dbg_count);
            var cursor = event.target.result;
            if (cursor)
            {
                //c onsole.log("spid2066:",cursor.value);
                var commentmorsel = $.extend(true, {}, cursor.value);
                var comment = spider.addComment(commentmorsel);
                if (callback) { callback.call(comment); } // @@THIS DECISION
                _njn.execute("spider_event", {  event:"comment_scan",
                                comment:comment,
                                source: "idb"
                             });
                cursor.continue();
            }
            else
            {
                if (callback) { callback.call(event)} // @@THIS DECISION
             }
        }
    },
    
    // NOT TO BE CONFUSED WITH dbCurseComments above 
    //     (which is obsolete, use this version)
    // NOT TO BE CONFUSED WITH dbCurseComments above
    // NOT TO BE CONFUSED WITH dbCurseComments above
    // NOT TO BE CONFUSED WITH dbCurseComments above
    // NOT TO BE CONFUSED WITH dbCurseComments above
    // NOT TO BE CONFUSED WITH dbCurseComments above
    // port to this cleaner version 
    rdbCurseComments: function (query, options)
    {
    	console.log("spid2555: rdbCurseComments");
    	var eventhandled = 
    		this.executeAlternateMode("dbCurseComments", 
    									query, 
    									{
    										"foreach":callback
    									}
    								 );
    	if (eventhandled)
    	{	//alternate mode returns true means... deferred
    		console.log("spid2565: rdbCurseComments");
    	
    		return;		
    	}
        //c onsole.log("spider: dbcurse comments");
        var spider  = rdb_spider;
        
        var tx = this.db.transaction("comments");
        var vidstore = tx.objectStore("comments");
        var index;
        var range;
        if ("video_id" in query )
        {
            index = vidstore.index("by_video_id");
            range = IDBKeyRange.only(query.video_id);
        }
        //console.log("spid2241: rdbCurseComments options=", options);
        var enclosed_rdb_options = options ? options: {};
        
        var cursor = index.openCursor(range);
        cursor.onerror = 
        	function (event)
        	{
        		var options = enclosed_rdb_options;
        		console.log("spid2357: openCursor error");
        		_njn.execute("spider_event", {event:"comment_scan_error"});
        		if (options.complete)  { options.complete.call(options)} // @@THIS DECISION
        	}
        cursor.onsuccess = 
        	function (event)
			{
				var options = enclosed_rdb_options;
				//c/onsole.log("spid2248:", this);
				try
				{
					rdb_dbg_cursedcommentcount++;
				} catch(err)
				{
					rdb_dbg_cursedcommentcount = 1;
				}
				//console.log("spid2065:dbCurseComments", dbg_count);
				var cursor = event.target.result;
				if (cursor)
				{
					//c onsole.log("spid2066:",cursor.value);
					var commentmorsel = $.extend(true, {}, cursor.value);
					var comment = spider.addComment(commentmorsel);
					if (options.foreach) { options.foreach.call(options, comment); } // @@THIS DECISION
					_njn.execute("spider_event", {  event:"comment_scan",
									comment:comment,
									source: "idb"
								 });
					cursor.continue();
				}
				else
				{
					if (options.complete) { options.complete.call(options)} // @@THIS DECISION
				}
			}
        
        
    },
    dbCurseUsers: function (mask, calldata, callback)
    {
        console.log("spider");
        var tx = this.db.transaction("users");
        var ustore = tx.objectStore("users");
        var rq = ustore.openCursor()
        rq.spider = this;
        rq.onsuccess = function (event)
        {
            var cursor = event.target.result;
            if (cursor)
            {
                console.log("spid667: "+cursor.key);
                console.log(cursor.value);
                var user = new N9YTUser(cursor.value)
                callback(   user.get("username"),
                            user,
                            calldata );
                
                cursor.continue();
            }
        }
    },
    
    dbGetVideo: function (videoID, callback, options)
    {	addHistory(options, "dbGetVideo");
    	
    	var query = {video_id: videoID};
    	if (!options) {options = {}}
    	options.gv_complete = callback;
    	return this.rdbGetVideo(query, options);
    },
    
    rdbGetVideo: function (query, options)
    {
    	function objstoreCallback(event)
    		{
    			console.log("spid2759: idb_videoscan dbGetVideo: objstore.get.onsuccess", event);
    			console.log("spid2760: idb_videoscan enclosed_callback", enclosed_callback);
    			var spider  = _njn.inline("get_spider")[0];
    			result = event.target.result;
    			if (result)
    			{
        			var video = enclosed_spider.addVideo(event.target.result);
        			options.n9video = video;
        			options.status = "ok";
    				enclosed_callback.call(options);
    			}
    			else
    			{
    				options.status = "fail";
    				enclosed_callback.call(options);
    			}
    		};
    	var videoID = query.video_id;
    	var callback = options.gv_complete; 
    	addHistory(options, "rdbGetVideo");
    	
    	// // // // // // // // // //
    	// alternate mode header
    	console.log("spid2655:", videoID,
    							"options=",options);
    	options.video_get_complete = objstoreCallback;
    	
    	var eventhandled = 
    		this.executeAlternateMode("dbGetVideo", 
    									{
    										video_id: videoID,
    									},
    									options
    		);
    		
    	// @@WORKPOINT : look at this thing... this can't bail on eventhandled here! do comments!
    	if (eventhandled)
    	{	//alternate mode returns true means... deferred
    		console.log("spid2565: idb_videoscan dbGetVideo handled by alternate mode");
			// call the callback
			// @@WORKINGPOINT
			
    		return;		
    	}
    	//  // // // // // // // // //
    	// // // // // // // // // // 
    	
    	var enclosed_callback = callback;
    	var enclosed_spider = this;
    	var transaction = this.db.transaction(["videos"]);
    	var objectstore = transaction.objectStore("videos");
    	
    	if(!options) {options = {}};
    	options.videoID = videoID;
    	
    	objectstore.get(videoID)
    		.onsuccess = objstoreCallback;
    },
    dbCurseVideos: function (username, callback)
    {
        console.log("spider: dbcurse videos");
        var spider  = _njn.inline("get_spider")[0];
        var tx = this.db.transaction("videos");
        var vidstore = tx.objectStore("videos");
        var index = vidstore.index("by_author");
        var range = IDBKeyRange.only(username);
        var enclosed_username = username;
        index.openCursor(range).onsuccess = function (event)
        {
            var cursor = event.target.result;
            if (cursor)
            {
                
                var vidmorsel = $.extend(true, {}, cursor.value);
                var video = spider.addVideo(vidmorsel);
                callback(   video);

        _njn.execute("spider_event",
                {   event:  "video_scan",
                    domain: "yt",
                    username : username,
                    video:video,
                    source: "idb"
                });
                
                cursor.continue();
            }
            else
            {
                _njn.execute("spider_event",
                    {   event:  "end_scan_user",
                        domain: "yt",
                        username : enclosed_username
                    });
            }
        }
    },
    loadFromDB: function (args)
    {
        
        var map = args ? args.map : null;
        
        if (!map)
        {
            map = this._getMap();
        }
        console.log("spid660: loadFromDB "+ map);
    
        var transaction = this.db.transaction("comments");
        //c/onsole.log("spid579:");
        var objectStore = transaction.objectStore("comments");
        //c/onsole.log("spid581:");
        var enc_spider = this;
        var enc_map = map;
        var enc_args = args;
        objectStore.openCursor().onsuccess = function(event)
        {
            var map = enc_map;
            var spid = enc_spider;
            //c/onsole.log("spid584:");
            var cursor = event.target.result;
            if (cursor)
            {
                //c/onsole.log("spid585:getting comments:"+ cursor.key);
                //c/onsole.log(cursor.value);
                var comlist =[];
                var commentmorsel = $.extend(true, {}, cursor.value);
                comment = spid.addComment(commentmorsel, true);
                if (map)
                {
                    var to = map.getMainItem(comment.get("video_author"));
                    var from = map.getMainItem(comment.get("author"));
                    if (to && from && to != from)
                    {
                        map.newRelationship({   to:to,
                                                from:from,
                                                video_id: comment.get("video_id")
                                            });
                    }
                    dbg_to = to;
                    dbg_from = from;
                    dbg_comment = comment;
                }
                cursor.continue();
            }
        }
    },
    loadCommentsToResidents: function (args)
    {
        var map = args.map;
        //c/onsole.log("spid578: loadCommentTo(args)");
        //c/onsole.log(args);
        if (map) { this.map = map; }
            else { map = this.map; }
            
        var ress = map.getItemResidentList();
        for (var n=0; n< ress.length; n++)
        {
            this.loadCommentsFrom({  video_author:ress[n]});
        }
    },
    loadCommentsFrom: function (args)
    {
        var author = args.author;
        var video_author = args.video_author;
        var map = this._absorbMap(args.map);
        var display = args.display;
        
        // default display to true for now
        if (!display) { display = true;}
        
        console.log("spid578: loadCommentFrom(args)");
        console.log(args);
        
        var transaction = this.db.transaction("comments");
        //c/onsole.log("spid579:");
        var objectStore = transaction.objectStore("comments");
        //c/onsole.log("spid581:");
        var enc_spider = this;
        var enc_map = map;
        var enc_args = args;
        var index = null;
        
        var use_name = null;
        if (args.video_author)
        {
            index = objectStore.index("by_video_author");
            use_name = args.video_author;
        }
        else if (args.author)
        {
            index = objectStore.index("by_author");
            use_name = args.author;
        }
        var range = IDBKeyRange.only(use_name);
        dbg_last_index = index;
        
        //c/onsole.log("spid702:index"+map);
        //c/onsole.log(index);
        index.openCursor(range).onsuccess = function(event)
        {
            var map = enc_map;
            var spid = enc_spider;
            var cursor = event.target.result;
            //console.log("spid584: cursor");
            //console.log(cursor);
            if (cursor)
            {
                //console.log("spid585:getting comments:"+ cursor.key);
                //console.log(cursor.value.payload);
                var commentmorsel = $.extend(true, {}, cursor.value);
                var comment = spid.addComment(commentmorsel, true);
                
                //c/onsole.log("spid724: comment");
                //c/onsole.log(comment);
                
                // get user
                spid.loadUser(comment.get("author"));
                spid.loadUser(comment.get("video_author"));
                // get video
                spid.loadVideo(comment.get("video_id"));
                
                if (map && display)
                {
                    //console.log("spid728: have map");
                    spid.mapDisplayComment(
                                    comment.get("author"),
                                    comment.get("video_author"),
                                    comment
                                    );
                }
                cursor.continue();
            }
        }
        _njn.execute("spider_event", 
            {   event: "load_user",
                domain: "db",
                display: display,
                username: use_name,
                event_time: new Date().getTime(),
            });
    },
    loadUser: function (username)
    {
        var transaction = this.db.transaction("users");
        var userstore   = transaction.objectStore("users");
        var request = userstore.get(username);
        console.log("loading username:"+username);
        request.spider = this;
        request.onerror = function (event) 
        {   console.log("loadUser: error");
            console.log(event);
        }
        request.onsuccess = function (event)
        {
            console.log("loadUser: success");
            console.log(event);
            if (event.target.result)
            {
                this.spider.addUser(event.target.result,true);
            }
        }
    },
    loadVideo: function (videoid)
    {   var transaction = this.db.transaction("videos");
        var userstore   = transaction.objectStore("videos");
        var request = userstore.get(videoid);
        request.spider = this;
        request.onerror = function (event) 
        {   console.log("loadVideo: error");
            console.log(event);
        }
        request.onsuccess = function (event)
        {
            //c/onsole.log("spid848: loadVideo: success", event.target.result);
            this.spider.addVideo(event.target.result, true);
        }
    },
    mapDisplayComment: function (from_author, to_author, comment)
    {
                    var map  = this._getMap();
                    var from = map.getMainItem(from_author);
                    var to = map.getMainItem(to_author);
                    var vid_id = comment ? comment.get("video_id") : null;
                    
                    var relargs = {   to:to,
                                                from:from,
                                                video_id: comment.get("video_id")
                                            };
                    if (to && from && to != from)
                    {
                        //console.log("got match ");
                        map.newRelationship(relargs);
                        	
                    }
    }
    
    
}


_yt_spiderlib = new N9YTSpiderLib();
rdb_spider = _yt_spiderlib;

$("body").ready(function () 
{
    _njn.register("get_spider", function ()
    {
        return _yt_spiderlib;
    });
});