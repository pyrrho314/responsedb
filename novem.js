//function jqregex (elem, index, match) {
//             //console.log("nj2: regex");
//             var matchParams = match[3].split(','),
//                 validLabels = /^(data|css):/,
//                 attr = {
//                     method: matchParams[0].match(validLabels) ? 
//                                 matchParams[0].split(':')[0] : 'attr',
//                     property: matchParams.shift().replace(validLabels,'')
//                 },
//                 regexFlags = 'ig',
//                 regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
//             return regex.test(jQuery(elem)[attr.method](attr.property));
//         }

// 
// $.extend(jQuery.expr[':'],
//     { regex : jqregex
//     });
// novem.js
consolelog = false;
// @@DEFAULTS
n9_fixPod_duration  = 100;
n9_fixPod_easing = "swing";
n9_fadeIn_duration  = 500;
n9_fadeOut_duration = 400;
// STRING FORMAT
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};


function log(msg)
{
    if (true)
    {
        //c onsole.log(msg);
    }
}

function textDimension(text){
    var tcopy = text.clone();
    tcopy.removeClass("adjustable");
    
    tcopy.addClass("td_calc");
    $("#hidden_pod").append(tcopy);
    tcopy.show();
    var wmeasure = tcopy.find('.width_measure');
    var hmeasure = tcopy.find('.height_measure');
    var width = wmeasure.width();
    var height = hmeasure.height();
    
    //$(text).html(html_org);
    
    //console.log("n27::"+width +"["+$(wmeasure).outerWidth()+"]"+","+height);
    
    tcopy.remove();
    
    //$(text).hide();
    return [width, height];
}

function pix2str(pix)
    {   
        return pix.toString()+"px";
    }
    
function replaceContent(theid, withurl )
{
    jqel=$("#"+theid);
    $.get(withurl, {}, function(data) {
                //c onsole.log("HEY!");
                target = jqel.html(data);
            }
            );
}

function resizeDone(movepods)
    {
        console.log("nj84: resizeDone");
        if (typeof(movepods) == "undefined")
        {
            movepods = true;
        }
        movepods = true;
        var winh = $(window).height();
        var winw = $(window).width();
        $("body").width(winw);
        $("body").height(winh);
            
        if (typeof(n9_grid_dict) != "undefined")
        {
            var g = n9_grid_dict();
            console.log("using n9_grid_dict");
            var colwidths =  [g.w0, g.w1, g.w2];
            var rowheights = [g.h0, g.h1, g.h2];
            var xs = [ 0, g.w0, g.w0 + g.w1]
            var ys = [ 0, g.h0, g.h0 + g.h1]
            var colw = Math.floor(winw/3)-1; // OBSOLETE?
            var rowh = Math.floor(winh/3)-1; // OBSOLETE?
        }
        else
        {
            console.log("no n9_grid_dict");
            var w0 = winw/3;
            var w2 = w0;
            w0 = 100;
            w0 = Math.floor(w0);
            //w2 = Math.floor(w2);
            w2=100;
            w1 = winw - w0 - w2;
            
            var h0 = winh/3;
            var h2 = h0;
            h0 = 50;
            h0 = Math.floor(h0);
            //h2 = Math.floor(h2);
            h2 = 70;
            h1 = winh - h0 - h2;
            
            var colwidths =  [w0, w1, w2];
            var rowheights = [h0, h1, h2];
            var xs = [ 0, w0, w0 + w1]
            var ys = [ 0, h0, h0 + h1]
            var colw = Math.floor(winw/3)-1;
            var rowh = Math.floor(winh/3)-1;
        }
        //c onsole.log(rowh);
        $("#snaptarget").height($(window).height());
        $("#snaptarget").width($(window).width());

        for (var i = 0; i < 3; i++)
        {
            for (var j=0; j<3; j++)
            {
                var name = "#novem_"+ (j+(i*3)).toString();
                //console.log(name+","+i+","+j+",");
                //console.log("top="+ ys[i] + ", left=" + xs[j])
                $(name).css({position:"absolute", 
                             top:ys[i], 
                             left:xs[j],
                             "z-index":10,
                            });
                $(name).width(colwidths[j]);
                $(name).height(rowheights[i]); 
                
                if (true)
                {
                    var sns_dimstr = $(name).attr("sub_divided");
                    if (sns_dimstr)
                    {
                        var sns_dims = sns_dimstr.split("x");
                        if (sns_dims.length < 2)
                        {
                            sns_dims = [1, parseInt(sns_dims[0])];
                        }
                        else
                        {
                            sns_dims = [parseInt(sns_dims[0]), parseInt(sns_dims[1])];
                        }
                        
                        sns = $(name).find(".subnovem");
                        sns.sort(function (a,b)
                            { 
                                var digre = RegExp("^.*_([0-9]{1,})$");
                                var aid = $(a).attr("id");
                                var bid = $(b).attr("id");
                                //c onsole.log("nj144:"+aid+ " vs " + bid);
                                aid = parseInt(aid.match(digre)[1]);
                                bid = parseInt(bid.match(digre)[1]);
                                //c onsole.log("nj158:"+aid+ " vs " + bid);
                                
                              if (aid == bid)
                                {
                                    return 0;
                                }
                              else if (aid<bid)
                                {
                                    return -1;
                                }
                              else (aid>bid)
                                {
                                    return 1;
                                }
                            });
                        //sns.each(function ()
                        //    {
                                //c onsole.log("nj156:"+$(this).attr("id"));
                        //    });
                        numsn = sns.length;
                        //c onsole.log("nj156:"+numsn+JSON.stringify(sns_dims));
                        var dimx = sns_dims[0];
                        var dimy = sns_dims[1];
                        if (numsn>0)
                        {
                        
                            var snheight = Math.floor(rowheights[i] / dimy);
                            var snwidth  = Math.floor(colwidths[j]  / dimx);
                            for (var row = 0; row<dimy; row++)
                            {
                                for (var col = 0; col < dimx; col++)
                                {
                                    //c onsole.log("nj167: @("+col+","+row+")["+index+"]");
                                    var index = row*dimx+col;
                                    var sn = $(sns[index]);
                                    //pad final ends
                                    sn.css( {
                                                 top: (row*snheight)+"px",
                                                left: (col*snwidth)+"px",
                                            });
                                    
                                    var usewide = snwidth;
                                    var usehigh = snheight;
                                    
                                    if (col == (dimx-1))
                                    {
                                        //c onsole.log("nj189: extra width");
                                        usewide = colwidths[j] - col*snwidth;
                                    }
                                    
                                    if (row == (dimy-1))
                                    {
                                        //c onsole.log("nj195: extra height");
                                        usehigh = rowheights[i] - row*snheight;
                                    }
                                    
                                    sn.height(usehigh);
                                    sn.width(usewide);
                                }
                            }                            
                        }
                        if (false) // OLDER SUBNOVEM SIZER ... if (numsn>0)
                        {
                            var snheight = Math.floor(rowheights[i]/numsn);
                            var snwidth = colwidths[j];
                            for (var k = 0; k < sns.length; k++)
                            {
                                sn = $(sns[k]);
                                if (k == (sns.length-1))
                                {
                                    snhigh = rowheights[i]- (k*snheight);
                                }
                                else
                                {
                                    snhigh = snheight;
                                }
                                sn.css( {
                                            top:(k*snheight)+"px",
                                            left:0,
                                        });
                                sn.height(snhigh);
                                sn.width(snwidth);
                            }
                        }
                    }
                }
            }
        }
        //log ($(name).attr("pod"));
        if (movepods) // pod correction
        {
            _njn.fixPodsInPlace();
            if (false)
            {
                pods = $(".pod");
                pods.each( function()
                 {
                    var podname = $(this).attr("id");
                    var novname = $(this).attr("novem");
                    //log("n110:"+novname);
                    if (typeof(novname) == "undefined")
                    {
                        novname = null;
                    }
                    if (novname)
                        {
                            //log("cph95:"+podname);
                            //$("#"+podname).stop(true, true);
                            //alert("podname");
                            //fix_pod( $(name), $("#"+podname));
                            _njn.fixPod($("#"+podname), $("#"+novname), true);
                            $("#"+podname).css({"z-index":100});
                        }
                 });
            }
        }
        // events
        _njn.executeResizeDoneEvents();
    }
                    
                    
function OBSOLETEreset_novem()
{
    resizeDone(false);
    if (true)
    {
        //log("reset_novem");
        //_njn.fixPod($("#pod_1"),$("#novem_0"));
        //_njn.fixPod($("#pod_3"),$("#novem_2"));
        _njn.fixPod($("#hiperformance_logo0"),$("#novem_2"));
        _njn.fixPod($("#novem_logo0"),$("#novem_8"));
        _njn.fixPod($("#n9_rss_client0"),$("#novem_6"));
        _njn.fixPod($("#n9_rss_sink0"),$("#novem_7"));
        _njn.fixPod($("#funke_article0"), $("#novem_4"));
        //_njn.fixPod($("#n9_rss_client1"), $("#novem_2"));
        //_njn.fixPod($("#n9_gmap0"), $("#novem_4"));
        
        //_njn.fixPod($("#novem_logo_2"),$("#novem_6"));
    }
    else
    {
        //fix_pod($("#novem_0"), $("#pod_1"));
        //fix_pod($("#novem_2"), $("#pod_3"));
        //fix_pod($("#novem_6"), $("#novem_logo_2"));
        fix_pod($("#novem_7"), $("#novem_logo"));
        //fix_pod($("#novem_8"), $("#novem_logo_3"));
    }     
    el = $("#n9_rss_sink0");
    //c onsole.log("n144:"+el.html());
    _njn.triggerSinkTimer("n9_rss_sink0");
}

