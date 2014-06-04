
console.log("loading responder.... (n9context =", n9context+")", "comment =", command);
var CONSOLELOG = true;
var RSPDR_DEBUG = true;
//var responder_insertPoint  = [".watch-sidebar-section", ".watch-sidebar", ".watch", "#page", "#page-container", "body"];
var responder_insertPoint  = [".watch-sidebar-section"];
var urllabel,urlinput;
var RESPONSE_BOX_CLASS = "responder_element";

function add_response(responsecode)
{
    console.log("rspdr9:", responsecode);
    rdb_spider.checkTextForClues(responsecode,
        {   
            source:"responder.add_response",
            callback: function (a,b){
                if (CONSOLELOG) console.log("rspdr11:", a,b);
                n9spider_yt_videoscan(
                {
                    videoID: a.videoID,
                    n9complete: function (event)
                    {
                        if (true) console.log("rspdr13:", this, event);
                                      
                        var r_url = $("#responder_url");
                        var turl = this.n9video.get("video_url");
                        // @@ might as well take this out
                        // @@ should probably have a member that creates the url
                        turl = turl.replace("&feature=youtube_gdata", "");
                        r_url.val(turl);
                                      
                        var tdiv = n9spider_yt_video_div(this);
                        tdiv.css({
                                    "margin": "2px",
                                    "padding": "3px",
                                    "background-color":"#d0d0ff"
                                });
                        var conf_div = $(".confirm_div");
                        var curdiv = conf_div.children();
                        curdiv.slideUp({ duration: 250,
                                         complete: function ()
                                         { this.remove();
                                         }
                                        });
                        var confirm = $("<input>",
                                        {   class:"confirm_response",
                                            value:"confirm",
                                            videoID: this.videoID,
                                            type:"submit"
                                        });
                        var cancel = $("<input>",
                                        {   class:"cancel_response",
                                            value:"cancel",
                                            videoID: this.videoID,
                                            type:"submit"
                                        });
                        tdiv.prepend("<br/>");
                        tdiv.prepend("<br/>");

                        tdiv.prepend(cancel);
                        tdiv.prepend(confirm);
                        
                        tdiv.hide()
                        
                        conf_div.append(tdiv);
                        confirm.data(this);
                        confirm.click(confirm_response);
                        cancel.click(cancel_response);
                        tdiv.slideDown();
                    },
                    n9error: function (event)
                    {
                        console.log("rspdr57:", this, event);
                        alert("Error confirming.  This is an ANNOYING POPUP LEVEL errror.");
                        empty_confirm_div();
                    }
                }
                );
            }
        }
    );
    /*
     
    */
}

function confirm_response(msg)
{
    console.log("rspdr64:", this,$(this).data(), msg);
    var n9video = $(this).data().n9video;
    var morselcopy = $.extend({}, n9video.record);
    morselcopy.payload.entry = null;
    delete morselcopy.payload.entry;
    var json_morsel = JSON.stringify(morselcopy, null, 2);
    
    console.log("rspdr82:", json_morsel);
    $.ajax({
            type:"POST",
            url:"http://novem9.com/morsels/morsel_save",
            data: { morsel: json_morsel
                  },
            success: function (data) {console.log("rspdr86:success", data);},
            error: function (data) {console.log("rspdr87:error", data);}
           }
          );
    var thispage = window.location.href;
    var clue = rdb_spider.checkTextForClues(thispage);
    console.log("rspdr99: confirm_response:", clue);
    if (clue)
    {
        var n9response = new N9Response(
            {
                targetID: clue.videoID,
                responseID: n9video.get("video_id")
            }
        );
        
        n9response.putOnServer();
    }
    //@@ASSUMING: both video ids should be good, right?
    empty_confirm_div();
    add_response_div(n9video);    
}

function cancel_response(msg)
{
   console.log("rspdr70:", this,  msg);
   empty_confirm_div();
}

function empty_confirm_div()
{
    var conf_div = $(".confirm_div");
    var curdiv = conf_div.children();
    curdiv.slideUp({ duration: 250,
                        complete: function ()
                        { this.remove();
                        }
                    });
    var selinp = $($(".taburl_select")[0]).val("+null+");
    var urledit = $("#responder_url");
    urledit.val("");
}