function Novem() {
    this.targDict = {};
    this.podDict = {};
    
    this.eventDict = {};
    this.target_styles = new Array("tall", "wide", "thumb", "body");
    this.target_aspects = new Array("left", "right", "top", "bottom");
    this.novem = null;
    this.rssSinks = {};
    //this.feedsources = {};
    //this.feedtimers = [];
    this.sinktimers = {};
    this.novem_name2index = {};
    this.gpi = 0;
    this.gti = 0;
    
    this._flying = 0;
    
    this.cloneNovem = function(novem)
    {
        clone = new Array()
        for (i = 0; i < novem.length; i++)
        {
            clone.push( jQuery.extend({}, novem[i]));            
        }
        return clone;
    }
    
    this.parse_sub_divided = function(sns_dimstr) 
    {
        var sns_dims = sns_dimstr.split("x");
        if (sns_dims.length < 2)
        {
            sns_dims = [1, parseInt(sns_dims[0])];
        }
        else
        {
            sns_dims = [parseInt(sns_dims[0]), parseInt(sns_dims[1])];
        }
        return sns_dims;
    }
    this.feedSource = function(pod_id)
    {
        pnam = "#"+pod_id;
        fpu = $(pnam).data("fpu");
        if (!fpu)
        {
            //c onsole.log("n167: storing fpu for "+pod_id);
            fpu = new FeedPodUtility(pod_id);
            $(pnam).data("fpu", fpu);
        }
        //this.feedsources[pod_id] = fpu;
        //this.feedtimers[pod_id] = 0; //setInterval("_feeds[0].sendItem()",2000);
    }
    
    this.parseNovemName = function(novem_name)
    {
        var nna = novem_name.split("_");
        //c onsole.log("n231:"+JSON.stringify(nna));
        return nna
    }
    
    this.resizeDoneHook = function(name, func)
    {
        this.eventDict[name]=func;
    }
    
    this.executeResizeDoneEvents = function()
    {
        $.each((this.eventDict), function (key, value) {
                value();
            });
    }
    
    this.fixPodsInPlace = function ()
    {
        var novem = this.getState();
        var new_novem = this.cloneNovem(novem);
        var resize = true;
        
        // due to the way it works we don't save this elsewhere (only novems are cloned)
        
        for (i = 0; i<novem.length; i++)
        {
            var bt = novem[i];
            var at = new_novem[i];
            
            ////log("#"+i + at.podid + "?==?" + bt.podid);
            
            var zorder;
            if (at.podid != bt.podid || resize) 
            {
                
        // FIXPODSINPLACE
        // FIXPODSINPLACE
        // FIXPODSINPLACE
        
                //log("pod move:"+at.podid);
                at.storePodid();
                if (at.pod)
                {   
                    log("n145:"+ i +":"+ at.id);
                    //_njn.borderLock(at.pod.id);
                    at.pod.borderLock(true);
                    at.loadPod();
                    var neww = at.width-at.pod.extra_w;
                    var newh = at.height-at.pod.extra_h;
                    //$(".pod").each(function(){ 
                    //    $(this).css({"z-index": 100});});
                    //c onsole.log("n265:-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                    at.pod.jq().css({"z-index": 200});
                    //log("n150: pod:"+at.pod.jq().attr("id")+" neww="+neww+" newh="+newh+" top="+at.top+" left="+at.left);
                    at.pod.jq().css({"width": pix2str(neww),
                                "height": pix2str(newh    ),
                                "top"   : pix2str(at.top  ),
                                "left"  : pix2str(at.left ),
                                "z-index":100
                                } );
                    
                    //c onsole.log("nj469:"+at.pod.id+" :now in: "+ at.pod.jq().attr("novem")+" :was: "+lastnovs[at.pod.id]);
                    cnov = at.pod.jq().attr("novem");
                    
        // FIXPODSINPLACE
        // FIXPODSINPLACE
        // FIXPODSINPLACE
                    
                    this.fadeAlterdivs(at.pod, at);
                }
            }
        }
         _njn.validateNovem();
         
        _njn.executeCallback("fixpodinplace_done"); 
    }
    
    this.loadEditorConsole = function()
    {
        this.loadServerPod("cp:cph.editor_console", undefined, "novem_4");
    }
    
    this.fixPodPI = function(podjq, targetjq, resize)
    {
        //c onsole.log("nj468:fixpodpi");
        if (typeof (podjq) == "string")
        {
            elements = podjq.split("}")
            if (elements.length == 1)
            {
                podjq = $(podjq);
            }
            else
            {
                console.log("elements = "+JSON.stringify(elements));
                podjq = $("[n9_name='"+elements[1]+"']");
                
            }
            if (podjq.length == 0)
                { console.log("nj460: no pod found"); return; }
        }
        if (typeof (targetjq) == "string")
        {
            var targetjq_try = $(targetjq);
            // try adding a "#"
            if (targetjq_try.length == 0)
            {
                targetjq = $("#"+targetjq);
            }
            else
            {
                targetjq = targetjq_try;
            }
        }
        if (targetjq.length == 0)
        { console.log("nj460: no target found"); return;}
        // FIXPODPI
        // FIXPODPI
        // FIXPODPI
        // these are for debugging purposes and are used to print state at end of function
        var orig_podid = podjq.attr("id");
        var orig_targetid = targetjq.attr("id");
        var orig_leavingtargetid = podjq.attr("novem");
        if (!orig_leavingtargetid)
        {   orig_leavingtargetid = null; }
        //podjq.attr("last_novem", podjq.attr("novem"));
        
        if (orig_targetid == "novem_4" || orig_leavingtargetid == "novem_4")
        {
            //c onsole.log("nj613:called fixpod_begin"+orig_leavingtargetid);
            _njn.executeCallback("fixpod_begin", {  podid:orig_podid, 
                                                    targetid:orig_targetid,
                                                    leaving_targetid: orig_leavingtargetid
                                                    });
            if (orig_targetid == "novem_4")
            {
                _njn.executeCallback("fixpod_enter_n4", undefined, orig_podid)
            }
            
        }
        
        // GET THE CURRENT NOVEM STATE FROM DOM
        // get state: establish and update novem array (novem==All Nine)
        var novem = this.getState();
        //c onsole.log("speed");
        //c onsole.trace();
        // CLONE THE CURRENT STATE TO MAKE THE AFTER STATE
        // clone state: create a copy of the current state
        // (to modify) the new novem 
        var new_novem = this.cloneNovem(novem);
        
        // MODIFY NEW STATE
        // @@OPTIMIZE
        var pod = this.getPod(podjq.attr("id"), null);

        if (!pod)
        {
            //c onsole.log("nj319: fixPodPI called for non-existent Pod");
            return;
        }

        // semi-kludge... save current novem to use as last_novem is nec
        // due to the way it works we don't save this elsewhere (only novems are cloned)
        
        var lastnovs = {};
        $(".pod").each( function()
            {
                lastnovs[$(this).attr("id")] = $(this).attr("novem");
            });
        //c onsole.log("nj386:"+JSON.stringify(lastnovs));     
        // this is only for debugging purposes
        var orig_target = this.getTarget(orig_targetid);
        //c onsole.log("nj315: =========== " + pod.report());
        //c onsole.log("nj316: ----------- " + orig_target.report());
        
        if (pod == null) // means we got a bad id
        {
            //c onsole.log("bad pod id:"+podjq.attr("id"));
            return;
        }
        
        // "onname" is the ORIGINAL NOVEM NAME, or initial novem for pod being fixed
        var onname = pod.getNovemName();
        var oldtargetnum = null;
        var novaddr = null;
        // FIXPODPI
        // FIXPODPI
        // FIXPODPI
        
        if (onname)
        {
        // @@@working@@@
            oldtargetnum = this.novem_name2index[onname];
            novaddr = this.novemParse(onname);
            //c onsole.log("novaddr={0}".format(novaddr));
            new_novem[oldtargetnum].takePod(null);
            pod.target=novem[oldtargetnum];
        }
        
        var targetid = targetjq.attr("id");

        var targetnum = this.novem_name2index[targetjq.attr("id")]; // this.novid2num(targetid);
        
        //c onsole.log("nj361:"+JSON.stringify(this.novem_name2index));
        
        // @@LANGUAGE
        // the target is where the pod wants to be after the fix
        // before means the target before the changes
        // after means the target after the change
        // thus before_target has some other pod (or null), after_target should have pod
        var before_target =  novem[targetnum];
        var after_target = new_novem[targetnum];
        
        var taker = after_target;
        var takeme = pod;
        var evicted = null;
        while (evicted = taker.takePod(takeme))
        {
            sink = evicted.jq().attr("pod_sink");
            if (sink)
            {
                //c onsole.log("n447: sink in "+evicted.id);
                exstr = sink+"(takeme.jq())"
                //c onsole.log("nj449:"+exstr);
                eval(exstr);
                return;
            }

            var home_addr = this.findHome(evicted.jq());
            var swap = "#"+evicted.jq().attr("id");
            
            //c onsole.log("nj380: evicting "+evicted.id+ " to " + home_addr);
            if (home_addr)
            {
                taker = new_novem[this.novem_name2index[this.findHome(evicted.jq())]];
                takeme = evicted;
            }
            else if (swap)
            {   
                console.log(takeme);
                this.swapPods(swap, "#"+takeme.id);
            }
            else
            {
                
                alert("Nowhere to put "+evicted.id);
                return;
            }
        }
        
        // calculatePodFixture
        // animate changed pods
        ////log("do animations");
        //for (i = 0; i<novem.length; i++) {new_novem[i].storePodid();}
        for (i = 0; i<novem.length; i++)
        {
            var bt = novem[i];
            var at = new_novem[i];
            ////log("#"+i + at.podid + "?==?" + bt.podid);
            
            var zorder;
            if (at.podid != bt.podid || resize) 
            {
                if (at.podid == pod.id)
                {
                    zorder = 210;
                }
                else
                {
                    zorder = 200;
                }
        // FIXPODPI
        // FIXPODPI
        // FIXPODPI
        
                //log("pod move:"+at.podid);
                at.storePodid();
                if (at.pod)
                {   
                    _njn._flying++;
                
                    //log("n145:"+ i +":"+ at.id);
                    //_njn.borderLock(at.pod.id);
                    at.pod.borderLock(true);
                    at.loadPod();
                    var neww = at.width-at.pod.extra_w;
                    var newh = at.height-at.pod.extra_h;
                    //$(".pod").each(function(){ 
                    //    $(this).css({"z-index": 100});});
                    //c onsole.log("n265:-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                    at.pod.jq().css({"z-index": 200});
                    //log("n150: pod:"+at.pod.jq().attr("id")+" neww="+neww+" newh="+newh+" top="+at.top+" left="+at.left);

                    var pnam = podjq.attr("id");
                    var tnam = at.id;
                    
                    if (!resize)
                                {
                                    //c onsole.log("n471: z-index = "+zorder);
                                    at.pod.jq().css({"z-index": zorder,
                                                        });
                                    at.pod.jq().animate({"width": pix2str(neww),
                                                        "height": pix2str(newh    ),
                                                        "top"   : pix2str(at.jq().offset().top  ),
                                                        "left"  : pix2str(at.jq().offset().left )
                                                        // "opacity":1.0
                                                        },
                                                        {   
                                                            // queue:true,
                                                            duration:n9_fixPod_duration,
                                                            easing: n9_fixPod_easing,
                                                            complete: function() {
                                                                // this borderlock is the final snap
                                                                //c onsole.log("nj622: "+_njn._flying);
                                                                _njn._flying--;
                                                                if (_njn._flying == 0)
                                                                {
                                                                    _njn.borderLock(true);
                                                                }
                                                                //var pod = $(this);
                                                                //var targ = $(pod.attr("novem"));
                                                                //_njn.fixPod(pod, targ);
                                                                //$(this).css({"z-index":100, "padding":"0px"});
                                                                var landin = $(this).attr("novem");
                                                                //c onsole.log("nj670:landin = "+landin);
                                                                
                                                                if (landin == "novem_4")
                                                                {
                                                                    setTimeout( function () {
                                                                        _njn.executeCallback("fixPodN4", undefined, $("#novem_4").attr("pod"));
                                                                        }, 1);
                                                                }
                                                            }
                                                        } );
                                }
                                else
                                {
                                    at.pod.jq().css({"width": pix2str(neww),
                                                "height": pix2str(newh    ),
                                                "top"   : pix2str(at.top  ),
                                                "left"  : pix2str(at.left ),
                                                "z-index":100
                                                } );
                                    
                                    //_njn.borderLock();
                                }
                    //c onsole.log("nj469:"+at.pod.id+" :now in: "+ at.pod.jq().attr("novem")+" :was: "+lastnovs[at.pod.id]);
                    cnov = at.pod.jq().attr("novem");
                    if (cnov != lastnovs[at.pod.id])
                    {
                        at.pod.jq().attr("last_novem", lastnovs[at.pod.id]);
                    }
        // FIXPODPI
        // FIXPODPI
        // FIXPODPI
                    
                    this.fadeAlterdivs(at.pod, at);
                }
            }
        }
        pod = this.getPod(orig_podid);
        targ = this.getTarget(orig_targetid);
        //c onsole.log("nj457:^^^^^^^^"+pod.report())
        //c onsole.log("nj458:########"+targ.report()); 
         _njn.validateNovem();
         
    }
    
    this.fixPod = this.fixPodPI;
    
    this.getState = function()
    {
        var novem = this.getNovem();
        for (i = 0; i < novem.length; i++)
        {
            novem[i].getPod();
        }
        this.novem = novem;
        
        return novem;
        
    }
    
    this.getNovemLayout = function ()
    {
        var nl = $("#n9_novem_layout");
        var name = "unknown";
        if (nl.length)
        {
            var jnl = nl.text();
            var nl = JSON.parse(jnl);
            
            name = nl["novem_layout"];
        }
        return name;
    }
    this.getNovem = function()
    {   // getNovemDEEP
        var targetlist = new Array();  // @@OPTIMIZE?
        for (i = 0; i < 9; i++)
        {
            var novname = "novem_"+i;
            var target = this.getTarget(novname);
            targetlist.push(target);
        }
        targetlist.sort();
        var targetnamelist = new Array(); // @@OPTIMIZE?
        $(".subnovem").each( function()
            {
                novname = $(this).attr("id");
                targetnamelist.push(novname);
                // //c onsole.log("n465:getNovem got..."+novname);
            });
        targetnamelist.sort();
        for (var i=0; i < targetnamelist.length; i++)
         {
            // //c onsole.log("n471:"+targetnamelist[i]);
            target = this.getTarget(targetnamelist[i]);
            targetlist.push(target);
        }
        // // //c onsole.log("n481:"+JSON.stringify(targetlist)); 
        for (var i=0; i < targetlist.length; i++)
        {
            this.novem_name2index[targetlist[i].jq().attr("id")] = i;
            }
        return targetlist;
    }
    
    this.getNovemSHALLOW = function()
    { //SHALLOW
        targetlist = new Array();
        for (i = 0; i < 9; i++)
        {
            novname = "novem_"+i;
            target = this.getTarget(novname);
            targetlist.push(target);
        }
        return targetlist;
    }
    
    this.fadeAlterdivs = function(pod, target) {
        //c onsole.log("nj798:"+[pod.id, target.id]);
        // pod and target are novem.js objects
        //c onsole.log("nj683: start alterdivs");
        //c onsole.trace();
        var podjq = $("#"+pod.id);
        var targetjq = $("#"+target.id);
        var alterdivs = podjq.find(".alterdiv");
        ////log(target);
        //////log("n126:"+podjq.html());
        var adlen = alterdivs.each(function()
            {
                ////c onsole.log("nj616:" + pod.id + "|" + $(this).prop("class"));
                if ($(this).hasClass(target.style))
                {
                    // see if it needs loading
                    var content = $(this).attr("content");
                    if (content)
                    {
                        adivid = $(this).attr("id");
                        $(this).load(content);
                        
                    }
                    var tw = targetjq.width();
                    var th = targetjq.height();
                    var tasp = tw/th; // aspect ratio
                    var tar_char = null;
                    if (target.style == "thumb")
                    {
                        if (tasp <.5 && $(this).hasClass("n9_bookend"))
                        {
                            tar_char = "book";
                            //c onsole.log("nj810 BOOK:"+tasp+"_"+tar_char);
                        }
                        else
                        {
                            tar_char = "stamp";
                        }
                        //c onsole.log("nj815:"+tasp+"_"+tar_char);
                    }
                    if (target.style == "tall" && $(this).hasClass("n9_bookend")  )
                    {
                        tar_char = "book";
                    }
                    if (target.style != "tall" && !$(this).hasClass("n9_nosize")  )
                    {
                        if (!$(this).hasClass("n9_no_resize"))
                        {
                            $(this).width(tw);
                            if (!$(this).hasClass("n9_noheight")) { $(this).height(th); }
                        }
                    }            
                    var fontspan = tw;
                    if (target.style == "tall" || target.style == "wide" || target.style == "thumb")
                     {
                        if ( $(this).hasClass("rotate"))
                            {
                                if (target.style == "tall" || tar_char=="book")
                                {
                                    if (!$(this).hasClass("n9_no_resize"))
                                    {       
                                        $(this).width(th);
                                        $(this).height(tw);
                                    }
                                    //c onsole.log("n834:"+target.aspect);
                                    if (target.aspect == "right" || tar_char == "book")
                                    {
                                        console.log("nov886");
                                        $(this).css({   top:  "0px", //"5px",
                                                        left: "0px",
                                                        position:"absolute",
                                                        "-o-transform-origin":"top left",
                                                        "-o-transform":"rotate(90deg)",
                                                        "-webkit-transform-origin":"top left",
                                                        "-webkit-transform":"rotate(90deg)",
                                                        "-moz-transform-origin":"top left",
                                                        "-moz-transform":"rotate(90deg)",
                                                        "-khtml-transform-origin":"left top",
                                                        "-khtml-transform": "rotate(90deg)",
                                                        // for ie 
                                                        "filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)",
                                                    });
                                    }
                                    else
                                    {
                                        
                                         $(this).css({   top:  th.toString()+"px",
                                                        left: "0px", // (((pod.jq().width()-lwid)/2) - (lwid/2)).toString()+"px",
                                                        position:"absolute",
                                                        "-o-transform-origin":"left top",
                                                        "-o-transform":"rotate(-90deg)",
                                                        "-webkit-transform-origin":"left top",
                                                        "-webkit-transform":"rotate(-90deg)",
                                                        "-moz-transform-origin":"left top",
                                                        "-moz-transform":"rotate(-90deg)",
                                                        "-khtml-transform-origin":"left top",
                                                        "-khtml-transform": "rotate(-90deg)",
                                                        // for ie 
                                                        "filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
                                                    });
                                    }
                                }
                                else 
                                {
                                    fontspan = th;
                                    if (!$(this).hasClass("n9_no_resize"))
                                    {           
                                        $(this).width(tw);
                                        $(this).height(th);
                                    }
                                    $(this).css({   top:  "0px", //"5px",
                                                    left: "0px",//Math.floor(tw/2+(fontspan/30)).toString()+"px",
                                                    position:"absolute",
                                                    "-o-transform-origin":"none",
                                                    "-o-transform":"none",
                                                    "-webkit-transform-origin":"none",
                                                    "-webkit-transform":"none",
                                                    "-moz-transform-origin":"none",
                                                    "-moz-transform":"none",
                                                    "-khtml-transform-origin":"none",
                                                    "-khtml-transform": "none",
                                                    // for ie 
                                                    "filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)",
                                                });
                                }
                            }
                            else
                            {
                                if (!$(this).hasClass("n9_no_resize"))
                                {
                                    $(this).width(tw);
                                    $(this).height(th);                        
                                } 
                            }
                        
                     }
                     meas = $(this).find(".measure");
                     inspan = $(this).find(".adjustable").slice(0,1);
                     var fsiz = fontspan/14.2;
                     
                     fsiz = Math.floor(fsiz);
                    $(inspan).css({ "font-size":( fsiz).toString()+"px",
                                   });
                    
                     //log($(this).attr("class")+":    "+$(this).find(".measure"));
                     if (inspan.length >0) // true) // this is the adjustable text code 
                     {
                         if (meas)
                         {
                             
                            ////log("n247:td[0]:"+textDimension($(this))[0]+"|td[1]:"+textDimension($(this))[1]+"---|---width:"+$(this).width()+"---|---height:"+$(this).height());
                            divisor = 15;
                            done = false;
                            if (!done)
                            {
                                fontsize = Math.floor(fontspan/divisor);
                                //log("n253: fontspan="+fontspan+"{}fontsize="+fontsize);
                                
                                dims = textDimension($(this));
                                if (!$(this).hasClass("n9_no_resize"))
                                {           
                                    w = $(this).width()-2;
                                }
                                var widscal = $(this).attr("n9_width_scale");
                                //if (widscal)
                                //{
                                //    w = w * parseInt(widscal);    
                                //}
                                
                                if (!$(this).hasClass("n9_no_resize"))
                                {
                                    h = $(this).height()-2;
                                }
                                tw = dims[0];
                                th = dims[1];
                                
                                goodfs_w = Math.floor(w/tw*fontsize);
                                goodfs_h = Math.floor(h/th*fontsize);
                                goodfs =   Math.min(goodfs_w, goodfs_h);
                                //log("n272: goodfs="+goodfs+"("+goodfs_w+","+goodfs_h+")");
                                if (tar_char == "book")
                                {
                                    if (goodfs == goodfs_h)
                                    {
                                        goodfs = Math.floor(goodfs*.6);
                                    }
                                    else
                                    {
                                        goodfs = Math.floor(goodfs*.9);
                                    }
                                }
                                else
                                {
                                    goodfs = Math.floor(goodfs*.95);
                                    //c onsole.log("nj1011: "+goodfs);
                                    //c onsole.log(this);
                                }
                                $(inspan).css({ "font-size": goodfs.toString()+"px"});
                                //c onsole.log("nj932:"+[w,h,tw,th, dims]);                      
                                //log("n275:divosor="+divisor.toString()+":done?="+done+"{tw="+tw+"{w="+w);
                                done = true;
                                divisor -= 1; 
                                //done = ((w - tw) < 5) || ((h - th)<5) || divisor < 5;
                            }
                         }
                         // log("n325:"+ $(this).attr("class")+"{"+$(this).hasClass("_9_center"));
                        if ((target.style == "wide" || target.style == "tall" || target.style=="thumb") 
                                && $(this).hasClass("n9_center"))
                        {
                            //$(this).show();
                            var pos = textDimension($(this));
                            //$(this).hide();
                            var tarh = target.jq().height();
                            var h = pos[1];
                            var w = pos[0];
                            var tarw = target.jq().width();
                            
                            if ( tar_char != "book" && 
                                (target.style == "wide" ||  target.style == "thumb"
                                    || (target.style == "tall" && !$(this).hasClass("rotate") )
                                ))
                            {
                                var ttop = 0;
                                if ($(this).hasClass("n9_top"))
                                {
                                    ttop = 3;
                                }
                                else if ($(this).hasClass("n9_bottom"))
                                {
                                    ttop = Math.floor( tarh-h -3);
                                }
                                else
                                {
                                    ttop = Math.floor((tarh-h)/2);
                                    ttop = ttop-2;
                                }
                                var left = 0;
                                if ($(this).css("text-align") == "center")
                                {
                                    left = 0;
                                }
                                else
                                {
                                    left =  Math.floor(((tarw-w)/2)-2);
                                }
                                //console.log("nj1030:"+$(this).html());
                                var topper = $(this).attr("n9_below");
                                if (topper)
                                {
                                    tpr = $("#"+topper);
                                    pardiv = tpr.parents(".alterdiv");
                                    pos = pardiv.position();
                                    ttop = pos.top + tpr.height();
                                    tpos = tpr.position();
                                    //c onsole.log("nj1036: "+pos.top+" "+tpr.height());
                                    if (!$(this).hasClass("n9_no_resize"))
                                    {
                                        $(this).width(tpr.width());
                                    }
                                }
                                $(this).css({"top": ttop+"px",
                                             "left":left}); // jtop.toString()+"px"});
                            }
                            else
                            {
                                if ($(this).hasClass("rotate") && ( tar_char == "book" || $(this).hasClass("tall")) )
                                {   
                                    if (tar_char != "book" && target.aspect == "left")
                                    {
                                        $(this).css({    "top": Math.ceil((tarh+w)/2).toString()+"px",
                                                        "left": Math.floor( (tarw-h)/2 ).toString()+"px"}); // jtop.toString()+"px"});
                                    }
                                    else
                                    {
                                        $(this).css({"top": Math.round((tarh-w)/2).toString()+"px",
                                                    "left": (Math.round( h + (tarw-h)/2 )-1).toString()+"px"}); // jtop.toString()+"px"});
                                    }
                                }
                            }
                        }
                    }    
                    
                    $(this).find(".n9_img_center").each(function () {
                            img = $(this);
                            // naturalWidth etc won't work in IE, screw them for now
                            wid   = this.naturalWidth; // img.width();
                            high  = this.naturalHeight; // img.height();
                            
                            pod   = img.parents(".pod");
                            pwid  = targetjq.width();//$(pod).width();
                            phigh = targetjq.height();//$(pod).height();
                            asp = wid/high;
                            pasp = pwid/phigh;
                            podwider = pwid>phigh;
                            //c onsole.log("nj984:"+[wid,high,asp,pwid,phigh,pasp]);
                            amt = "100%";
                            img.show();
                            var scale = 1;
                            if (tar_char == "book")
                            {
                                img.css({width:pwid, height:phigh, // @@kludge only work assuming there is a border!
                                        top:"0px",
                                        left:"0px"});
                            }
                            else
                            {
                                if (asp<=pasp)
                                {
                                    img.css({width: pwid,
                                            height: "auto",
                                            
                                            });
                                    scale = pwid/wid;
                                }
                                else
                                {
                                    img.css({width: "auto",
                                            height: phigh});
                                    scale = phigh/high;
                                }
                            
                                wid   = wid*scale;
                                high  = high*scale;
                                //c onsole.log("nj1002:"+[wid,high]);
                                $(this).css({   left: ((pwid - wid)/2 ),
                                                top:  ((phigh - high) / 2)
                                            });
                                //$(this).width($(this).parent().width()-20);
                                //$(this).height($(this).parent().height()-20);
                            }
                        });
                    $(this).fadeIn(n9_fadeIn_duration);
                }
                else
                {
                        if ($(this).is(":visible"))
                        {
                            //c onsole.log("nj922")
                            //c onsole.log(this);
                            //c onsole.log("nj920:"+target.style+ $(this).hasClass("wide"));
                            $(this).fadeOut(n9_fadeOut_duration);
                            //console.log(this);
                        }
                }
            }
        );   
    }
    
    this.getNeighborName = function (targname, direction){
        ////c onsole.log("targname="+targname+" direction="+direction);
        var numstr = targname.slice(targname.length-1);
        var addr = this.parseNovemName(targname);
        ////c onsole.log("n741:addr.length="+addr.length);
        if (addr.length>2)
        {
            // then it's a subnovem and has no neighbors currently, not even siblings @@TODO
            return null;
        }
        else
        {
            numstr = addr[1];
        }
        ////c onsole.log("numstr="+numstr);
        novnum = parseInt(numstr);
        nbornum = -1;
        ////c onsole.log("novnum="+novnum);
        switch(direction)
        {
            case "north":
                nbornum = novnum - 3;
                if (nbornum < 0) { nbornum= null;}
                break;
            case "south":
                nbornum = novnum + 3;
                if (nbornum >8) { nbornum = null;}
                break;
            case "east":
                if (novnum % 3 != 2) { nbornum = novnum + 1; }
                 else {nbornum = null}
                break;
            case "west":
                if (novnum % 3 != 0) { nbornum = novnum - 1; }
                 else {nbornum = null}
                break;
        }
        if (nbornum != null)
        {
            neighbor = "novem_"+nbornum;
        }
        else
        {
            neighbor = null;
        }
        ////c onsole.log("SELF["+targname+"]--"+direction+"-->" + neighbor);
        return neighbor
    }
    
    this.getPod = function(podname, target) {
        //console.//log(podname);
        if (podname in this.podDict)
        {
            pod = this.podDict[podname];
            pod.getState();
            return pod;
        }
        
        this.gpi += 1;
        ////c onsole.log("n793:gpi="+this.gpi);
        
        if (podname)
        {
            poddom = $("#"+podname).slice(0,1);
            if (poddom)
            {
                this.podDict[podname] = new Pod(poddom, target);
                return this.podDict[podname];
            }
            else {return null;}
        }
        else
        { return null;}
    }
    this.getTarget  = function (targname) {
    ////c onsole.log("n800: targname is "+targname);
        if (targname in this.targDict)
        {
            targ = this.targDict[targname];
            targ.getState();
            return targ;
        }
        //this.gti += 1;
        ////c onsole.log("n793:gti="+this.gti);
        if (targname)
        {
            target = $("#"+targname).slice(0,1);

            if (target)
            {
                this.targDict[targname] = new Target(target);
                return this.targDict[targname];
            }
        }
        else
        {
            return null;
        }
    }
    
    this.borderLock = function (setsize){
        var pod;
        
        nvms = $(".novem");
        //log("n447:"+nvms.length);
        
        _njn.fixPodsInPlace();
        if (false) //for (i = 0; i < nvms.length; i++)
        {
            novum = nvms[i];
            
            pod = _njn.getPod($(novum).attr("pod"));
            if (pod) {  // log("n455:"+pod.id+"[setsize="+setsize);
                        //pod.borderLock(setsize);//
                        _njn.fixPod(pod.jq(), $("#"+pod.targetid),true);
                     }
        }
    }
    
    this.validateNovem = function ()
    {
        // check for validity
        var pods = $(".pod");
        //c onsole.log("getState:"+pods.length);
        var ndict = {};
        pods.each(function ()
            {
                // //c onsole.log("nj584:"+$(this).attr("id")+"{}"+$(this).attr("novem"));
                var novem = $(this).attr("novem");
                if (novem != undefined)
                {
                    if (ndict[novem] == undefined)
                    {
                        ndict[novem] = $(this);
                    }
                    else
                    {
                        var pod2 = "pod("+$(this).attr("id")+")";
                        var pod1 = "pod("+ndict[novem].attr("id")+")";
                        
                        console.log("POD CONFLICT! \n"+pod1+"\n"+pod2+"\n[[[[[[ in "+novem);
                    }
                }
                novjq = $("#"+novem);
                novpi = novjq.attr("pod");
                pname = $(this).attr("id");
                if (novpi != undefined && novpi != pname)
                {
                    console.log("PARTNERSHIP BREACH! "+pname+"'s novem, " + novem + " claims to host different pod, "+novpi);
                }
            });
    }
    
    this.findHome = function(podjq)
    {
      var candidate = podjq.attr("last_novem");
      
        if (candidate)
        {
            //c onsole.log("nj1087: "+podjq.attr("id")+" in "+candidate);
            var occupied = $("#"+candidate).attr("pod");
            if (occupied)
            {
                candidate = null;
            }
        }
        
        if (! candidate)
        {
            var home = podjq.attr("novem_home");
            //c onsole.log("nj1098: novem_name = "+home);
            var candelem = this.findFreeNovem(home);
            if (candelem)
            {
                candidate = $(candelem).attr("id");
            }
        }
        if (! candidate)
        {
            var candelem = this.findFreeNovem("novem_.*");
            if (candelem)
            {
                candidate = $(candelem).attr("id");
            }
        }
        return candidate;
    }
    
    this.getNovemDict = function()
    {
        var i=0;
        var nd = {};
        if (! this.novem)
        {
            this.getState();
        }
        for (i = 0; i < this.novem.length; i++)
        {
            var onedict = {}
            onedict[this.novem[i].id] = this.novem[i].getNovemDict();
            //c onsole.log("jn1198:-\n-\n- onedict = \n-\n-\n"+JSON.stringify(onedict)+"-\n-\n");
            nd = mergeDicts(nd, onedict);
        }
        
        if (typeof(n9_grid_list) != "undefined")
        {
            nd.grid_list = n9_grid_list();
        }
        if (typeof(n9_properties) != "undefined")
        {
            nd.properties = n9_properties();
        }
        //c onsole.log("nj1200:\n\n\n\n\n"+ JSON.stringify(nd));
        return nd;
    }
    
    this.sendHome = function(podjq)
    {
       candidate = this.findHome(podjq);
        if (candidate)
        {
            _njn.fixPod(podjq, $("#"+candidate));
            
        }
        else
        {
            alert("pod can't return, no space");
        }
        //this.checkNovem();
    }
    this.setRssSink = function(pod_id, func) {
        //c onsole.log("n591:"+pod_id);
        this.rssSinks[pod_id] = func;
    }
    
    this.sinkRssItem = function(pod_id, item, frompod) {
        this.rssSinks[pod_id](item, frompod);
    }
    
    this.startSinkTimer = function(stimer)
    {
        func = stimer["consumeItem"];
        this.sinktimers[stimer["pod_id"]] = setInterval( func, stimer.duration);
    }
    
    this.triggerSinkTimer = function (podid)
    {
        //clearInterval(this.sinktimers[podid]);
        //this.sinktimers[podid] = 0;
        if (podid in this.rssSinks)
         {
            //c onsole.log("n608: found "+podid);
            var func = this.rssSinks[podid];
            //c onsole.log("n612:"+JSON.stringify(this.rssSinks));
            if (func){
            
                 func();
            }
        }
    }
    
    // -------
    this.novid2num = function(novname) {
        //num = parseInt(novname.substring(novname.length-1));
        address = this.novemParse(novname);
        if (address)
        {
            num = address[0];
            return num;
        }
        else
        {
            return null;
        }
    }
    this.num2novid = function(num) {
        return "novem_"+num; 
    }
    this.novemParse = function(novname) {
    // c onsole.log("novname="+novname);
        var reNovem = /(novem_)([0-9])(_)?([0-9]?[0-9]?)/g;
        var taddress = [];
        var preaddress = reNovem.exec(novname);
        //c onsole.log("preaddress="+JSON.stringify(preaddress));
        if (preaddress!=null)
        {
            num1 = preaddress[2];
            num2 = preaddress[4];
            if (num1.length>0) { taddress.push(parseInt(num1));}
            if (num2.length>0) { taddress.push(parseInt(num2));}
            //c onsole.log(JSON.stringify(taddress));
            return taddress
        }
        {
            return null;
            }
    }
    
    this._user_name = null;
    this.setUserName = function(name)
    {
        console.log("nj1342: setUserName "+name);
        if (name == "null")
        {
            name = null;
            
        }
        this._user_name = name;
        this.executeCallback ("set_username", {"username":name});
    }
    
    this.userName = function()
    {
        return this._user_name;
    }
    
    // talk with the server
    this.getUserName = this.userName;
    
    
    // REGEXP novem hunting 
    
    this.findNovem = function (regex)
    {
        if (!regex)
        {
            return null;
        }
        
        var retary = [];
        re = RegExp(regex, "g");
        var novems = $(".novem");
        
        var novelem = null;
        var novum = null;
        for (var i = 0 ; i < novems.length; i++)
            {
                novum = $(novems[i]);
                if ( novum.attr("id").match(re) )
                {
                    retary[retary.length]=novum;
                }
            }
        return retary;
    }
    
    this.clearNovem = function (regex, selector)
    {
        var podname = null;
        var nlist = this.findNovem(regex);
        var is_selector = false;
        for (var i =0; i < nlist.length; i++)
        {
            podname = nlist[i].attr("pod");
            is_selector = $("#"+podname).is(selector);
            if (podname && is_selector)
            {
                _njn.removePod(podname);
            }
        }
    }
    this.detachPod = function (pod_id)
    {
    //c onsole.log("nj1421: removePod "+pod_id);
        podjq = this.findDiv(pod_id);
        var novem = podjq.attr("novem");
        $("#"+novem).attr("pod", null);
        podjq.attr("novem", null);           
    }
    this.findDiv = function (divval)
    {
        var podjq;
        console.log("n1545:"+divval);
        if (typeof (divval) == "string")
        {
            elements = divval.split("}")
            if (elements.length == 1)
            {
                podjq = $(divval);
            }
            else
            {
                console.log("elements = "+JSON.stringify(elements));
                podjq = $("[n9_name='"+elements[1]+"']");
            }
            
        }
        else
        {
            podjq = $(divval);
        }
        if (podjq.length == 0)
        { console.log("nj460: no pod found"); return null; }
            return podjq;
    }
    
    this.removePod = function (pod_id)
            {
                this.detachPod(pod_id)
                var podjq = $("#"+pod_id);
                podjq.css({"z-index":150,
                    });
                podjq.fadeOut(500, function () {
                                        //c onsole.log("hello?");
                                        podjq.remove();
                                    });
            }
            
    this.swapPods = function (podA, podB)
    {
        var poda = this.findDiv(podA);
        var podb = this.findDiv(podB);
        console.log(poda);
        console.log(podb);
        
        var nova = poda.attr("novem");
        var novb = podb.attr("novem");
        this.detachPod(poda);
        this.detachPod(podb);
        this.fixPod(poda, novb);
        this.fixPod(podb, nova);
    }
    
    this.findFreeNovem = function (regex)
    {
        var novelem = null;
        var novum = null;
        if (!regex)
        {
            novelem = this.findFreeNovem("novem_5.*");
            if (novelem == null)
            {
                novelem = this.findFreeNovem("novem_3.*");
                if (novelem == null)
                {
                    novelem = this.findFreeNovem("novem_.*");
                }
            }
            return novelem;
        }
        re = RegExp(regex, "g");
        //c onsole.log("nj1341: free novem regex is "+regex);
        var novems = $(".novem");
        
        for (var i = 0 ; i < novems.length; i++)
            {
                novum = $(novems[i]);
                if ( novum.attr("id").match(re) )
                {
                    //c onsole.log("nj1466:"+novum.attr("pod"));
                    if (!novum.attr("sub_divided") && !novum.attr("pod"))
                    {
                        //c onsole.log("nj1032:"+$(this).attr("id"));
                        novelem = novum.get(0);
                        break;
                    }
                }
            }
        //c onsole.log("nj1352:"+$(novelem).attr("id"));
        return novelem;
    }
    
    taken_ids = [];
    this.findNextPodID = function( pfile)
    {
        var i = 0;
        
        
        while (     $("#"+pfile+i.toString()).length >0
                ||  taken_ids.indexOf(pfile+i.toString()) >= 0
              )
        {
            i++;
        }
        console.log("nj1573: next id "+pfile+i);
        taken_ids[taken_ids.length] = pfile+i;
        return pfile+i
    }
    
    this.loadServerPod =  function( name, 
                                    pod_data, 
                                    targetid,
                                    from_pod,
                                    callback)
    {
        
        if (typeof(pod_data) == "undefined" || pod_data==null)
        {
            var pod_data = {};
        }
        var nparts = name.split(":");
        var pname = nparts[0];
        var pid = this.findNextPodID(pname);
        console.log("nj1699:"+pid);
        pod_data["pod_name"]=name;
        pod_data["pod_id"]=pid;
    
        var fnov;
        if (targetid)
        {
            fnov = _njn.findFreeNovem(targetid);
        }
        if (!fnov)
        {
            fnov = _njn.findFreeNovem("novem_.*");
        }
        if (fnov)
        {
            function standardLoadPodCallback(data, tS, jqXHR)
                        {
                            if (!data)
                            {
                                alert("cannot load that pod");
                                return;
                            }
                            var content = data["content"];
                            var script = data["script"];
                            var newpod = $(content);
                            var sc = newpod.find(".pod_data_div");
                            if (sc.length>0)
                            {
                                console.log("NP1111111: "+sc.text());
                            }
                            var newpodid = newpod.attr("id");
                            var check = $("#"+newpodid);
                            // alert("leng "+check.length);
                            if (check.length>0)
                            {
                                   var newid = newpodid.replace(/(.*?)[0-9]{1,}$/g,"$1");
                                   var i = 1;
                                   while ( $("#"+newid+i).length>0)
                                   {
                                        i++;
                                   }
                                   newpod.attr("id",newid+i);
                                   // also replace in every other location
                                   content.replace(newpod, newid);
                            }
                            $("#n9_pod_set").append(newpod);
                            newpod.each(make_draggable);
                            
                            //console.log("SCRIPT:"+script);
                            //eval(script);
                            var novhome = newpod.attr("novem_home");
                            //c onsole.log("nj1066: novem_home "+ novhome);
                            var novem = _njn.findFreeNovem(targetid);
                            //c onsole.log("nj1066: novem_home "+ novhome+ " " +novem);
                            
                            if (!novem)
                            {
                                novem = _njn.findFreeNovem(novhome);
                            }
                            if (!novem)
                            {
                                console.log("nj1404: no novem_home");
                                novem = _njn.findFreeNovem("novem_5_.*");
                                if (!novem)
                                {
                                    console.log("nj1408: no article bar novem");
                                    novem = _njn.findFreeNovem("novem_[0,1,2,4,6,7]");
                                }
                            }
                            if (novem)
                            {
                                var sp;
                                if (!from_pod)
                                {
                                    sp = $("#login0");
                                }
                                else
                                {
                                    sp = $("#"+from_pod);
                                }
                                
                                //c onsole.log("nj1349:"+sp+":::"+sp.length);
                                if (sp.length)
                                {
                                    pos = sp.position();
                                    //c onsole.log("nj1353:"+JSON.stringify(pos));
                                    newpod.css({"top":pos.top,
                                                "left":pos.left,
                                                });
                                    newpod.width(sp.width());
                                    newpod.height(sp.height());
                                }
                                //c onsole.log("nj1634:"+$(novem).attr("id"));
                                _njn.fixPod(newpod, $(novem));
                                script_func = eval(script);
                                //alert(script_func);
                                //window[
                            }
                            else
                            {
                                alert("No Free Novem, clear something from "+targetid+".");
                                newpod.remove()
                            }
                        }
            console.log("njs1574:"+JSON.stringify(pod_data));
            if (!callback)
            {
                callback = standardLoadPodCallback;
            }
            $.ajax({type: "post",
                    url: "/pods/pod_load?style=split_script",
                    data: pod_data,
                    dataType: "json",
                    success: callback,
                    });
        }
        else
        {
            alert("No space available in "+targetid+".");
        }
    }
    this.reloadPod = function (podname) {
        //c onsole.log("nj1212:"+JSON.stringify(this.podDict));
        if (this.podDict.hasOwnProperty(podname))
        {
            //c onsole.log("nj998: exists");
            this.podDict[podname].reload();
        }
    }
    
    // POD INTERACTIONS
    // POD INTERACTIONS
    // POD INTERACTIONS
    // POD INTERACTIONS
    
    this.getPodDict = function (podid)
    {
        this.getState();
        var pod = this.getPod(podid);
        if (!pod) {return null;}
        var pd = pod.getPodDict();
        return pd;
        
    }
    
    this.podDrop= function(event, ui)
    {
        _njn.fixPod(ui.draggable, $(this));
    }
    
    
    // CALLBACKS
    // CALLBACKS
    // CALLBACKS
    // CALLBACKS
    
    this.callbacks = {};
    this.register = function (event_name, func_point, just_for)
    {
        if (just_for == undefined)
        {
            just_for = null;
        }
        if (!(event_name in this.callbacks))
        {
            this.callbacks[event_name] = [];
        }
        clist = this.callbacks[event_name];
        clist[clist.length] = { func_ptr:func_point,
                                just_for: just_for
                                };
    }
    
    this.executeCallback = function (event_name, args, just_for)
    {
        var retlist = [];
        var retval = null;
        if (just_for == undefined)
        {
            just_for = null;
        }
        //c/onsole.log("nj1553, xcall:"+event_name)
        //c/onsole.log(args);
        if (event_name in this.callbacks)
        {
            var eventlist = this.callbacks[event_name];
            for (var i =0; i < eventlist.length; i++)
            {
                //c onsole.log("nj1391: fire event "+i)
                if ( (!just_for) || ( just_for && eventlist[i]["just_for"] == just_for) )
                {
                    setTimeout(
                        eventlist[i]["func_ptr"],
                        10,
                        $.extend(true, {}, args));
                }
                //retlist[retlist.length] = retval;
            }
        }
        return ;
        //c onsole.log("nj1401:cxover")
    }
    this.execute = this.executeCallback;
    this.executeInline = function (event_name, args, just_for)
    {
        var retlist = [];
        var retval = null;
        if (just_for == undefined)
        {
            just_for = null;
        }
        //c/onsole.log("nj1553, xcall:"+event_name)
        //c/onsole.log(args);
        if (event_name in this.callbacks)
        {
            var eventlist = this.callbacks[event_name];
            for (var i =0; i < eventlist.length; i++)
            {
                //c onsole.log("nj1391: fire event "+i)
                if ( (!just_for) || ( just_for && eventlist[i]["just_for"] == just_for) )
                {
                    retval = eventlist[i]["func_ptr"](args);
                }
                retlist[retlist.length] = retval;
            }
        }
        return retlist;
        //c onsole.log("nj1401:cxover")
    }
    this.inline = this.executeInline;
    // LAYOUT RELATED
    // LAYOUT RELATED
    // LAYOUT RELATED
    // LAYOUT RELATED

    this.saveNovemLayout = function () {
        var name = _njn.getNovemLayout();
        name = prompt("Page Layout Name",name);
        if (name == null)
        {
            console.log("Novem Layout Save Cancelled");
        }
        else
        {
        name = $.trim(name);
        }
        if (name.length == 0)
        {
            alert("Bad Layout Name");
            return;
        }
        console.log("nj1795: save novem layout:"+name);
        var novemDict = _njn.getNovemDict();
        console.log(novemDict);
        var ndjson = JSON.stringify(novemDict, undefined, 2);
        
        //c onsole.log("cp173:"+ndjson);
         $.ajax({type:"POST",
                url: "/n9/save_novemset",
                dataType:"json",
                data: { "cmd":"save_novem_layout",
                        "novem_layout_name": name,
                        "novem_dict": ndjson
                       },
                success: function (data)
                {
                    n9overlaySuccess({msg:"saved..."})
                },
                error: function (data)
                {
                    var answer = JSON.parse(data.responseText);
                    console.log("couldn't save", answer);
                    n9overlayError(answer)
                }
                });
    }

    // initialization that requires other members or check the dom
    
    /*
    $("body").ready( function ()
    {
        var un = $("#user_name");
        if (un.length)
        {
            var val = un.val();
            // c onsole.log("nj1180:"+val);
        
            if (val.length > 0) 
            {
                _njn.setUserName(un.val());
            }
            else
            {
                _njn.setUserName(null);
            }
        }
        //c onsole.log("nj1190:"+_njn.userName());
    });
    */
    ////////
    // COMMUNICATIONS BETWEEN CONTENT/EXTENSION
    this.send =  function (message, options)
    {
    	
    	var complete = null;
    	console.log("n1972: send",message, options);
    	if (options && options.complete) 
    	{
    		complete = options.complete;
    	}
    	else
    	{
    		complete = function (any){ console.log("nj1979: send complete", any)}
    	}
    	chrome.runtime.sendMessage( message, complete);
    },
    this.listen = function (options)
    {
    	var callback = options.callback;
    	if (callback)
    	{
    		console.log("n1988: _njn.listen ", options);
    		chrome.runtime.onMessage.addListener(callback);
    	}
    }
}

function Target(target) {
    this.id = target.attr("id");
    this.style = null;
    this.aspect = null;
    this.podid = null;
    this.width = null;
    this.height = null;
    this.pod = null;
    this.podid = null; // string id of pod
    this.left = null;
    this.top = null;
    this.subnovem = false;
    this.subdivided = false;
    
    this.getState = function (target){
        if (typeof(target) == "undefined")
        {
            target = $("#"+this.id);
            }
        position  = target.offset();
        if (position == null || typeof(position) == "undefined")
        {
            this.left = 0;
            this.top  = 0;
        }
        else
        {
            this.left = position.left;
            this.top = position.top;
        }
        this.id = target.attr("id");
        this.podid = target.attr("pod");
        
        this.width  = tw = $(target).width();
        this.height = th = $(target).height();
        
        var sn = $(target).attr("subnovem") || $(target).hasClass("subnovem");
        //c onsole.log("nj1452:"+this.id+" [[ "+sn + "(("+typeof(sn));
        if (sn && ((sn == true) || (sn == "true")))
        {
            this.subnovem = true;
        }
        else
        {
            this.subnovem = false;
        }
        
        var subdivd = $(target).attr("sub_divided");
        if (subdivd)
        {
            this.subdivided = subdivd;
        }
        else
        {
            this.subdivided = false;
        }
        
        if (tw > th)
        {
            target_type = "wide";
            tid = $(target).attr("id");
            if (tid == "novem_1")
            {
                aspect = "top";
            }
            else
            {
                aspect = "bottom";
            }
        }
        else
        {
            tid = $(target).attr("id");
            if (tid == "novem_5")
            {
                aspect = "right";
            }
            else
            {
                aspect = "left";
            }
            target_type = "tall";
        }
        pixarea = tw * th
        aspect_ratio = tw/th
        if (pixarea < 12000)
        {
            target_type = "thumb";      
        }
        //c onsole.log("n333:"+this.id+"|"+pixarea+"|"+aspect_ratio);
        if (   (pixarea > 250000 && aspect_ratio > .75  && aspect_ratio < 1.85)
            || (pixarea > 400000 && aspect_ratio >.75   && aspect_ratio < 3)
           )
        {
            target_type = "body";
        }
        if (aspect_ratio < .31)
        {
            target_type = "tall";
        }
        tid = $(target).attr("id");
        // console.log("nj1891:"+tid);
        if (tid=="novem_4") {target_type="body";}
        this.style = target_type;
        this.aspect = aspect;
        this.aspect_ratio = aspect_ratio;
    }    
    
    this.getNeighbor = function(direction){
        name = _njn.getNeighborName(this.jq().attr("id"), direction);
        //log("n516: "+direction+" of "+ this.id);
        if (name)
        {
            //log("n518:"+name);
            ntarg = _njn.getTarget(name);
        }
        else
        { ntarg = null; 
            //log("n519:"+name);
        }
        return ntarg;
    }
    
    this.getPod = function(direction) {
        var target, podname, pod;
        //log("n531: direction in getPod = "+direction);
        if (typeof(direction)!= "undefined")
        {
            target = this.getNeighbor(direction);
        }
        else
        {
            target = this;
        }
        if (target)
        {
            podname = target.podid;
            pod = _njn.getPod(podname, this);
            this.pod = pod;
            return pod;
        }
        else
        {return null;}
    }
    
    this.jq = function() {
        return $("#"+this.id);
    }
    
    
    this.storePodid = function() 
    {
        //c onsole.log("nj1438: storing podinfo..."+this.podid+"[]"+this.id);
        $("#"+this.id).attr("pod", this.podid);
        $("#"+this.podid).attr("novem", this.id);
    }
    
    this.takePod = function(pod)
    {
        var eviction = false;
        if (this.pod && pod && (pod.id != this.pod.id))
        {
            eviction = this.pod;
        }
        this.pod = pod;
        if (! pod)
        {
            this.podid = null;
        }
        else
        {
            this.podid = pod.id;
            this.pod.acceptTarget(this.id);
        }
        return eviction;
    }
    
    this.loadPod = function ()
    {
        this.pod = new Pod($("#"+this.podid));
        this.podid = this.pod.id;
    }
    
    this.report = function()
    {   
        retd = {type:"target report", target:this.id, pod:this.podid};
        return JSON.stringify(retd);
    }
    
    this.getNovemDict = function ()
    {
        this.getState();
        var td = {"name":this.id}
        //var subd = this.jq().attr("sub_divided");
        subd = this.subdivided;
        if (subd)
        {
            td.sub_divided = subd;
        }
        if (this.podid)
        {
            var pod = _njn.getPod(this.podid);
            var pd = pod.getPodDict();
            //c onsole.log("\n\n\n\n\n\n\n\n\nin get Novem Dict\n"+this.id+"\n"+this.subnovem+"\n\n\n\n\n\n\n\n\n\n\n\n");
            
            
            td.pod = pd;
        }
        if (this.subnovem)
            {
                td.subnovem = true;
            }
        if (this.subdivided)
            {
                td.sub_divide = this.subdivided;
            
            }
        //c onsole.log("nj1610 td :"+JSON.stringify(td));
        return td;
    }
    // init
    this.getState(target);
}