function handle_taburl_change(event)
{
    if (CONSOLELOG) console.log("rspdr14:", event);
    var taburl_select = $(".taburl_select");
    var selectedEL = $( ".taburl_select option:selected" );
    
    var value = selectedEL.val();
      
    if (value == "+refresh+")
    {
        //conf_div.empty();
        populate_taburl_select();
        var conf_div = $(".confirm_div");
        var curdiv = conf_div.children();
        curdiv.slideUp({ duration: 250,
                        complete: function ()
                        {
                            console.log("rspdr56:", this);
                            this.remove();
                        }
                        });
        
        //_njn.send({cmd: "browser_get_tabs"}, 
        //    { complete: get_tabs_complete,
        //    all_tabs: all_tabs
        //    });
        //fill_taburl_select(taburl_select);
    }
    if (true) console.log("rspdr29:", value);
    add_response(value);
}

function notify_refresh_taburl()
{
    var taburl_select = $(".taburl_select");
    
    taburl_select.empty();
    taburl_select.append($("<option>",
                           {value : null,
                               text: "...loading urls from other tabs..."
                           })
                        );
}

function fill_taburl_select(ctrl, tabs)
{
    if (CONSOLELOG) console.log("rspdr25: fill_taburl_select", ctrl, tabs);
    ctrl.empty(); 
    var subset=[];
    
    for(var index in tabs)
    {
        var tab = tabs[index];
        var url = tab.url;
        if (tab.url.indexOf("youtube.com")>0)
        {
            subset[subset.length] = tab;
        }
    }
    
    subset.sort(function (taba,tabb) {
        a = taba.title;
        b = tabb.title;
        if (a>b) return  1;
        if (a<b) return -1;
                 else return 0;
        });
    
    ctrl.append($("<option>",
                  { value: "+null+",
                      text: "choose url from tabs",
                      css: {
                            color:"#000060"
                           }
                  }
                 )
                );
    ctrl.append ($("<option>",
                  { value: "+refresh+",
                    text: "refresh tab list",
                    css: {
                            color: "#006000"
                        }
                  })
                );
    var urls = [];
    for (var index in subset)
    {
        var tab = subset[index];
        var title = tab.title;
        var url = tab.url;
        //c onsole.log("rspdr224:", urls.indexOf(url), url, urls);
        if (urls.indexOf(url) >= 0)
        {
            continue;
        }
        urls[urls.length] = url;
        var myurl = location.href;
        
        if (url != myurl && (url.indexOf("watch")>=0) )
        {
            title = title.replace(" - YouTube", "");
            
            var  opt = $("<option>",
                    {   value: url,
                        text: title
                    });
            ctrl.append(opt);
        }
    }
}

function get_tabs_complete(msg)
{
    if (CONSOLELOG) console.log("rspdr21:", msg);
}

function all_tabs(msg)
{
    var the_tabs = msg.all_tabs;
    if (CONSOLELOG) console.log("rspdr26:", the_tabs);
    
    var tabselect = $(".taburl_select");
    fill_taburl_select(tabselect, the_tabs);
    
    
}

function populate_taburl_select(leave_empty)
{
    var taburl = $(".taburl_select")
    if (CONSOLELOG) console.log("rspd106:",taburl);
    //console.log("rspd30:", respip.innerWidth(), urllabel.width(), urlinput.width());
    //console.log("rspd31:", respip, respip.width(), urllabel.width(), urlinput.width());
    
    //_njn.register("all_tabs", all_tabs);
    if (leave_empty)
    {
        fill_taburl_select(taburl)
    }
    else
    {
        notify_refresh_taburl();
        _njn.send({cmd: "browser_get_tabs"}, 
            { complete: get_tabs_complete,
                all_tabs: all_tabs
            });
    }    
}

function paste_or_drop_url(event)
{
    setTimeout( function () {
        var urlinput = $("#responder_url");
        var urlval = urlinput.val();
        
        console.log("rspdr225:", "-",urlval,"-", urlinput, event);
        
        add_response(urlval);
    }, 100);
}