function Pod(pod_jq, target) {
    
    this.id = pod_jq.attr("id");
    this.width = null;
    this.height = null;
    this.border_left = null;
    this.border_right = null;
    this.border_top = null;
    this.border_bottom = null;
    this.targetid = null;
    if (typeof(target) == "undefined")
    {
        this.target = null;
    }
    else
    {
        this.target = target
    }
    
    this.animate = function (props, options) {
        $("#"+this.id).animate(props, options);
    }
    this.css = function (props, options) {
        $("#"+this.id).css(props, options);
    }
    this.clone = function (){
        tc = jQuery.extend({}, this);
        return tc;
    }
    this.getState = function (pod_jq) {
        if (typeof(pod_jq) == "undefined")
        {
            pod_jq = $("#"+this.id);
        }
        position  = pod_jq.position();
        if (position)
        {
            this.left = position.left;
            this.top = position.top;
        }
        else
        {
            this.left = 0;
            this.top = 0
        }
        ew = pod_jq.outerWidth() - pod_jq.width();
        eh =  pod_jq.outerHeight()  - pod_jq.height();
        ////log("outer:"+pod_jq.outerWidth()+":"+pod_jq.width());
        ////log(pod_jq.prop("border-left") );
        ////log(pod_jq.attr("border-right"));
        ////log(pod_jq.attr("border-top") );
        ////log(pod_jq.attr("border-bottom"));
        this.extra_w = ew;
        this.extra_h = eh;
        this.border_left   = parseInt(pod_jq.attr("border-left"),   10);
        this.border_right  = parseInt(pod_jq.attr("border-right"),  10);
        this.border_top    = parseInt(pod_jq.attr("border-top"),    10);
        this.border_bottom = parseInt(pod_jq.attr("border-bottom"), 10);
        //log("n636:"+"|border_left"+this.border_left+"|border-right="+this.border_right);
        //log("n637:"+"|border_top"+this.border_top+"|border-bottom="+this.border_bottom);
        this.targetid = pod_jq.attr("novem");
    }    
    this.fadeAlterdivs = function (target) {
        // will fade to match target
        // assumes target is novem object
        _njn.fadeAlterdivs(this, target);
    }
    
    this.getNovemName = function (){
            var novem = this.jq().attr("novem");
            if (typeof(novem) == "undefined")
            {
                novem = null;
            }
            return novem;
        }
    this.getTargetSize = function () {
        var novemname = this.getNovemName();
        if (novemname)
        {
            var target =  _njn.getTarget(novemname).jq();
            var wide = target.width();
            var high = target.height();
            return { width: wide,
                     height: high
                   }
        }
        else
        {
            return null;
        }
    }
    this.borderLock = function (setsize) {
        //c onsole.log("nj2158:"+  n9_lock_all);
        if (typeof(setsize) == "undefined")
        {
            setsize = false;
        }
        
        if (this.jq().hasClass("borderlock"))
        {
            var mytarget = _njn.getTarget(this.jq().attr("novem"));
            //log("border locking:"+this.jq().attr("id"));
            
            var north_pod = mytarget.getPod("north");
            var south_pod = mytarget.getPod("south");
            var west_pod  = mytarget.getPod("west");
            var east_pod  = mytarget.getPod("east");
//             if (north_pod) { log("north+pod = "+north_pod.id);}
//             if (south_pod) { log("south+pod = "+south_pod.id);}
//             if ( west_pod) { log(" west+pod = "+west_pod.id);}
//             if ( east_pod) { log(" east+pod = "+east_pod.id);}
            var targname = mytarget.jq().attr("id");
            var dh= 0;
            var dw = 0;
            var left = right = bottom = ttop = 0;
            var jq = this.jq();
            var mylocktype = jq.attr("lockType");
            var mylockto = jq.attr("lockTo");
    
            nlock = slock = elock = wlock = false;
            if (!n9_lock_all && (!north_pod || !north_pod.jq().hasClass("borderlock") || (north_pod.jq().attr("lockType") != mylockto) ) 
               )             {   
                                ttop   = "solid black 1px"; 
                                dh += 1;
                                jq.attr("northLock", null);  
                            } 
                            else 
                            {   
                                nlock = true;
                                ttop   = "none"; 
                                if (north_pod)
                                {
                                    jq.attr("northLock", north_pod.id); 
                                }
                            }
            if (!n9_lock_all && (!south_pod || !south_pod.jq().hasClass("borderlock") || (south_pod.jq().attr("lockType") != mylockto)) 
                )            {   
                                bottom = "solid black 1px"; 
                                dh += 1;
                                jq.attr("southLock", null); 
                            } 
                            else 
                            {   
                                slock = true;
                                bottom = "none";
                                if (south_pod)
                                {
                                    jq.attr("southLock", south_pod.id); 
                                }
                            }
            if (!n9_lock_all && (!east_pod || !east_pod.jq().hasClass("borderlock") || (east_pod.jq().attr("lockType") != mylockto)) 
                )            {   right  = "solid black 1px"; 
                                dw += 1;
                                jq.attr("eastLock", null);
                            } 
                            else 
                            {   
                                elock = true;
                                right  = "none";
                                if (east_pod)
                                {
                                    jq.attr("eastLock", east_pod.id);
                                }
                            }
            if (!n9_lock_all && (!west_pod || !west_pod.jq().hasClass("borderlock") || (west_pod.jq().attr("lockType") != mylockto))  
                )            {   left = "solid black 1px"; 
                                dw += 1;
                                jq.attr("westLock", null);
                            } 
                            else 
                            { 
                                wlock = true;
                                left = "none";
                                if (west_pod)
                                {
                                    jq.attr("westLock", west_pod.id);
                                }
                            }
            
            btlr = btrr = bbrr = bblr = "0px";
            //if (gup("jobs")=="true")
            {
                curve = "10px"
                
                if (!nlock && ! wlock)
                {
                    btlr = curve;
                }
                if (!nlock && ! elock)
                {
                    btrr = curve;
                }
                if (!slock && ! wlock)
                {
                    bblr = curve;
                }
                if (!slock && ! elock)
                {
                    bbrr = curve;
                }
                jq.css(
                    {   
                        "border-top-left-radius"    :btlr,
                        "border-top-right-radius"   :btrr,
                        "border-bottom-left-radius" :bblr,
                        "border-bottom-right-radius":bbrr,
                        
                        
                        
                        "-moz-border-radius-topleft"    :btlr,
                        "-moz-border-radius-topright"   :btrr,
                        "-moz-border-radius-bottomleft" :bblr,
                        "-moz-border-radius-bottomright":bbrr,
                    });
            }            
            
            jq.css({        "border-top": ttop,
                            "border-bottom": bottom,
                            "border-left": left,
                            "border-right": right,
                        });
//             log("n688:" + "   border-top="+ ttop
//                         + "   border-bottom="+ bottom
//                         + "   border-left="+ left
//                         + "   border-right=" + right 
//                         );
//             log("bl  width="+mytarget.jq().width()+" | dw="+dw);
//             log("bl height="+mytarget.jq().height()+" | dh="+dh);
            if(false) //(setsize)
            {
                //log("setsize:"+this.jq().attr("id"));
                this.jq().width(mytarget.jq().width()-dw);
                this.jq().height(mytarget.jq().height()-dh);
            }
            this.extra_w = dw;
            this.extra_h = dh;
        }
        // _njn.triggerSinkEvent(this.id);
    }
    
    
    
    this.westlock = function()
    {
        return this.jq().attr("westLock");
    }
    
    this.jq = function()
    {
        return $("#"+this.id);
    }
    
    this.requestItems = function(options)
    {
        wlock = this.westlock();
        if (wlock)
        {
            fpu = $("#"+wlock).data("fpu");
            if (fpu)
            {
                items = fpu.getItems({cmd:"locations"});
                //c onsole.log("n1005:"+ JSON.stringify(items));
            }
        }
    }
    
    this.reload = function () 
    {
        this.getState();
        pod_name = this.id;
        
        try
        {
            pod_data = eval(this.id+"_pod_data()");
            //c onsole.log("nj1495:"+JSON.stringify(pod_data));
        }
        catch (err)
        {
            //c onsole.log("nj1498:couldn't get pod_data");
            pod_data = {pod_id:this.id,pod_name: this.id.replace(/(.*?)[0-9]{1,}$/g,"$1")};
        }
        //c onsole.log("nj1600:"+JSON.stringify(pod_data));
        if (pod_data == null)
        {
            pod_data = {pod_id:this.id,pod_name: this.id.replace(/(.*?)[0-9]{1,}$/g,"$1")};
        }
        
        pod_data["cmd"] = "pod_reload";
        pod_data["pod_id"] = this.id;
        
        
        //alert("nj1395:"+ JSON.stringify(pod_data));
        var rmsg = "reload...";
        if(pod_data["reload_message"])
        {
            rmsg = pod_data["reload_message"];
        }
        this.jq().html(rmsg);
        $.ajax({type: "post",
                url: "/pods/pod_reload?style=split_script",
                data: pod_data,
                success: function(data, tS, jqXHR)
                    {
                        console.log("NV2113:"+data);
                        //data = JSON.parse(data);
                        var i = 0;
                        //c onsole.log("nj1403:");
                        
                        var jq = $("#"+pod_name);
                        var novid = jq.attr("novem");
                        _njn.getTarget(novid).takePod();
                        var  podel = $("#"+pod_name);
                        podel.replaceWith(data.content);
                        //eval(data.script);
                        var newpod = $("#"+pod_name);
                        var bh =  $("#"+novid);
                        if (bh.length>0)
                        {
                            pos = bh.position();
                            newpod.css( {
                                        top: pos.top,
                                        left: pos.left,
                                        });
                            newpod.width(10);
                            newpod.height(10);
                        }
                        newpod.each(make_draggable);
                        $("#"+novid).attr("pod", null);
                        _njn.fixPod(newpod, $("#"+novid));
                        
                    },
                });
    }
    
    this.report = function()
    {
        retd = {type:"pod report",  pod:this.id, target:this.targetid};
        return JSON.stringify(retd);
    }
    
    this.acceptTarget = function(target)
    {
        this.target = target;
        if (!target)
        {
            this.targetid = null;
        }
        else
        {
            this.targetid = target.id;
        }
        //this.jq().attr("novem", this.targetid);
    }
    this.getPodDict = function()
    {
        var nm = this.id + "_pod_data";
        var haspdfunc = window.hasOwnProperty(nm);
        if (haspdfunc)
        {
            var td = eval(nm+"()");
        }
        else
        {
            var td = {pod_id:this.id, pod_name: this.id.replace(/(.*?)[0-9]{1,}$/g,"$1")};
        }
        return td;
    }
    this.getState(pod_jq);
}

function mergeDicts(da, db)
{
    for (var atnam in db) {da[atnam] = db[atnam]};
    return da;
}

function safeJSONparse(invalue)
{   // this function makes sure a value is returns, catches failed parsing
    // which is likely due to an unreplaced format specifier in the pod def
    var retval = null ;
    try
    {
        retval = JSON.parse(invalue);
    }
    catch (err)
    {
        retval = null;
    }
    return retval;
}

function getType(v){
 var result = typeof(v);
 if (result == "object"){
  result = "@unknown";
  if(v.constructor){
   var sConstructor = v.constructor.toString();
   var iStartIdx = sConstructor.indexOf(' ' ) + 1;
   var iLength = sConstructor.indexOf('(' ) - iStartIdx;
  
   var sFuncName = sConstructor.substr(iStartIdx, iLength);
   if (iStartIdx && sFuncName) result = sFuncName;
  }
 }
 return result.toLowerCase();
}


// helpful

function n9escapeID( myid ) 
{
    if (!myid) {return myid}
    var escpd =  "cid"+myid.replace( /(-|:|\.|\[|\])/g, "_" ); 
    escpd = escpd.replace( /\//g, "_");
    //c/onsole.log(escpd);
    return escpd;
}

function n9sortChildrenByTimeOldFirst (parentEL)
{
    var sortdivs = parentEL.children();
    sortdivs.sort(n9divByTimestampCmpOldFirst);
    parentEL.empty().append(sortdivs);
}

function n9overlaySuccess(args)
{
    args.text_color = "green";
    n9overlay(args);
    
}
function n9overlayError(args)
{
    args.text_color = "red";
    n9overlay(args);
}

function n9overlay(args)
{
    /*
        args property:
            duration_in     - time to slide in
            duration_mid    - time to fade color
            duration_out    - time to slide out
            text_color: text color
            msg: the message
    */
    if ("text_color" in args)
    {
        tcolor = args.text_color;
    }
    else
    {
        tcolor = "blue";
    }
    
    console.log("nov2607:", args);
    var errorel = $("<div>",
                    {   css:
                            {   fontSize : 35,
                                color : tcolor,
                                backgroundColor: "rgba(60,60,60,.9)",
                                position: "absolute",
                                zIndex: 1000,
                                top:0, left:0,
                                padding:"2em"
                            },
                        class: "n9_overlay n9_error_msg"
                    }).hide();
    if ("code" in args)
    {
        errorel.append ( $("<div>", { text: "Error Code: "+args.code}));
    }
    if ("msg" in args)
    {
        errorel.append ( $("<div>", { html: args.msg }) );
    }
    $(".novem_all").append(errorel);
    var duration_in = args.duration_in ? args.duration_in: 500;
    errorel.data("n9duration_in", duration_in);
    var duration_mid = args.duration_mid ? args.duration_mid: 3000;
    errorel.data("n9duration_mid", duration_mid);
    var duration_out = args. duration_out ? args.duration_out:  1000;
    errorel.data("n9duration_out", duration_out);
    
    
    errorel.slideDown({ duration:duration_in,
                        test:5,
                        complete: function (el)
                        {   
                            var durmid = $(this).data("n9duration_mid");
                            $(this).animate({color:"yellow"}, 
                                {   duration:"n9duration_mid",
                                    complete: function ()
                                        {
                                            console.log("nv2677:", this, $(this));
                                            var durout = $(this).data("n9duration_out");
                                            $(this).fadeOut({  duration:1000,
                                                                complete: function ()
                                                                {   $(this).remove();
                                                                },
                                                            });
                                        }
                                });
                        }
                    });

}
// compare functions
function n9caseInsensitiveCmp(a,b)
{
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    return 0;
}
function n9divByTimestampCmp(a,b)
{
    var atime = a.getAttribute("data-timestamp");
    var btime = b.getAttribute("data-timestamp");
    if (atime > btime) return -1;
    if (atime < btime) return 1;
    return 0;
}
function n9divByTimestampCmpOldFirst(a,b)
{
    var atime = a.getAttribute("data-timestamp");
    var btime = b.getAttribute("data-timestamp");
    if (atime > btime) return 1;
    if (atime < btime) return -1;
    return 0;
}

// parse arguments
function n9arguments2list(in_arguments)
{
    var in_args = Array.prototype.slice.call(in_arguments);
    return in_args;
}

function n9tempMessage(args)
{
    var target = args.target;
    var msg = args.msgjq;
    var in_delay = "in_delay" in args ? args.in_delay: 300;
    var stay_delay = "stay_delay" in args? args.stay_delay: 2000;
    var stay_color = "stay_color" in args ? args.stay_color: "brown";
    var out_delay = "out_delay" in args ? args.out_delay: 300;
    
    target.empty().append(msg);
    msg.hide();
    
    msg.slideDown(
       { 
        duration:in_delay,
        complete: function ()
         {
           msg.animate(
            { color:stay_color
            },
            { duration:stay_delay,
              complete: function()
               {
                $(this).slideUp(
                 {   duration: out_delay,
                     complete: function ()
                     {
                      $(this).remove();
                     }
                 });
               } 
            });
         }
       });
    

    
}
function n9parseArguments(in_arguments)
{ // I expect "theargs" to be the "arguments" object from the caller
    var parmdict = {};
    var args = [];
    parmdict.args = args;
    in_args = n9arguments2list(in_arguments);
    
    /* format... 
        +arg -> "arg":true is added to parmdict
        -arg -> "arg":false is added to parmdict
        ]arg -> "arg":[... arg], i.e. arg is added to list in parmdict
        =arg -> "arg":next_argument is added to to parmdict
                if possible, else arg:null is added
        arg  -> if not after =arg, arg is added to args
    */
    var expect = false;
    var expect_for = null;
    var stopearly = false;    
    for (var n=0; !stopearly && (n<in_args.length); n++)
    {
        var warg = in_args[n];
        var argtype = warg[0];
        var arg = null;
        if (["+","-","=", "]"].indexOf(argtype) <0)
            {   arg = warg; } 
        else
            {   arg = warg.slice(1); }
        switch(argtype)
        {
        case "+":
            parmdict[arg] = true;
            break;
        case "-":
            parmdict[arg] = false;
            break;
        case "=":
            parmdict[arg] = false;
            expect = "=";
            expect_for = arg;
            break;
        case "]":
            if (!(arg in parmdict))
            { parmdict[arg] = [] }
            expect = "]";
            expect_for = arg;
            break;
        case "|":
            stopearly = true;
            // collect remaining args in arg_remainder
            parmdict["args_remainder"] = in_args.slice(n+1);
            break;
        default:
            switch(expect)
                {
                    case "=":
                        parmdict[expect_for] = arg;
                        break;
                    case "]":
                        var alist = parmdict[expect_for];
                        alist[alist.length] = arg;
                    default:
                        args[args.length] = arg;
                }
            expect = false;
            except_for = null;
        }
    }
    
    return parmdict;
}

function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}