function make_responder_div()
{
    var responderEL = $("<div>",
                    {
                        css: {  border: "solid #d0d0d0 2px",
                                margin: "2px",
                                padding: "0px"
                            },
                        "class":"responder_element",
                        "id": "RDB_main_responder_element",
                        "made_for": window.location.href
                    });
    var responderTitle = $("<div>",
                           {css: {  borderBottom:"solid #d0d0f0 2px",
                                    fontSize:"15px"
                                 },
                           "class":"responder_title",
                           "text": "Response Box"
                           });
    var iconURL = chrome.extension.getURL("icon48.png");
    var img =  $("<img>",
                {
                    src: iconURL,
                    css: {display:"table-cell",
                          float:"left",
                          height: "16px",
                            }
                });
    
    responderTitle.prepend(img);
    responderTitle.append("<br clear='all'>");
    
    var linkdiv = $("<div>",
                    {css: {border:"1px",
                            paddingTop: "2px",
                            paddingBottom: "2px"
                    }}
                    );
    urllabel = $("<span>",
                     {  css: {
                                    paddingLeft:"2px"
                             },
                        text: "Paste Reply URL:"
                     });
    urlinput = $("<input>",
                     {    id: "responder_url",
                         type:"text",
                         css: {width:"100%",
                            marginLeft:"2px"
                            }
                     }
                    );
    
    
    linkdiv.append(urllabel);
    linkdiv.append(urlinput);
    
    // build select object
    
    var tabselect = $("<select>",
                      {
                        css: { width: "90%",
                                margin: "2px",
                             },
                        class: "taburl_select"
                      });
    linkdiv.append(tabselect);
    
    linkdiv.append($("<div class='confirm_div'>",
                                {   
                                }
                    ));
    var rrd = $("<div>", 
                {  class : "rdb_responses_div",
                    css: { border:"solid #a0d0ff 1px",
                        padding: "2px"
                        }
                });
    linkdiv.append(rrd);
    rrd.append($("<div>",
                     {  class: "rdb_responses_title", 
                         text: "no responses",
                        css: {fontStyle: "italic" }
                     }));
    // build responderEL
    
    var rtd = $("<div>",
                {   class: "rdb_responseto_div",
                    css:{   border:"solid #FF9090 1px",
                            padding: "2px"
                        }
                });
    rtd.append($("<div>",
                     {  class: "rdb_responseto_title", 
                         text: "responds to nothing",
                        css: {fontStyle: "italic",
                                color: "#ff9090"
                        }
                     }));
    
    linkdiv.append(rtd);
    responderEL.append(responderTitle);
    responderEL.append(linkdiv);
    
    return responderEL;
}

function fix_responses_title ()
{
   // for responses_div
   var rrd = $(".rdb_responses_div");
   var rrt = rrd.find(".rdb_responses_title");
   var cards = rrd.find(".video_card");
   var numcards = cards.length;
   if (numcards == 0)
   {
       rrt.text("&#8230 no responses &#8230");
   }
   else if (numcards == 1)
   {
       rrt.text("1 Response:");
   }    
   else if (numcards > 1)
   {
       rrt.text(numcards.toString()+" Responses:");
   }
   
   // for responseto div
   var rtd = $(".rdb_responseto_div");
   var rtt = rtd.find(".rdb_responseto_title");
   var rt_cards = rtd.find(".video_card");
   var numrtcards = rt_cards.length;
   if (numrtcards == 0)
   {
       rtt.html("&#8230 responds to nothing &#8230");
   }
   else 
   {
       rtt.text("Responds to:");
   }    
}

function add_response_div(video)
{   // video: an N9Video
    
    var rnrd = $(".rdb_responses_title");
    
    console.log("rspdr427: got video", this, event);
    var vdiv = n9spider_yt_sidebar_video_div({n9video: video});
    var responses_div = $(".rdb_responses_div");
    vdiv.hide();
    responses_div.append(vdiv);

    console.log(responses_div.width(), 
                responses_div.css("borderLeftWidth"),
                responses_div.css("borderRightWidth"),
                responses_div.css("margin"),
                responses_div.css("padding"));

    var makewide =  responses_div.width() 
                    - parseFloat(responses_div.css("borderLeftWidth"))
                    - parseFloat(responses_div.css("borderRightWidth"))
                    - 2*parseFloat(responses_div.css("margin"))
                    - 2*parseFloat(responses_div.css("padding"));

    vdiv.width(makewide);

    console.log("vdiv --",
                vdiv.width(), 
                makewide,
                vdiv.css("borderLeftWidth"),
                vdiv.css("borderRightWidth"),
                vdiv.css("margin"),
                vdiv.css("padding"));

    var titlewide = vdiv.width() 
                    - parseFloat(vdiv.css("borderLeftWidth"))
                    - parseFloat(vdiv.css("borderRightWidth"));
    vdiv.find(".response_title").width(titlewide);
    fix_responses_title();
    vdiv.slideDown();
}