// N9 UTILITIES

function n9_scrollbar_width ()
{
    var scr = null;
    var inn = null;
    var wNoScroll = 0;
    var wScroll = 0;

    // Outer scrolling div
    scr = document.createElement('div');
    scr.style.position = 'absolute';
    scr.style.top = '-1000px';
    scr.style.left = '-1000px';
    scr.style.width = '100px';
    scr.style.height = '50px';
    // Start with no scrollbar
    scr.style.overflow = 'hidden';

    // Inner content div
    inn = document.createElement('div');
    inn.style.width = '100%';
    inn.style.height = '200px';

    // Put the inner div in the scrolling div
    scr.appendChild(inn);
    // Append the scrolling div to the doc
    document.body.appendChild(scr);

    // Width of the inner div sans scrollbar
    wNoScroll = inn.offsetWidth;
    // Add the scrollbar
    scr.style.overflow = 'auto';
    // Width of the inner div width scrollbar
    wScroll = inn.offsetWidth;

    // Remove the scrolling div from the doc
    document.body.removeChild(
        document.body.lastChild);

    // Pixel width of the scroller
    return (wNoScroll - wScroll);
}
function n9_splitrim(arg, token)
{
    if (!token) {token = ","}
    var retl = arg.split(token);
    for (var n = 0; n < retl.length; n++)
    {
        retl[n] = $.trim(retl[n]);
    }
    return retl;
}