function get_insert_point()
{
    var retval = null;
    var tehwin = window;
    //while (retval == null)
    {
        console.log("rspdr491:", tehwin);
        for (i in responder_insertPoint)
        {
            var ipstr = responder_insertPoint[i];
            var ip = $(ipstr, window.document);
            console.log("rspdr489:", ip.length, ipstr, ip);
            if (ip.length>0 && retval == null)
            {
                retval = ip;
            }
        }
            
    }
    return retval;
}

function please_insert_responsebox()
{
    var currespdiv = $("."+RESPONSE_BOX_CLASS);
    var tehref = window.location.href;
    if (currespdiv.length>0)
    {
        console.log("rspdr517:", tehref, currespdiv.prop("made_for"));
        if (tehref == currespdiv.prop("made_for"))
        {
            return 1; // 
        }
        else
        {
            return 0; // sometimes we're asked to insert a div, when there is already a div
                      // but if it is not made for this href, then the call has come before
                      // after the pushState but before erasing the page's current contents.
        }
    }
    var respip = get_insert_point();
    console.log("rspdr430: respip =", respip);
    if (!respip)
    {
        console.log("rspdr513: no insertion point found");
        return null;
    }
    var respdiv = make_responder_div();
    respip.prepend(respdiv);
    var taburl = $(".taburl_select");
    taburl.change(handle_taburl_change);
    var urlinput = $("#responder_url");
    urlinput.on("paste", paste_or_drop_url);
    urlinput.on("drop", paste_or_drop_url);
    urlinput.width(respip.innerWidth() - urllabel.width() - 18);
    
    var selinput = $($(".taburl_select")[0]);
    selinput.width(respip.innerWidth() - 16);
    urlinput.keyup(function (e) {
            if (e.keyCode == 13) {
                paste_or_drop_url();
            }
        });
    
    populate_taburl_select();
    var videoCLUE = rdb_spider.checkTextForClues(window.location.href);
    
    if (RSPDR_DEBUG) console.log("rspdr 457:", videoCLUE);
    
    if (videoCLUE)
    {
        // look for responses from the server
        var query = {
                        "_obj.db_name"     : "spiderdb",
                        "_obj.collect_name": "responses",
                        "payload.targetID" : videoCLUE.videoID
                    };
        var data = {query: JSON.stringify(query)}
        $.ajax({
                    type: "POST",
                    url : "http://novem9.com/morsels/morsel_find",
                    data: data,
                    success: function (data)
                    {
                        console.log("rspdr410:", this, data);
                        if ("answer" in data && "morsels" in data["answer"])
                        {
                            var morsels = data["answer"]["morsels"];
                            //
                            // RESPONSES RESULT LOOP
                            // 
                            for (var i in morsels)
                            {   // @@ALT: might be safter to wrap in N9Morsel obj and use getMorselVal
                                var response = morsels[i];
                                console.log("rspdr417:",response.payload.responseID,
                                            "--->", response.payload.targetID);
                                var responseID = response.payload.responseID;
                                n9spider_yt_videoscan(
                                    {
                                        videoID: responseID,
                                        n9complete: function (event)
                                            {
                                                // can be replaced by add_response_div(this.n9video)
                                                
                                                console.log("rspdr427: got video", this, event);
                                                var video = this.n9video;
                                                var vdiv = n9spider_yt_sidebar_video_div({n9video: video});
                                                var responses_div = $(".rdb_responses_div");
                                                responses_div.append(vdiv);
                                                
                                                console.log(responses_div.width(), 
                                                            responses_div.css("borderLeftWidth"),
                                                            responses_div.css("borderRightWidth"),
                                                            responses_div.css("margin"),
                                                            responses_div.css("padding"));
                                                
                                                var makewide =  responses_div.width() 
                                                                - parseFloat(responses_div.css("borderLeftWidth"))
                                                                - parseFloat(responses_div.css("borderRightWidth"))
                                                                - 2*parseFloat(responses_div.css("margin"))
                                                                - 2*parseFloat(responses_div.css("padding"));
                                                
                                                vdiv.width(makewide);
                                                
                                                console.log("vdiv --",
                                                            vdiv.width(), 
                                                            makewide,
                                                            vdiv.css("borderLeftWidth"),
                                                            vdiv.css("borderRightWidth"),
                                                            vdiv.css("margin"),
                                                            vdiv.css("padding"));
                                                
                                                var titlewide = vdiv.width() 
                                                                - parseFloat(vdiv.css("borderLeftWidth"))
                                                                - parseFloat(vdiv.css("borderRightWidth"));
                                                vdiv.find(".response_title").width(titlewide);
                                                fix_responses_title();
                                            }
                                    }
                                );
                            }
                        }
                    },
                    error: function (data)
                    {
                        console.log("rspdr414:", this, data);
                    }
                
                }
                );
        
        // look for vids this is a response TO from the server
        query = {
                        "_obj.db_name"     : "spiderdb",
                        "_obj.collect_name": "responses",
                        "payload.responseID" : videoCLUE.videoID
                    };
        data = {query: JSON.stringify(query)}
        $.ajax({
                    type: "POST",
                    url : "http://novem9.com/morsels/morsel_find",
                    data: data,
                    success: function (data)
                    {
                        console.log("rspdr410:", this, data);
                        if ("answer" in data && "morsels" in data["answer"])
                        {
                            var morsels = data["answer"]["morsels"];
                            //
                            // RESPONSES RESULT LOOP
                            // 
                            for (var i in morsels)
                            {   // @@ALT: might be safter to wrap in N9Morsel obj and use getMorselVal
                                var response = morsels[i];
                                console.log("rspdr617:",response.payload.responseID,
                                            "--->", response.payload.targetID);
                                var targetID = response.payload.targetID;
                                n9spider_yt_videoscan(
                                    {
                                        videoID: targetID,
                                        n9complete: function (event)
                                            {
                                                // can be replaced by add_response_div(this.n9video)
                                                
                                                console.log("rspdr627: got video", this, event);
                                                var video = this.n9video;
                                                var vdiv = n9spider_yt_sidebar_video_div({n9video: video});
                                                var responses_div = $(".rdb_responseto_div");
                                                responses_div.append(vdiv);
                                                
                                                var makewide =  responses_div.width() 
                                                                - parseFloat(responses_div.css("borderLeftWidth"))
                                                                - parseFloat(responses_div.css("borderRightWidth"))
                                                                - 2*parseFloat(responses_div.css("margin"))
                                                                - 2*parseFloat(responses_div.css("padding"));
                                                
                                                vdiv.width(makewide);
                                                
                                                var titlewide = vdiv.width() 
                                                                - parseFloat(vdiv.css("borderLeftWidth"))
                                                                - parseFloat(vdiv.css("borderRightWidth"));
                                                vdiv.find(".response_title").width(titlewide);
                                                fix_responses_title();
                                            }
                                    }
                                );
                            }
                        }
                    },
                    error: function (data)
                    {
                        console.log("rspdr414:", this, data);
                    }
                
                }
                );
    }
    return 2; // means "hopefully working"
    
}

function poll_to_insert(iteration)
{
    if (typeof(iteration) == "undefined")
    {
        iteration = 10;
    }
    var worked = please_insert_responsebox();
    console.log("rspdr707: iteration =", iteration);
    console.log("rspdr708: worked =", worked);
    if (!worked && iteration>0)
    {
        iteration--;
        setTimeout( function ()
        {
            poll_to_insert(iteration);
        }, 1000);
    }    
}

console.log("rspdr422:", n9context);
//if (n9context == "comment_bearing")
$("body").ready ( function () {
            console.log("rspdr426: responder: body_ready");
            please_insert_responsebox();
        });

//this works... but at start of event
$(document).click(function() {
    // @@KLUDGE @@NOTE
    // due to the fact that youtube doesn't actually load a new page, often
    // when the user clicks on a link, but uses pushState. Thus, after a click we check for a
    // while to see if the responses div is still there.
    console.log("rspdr724: document click");
    var currespdiv = $("."+RESPONSE_BOX_CLASS);
    console.log("rspdr735: ckc", currespdiv.prop("click_kludge_click"));
    if (currespdiv.length >0)
    {
        currespdiv.prop("click_kludge_click", true);
    }
    console.log("rspdr737: ckc", currespdiv.prop("click_kludge_click"));
    setTimeout(poll_to_insert, 500);
});

/*var html = "window.history.pushState = function(a,b,c) { alert('Change !'); };";

var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.innerHTML = html;
headID.appendChild(newScript);
*/

/*
function afterNavigate() {
    //if ('/watch' === location.path) 
    if (true)
    {
        please_insert_responsebox();
    }
}
(document.body || document.documentElement).addEventListener('transitionend',
  function( event) {
    console.log("rspdr728: ",event);
        
      if (event.propertyName === 'width' && event.target.id === 'progress') {
        //afterNavigate();
    }
}, true);
*/