function n9_shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function n9_strmul (str, num) {
	if (num<1) return "";
	var	orig = str,
		soFar = [str],
		added = 1,
		left, i;
	while (added < num) {
		left = num - added;
		str = orig;
		for (i = 2; i < left; i *= 2) {
			str += str;
		}
		soFar.push(str);
		added += (i / 2);
	}
	return soFar.join("");
}


function n9_timeDeltaToString(microseconds, style)
{
    if (!style) {   style = "pretty";}
    var seconds = microseconds/1000;
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = Math.floor(((seconds % 86400) % 3600) % 60);
    
    var mstr = [];
    switch(style)
    {
        case "pretty":
            if (numdays>0) 
            { 
                if (numdays == 1)   {mstr[mstr.length] = "" + numdays + " day"}
                else                {mstr[mstr.length] = "" + numdays + " days"}
            }
            if (numhours>0) 
            { 
                var tunit=" hours";
                if (numhours == 1) {tunit = " hour"}
                mstr[mstr.length] = "" + numhours + tunit;
            }
            if (numminutes>0) 
            { 
                var tunit = " minutes";
                if (numminutes == 1) {tunit = " minute"}
                mstr[mstr.length] = ""+numminutes + tunit;
            }
            if (numseconds>0) 
            { 
                mstr[mstr.length] = numseconds + " seconds";
            }
            break;
        case "short":
            if (numdays>0) 
            { 
                if (numdays == 1)   {mstr[mstr.length] = "" + numdays + " d"}
                else                {mstr[mstr.length] = "" + numdays + " d"}
            }
            if (numhours>0) 
            { 
                var tunit=" hrs";
                if (numhours == 1) {tunit = " hr"}
                mstr[mstr.length] = "" + numhours + tunit;
            }
            if (numminutes>0) 
            { 
                var tunit = " m";
                if (numminutes == 1) {tunit = " m"}
                mstr[mstr.length] = ""+numminutes + tunit;
            }
            if (numseconds>0) 
            { 
                mstr[mstr.length] = numseconds + " s";
            }
            break;
    }
    var retstr = mstr.join(" ");
    return retstr;
}
 

// MODULE GLOBALS
_n9_user = null;


var _novem_jq_novem = new Novem();
// global
_njn = _novem_jq_novem;
