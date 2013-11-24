function _mrsl_compose_blank(morsel_def, morsel)
{
    _mrsl_compose_section(morsel_def, "obj_obj", morsel);
    _mrsl_compose_section(morsel_def, "properties", morsel);
    _mrsl_compose_section(morsel_def, "payload", morsel);
}

function _mrsl_compose(morsel_def, morsel_in)
{   
    var morsel = {};
    var payload = morsel_in.payload;
    var properties = morsel_in.properties;
    
    
    _mrsl_compose_blank(morsel_def, morsel);
    
    for (var key in properties)
    {
        morsel.properties[key] = properties[key];
    }
    
    for (var key in payload)
    {
        morsel.payload[key] = payload[key];
    }
    return morsel;
}


function _mrsl_compose_section(morsel_def, section, outputmorsel)
{
    var items = morsel_def[section];
    var outsection = section;
    if (section == "obj_obj")
    {
        outsection = "_obj";
    }
    
    if (outputmorsel[outsection] == undefined)
    {
        outputmorsel[outsection] = {};
    }
    for (var n =0; n<items.length; n++)
    {
        var item = items[n];
        //c/onsole.log("mjs36:"+JSON.stringify(item));
        if (("name" in item) && ("value" in item))
        {
            outputmorsel[outsection][item["name"]] = item["value"];
        }
    }
}

function _mrsl_report(morsel, morsel_def, target_select)
{
    //@ bad nameing, props is payload values
    var props = morsel.payload;
    //c onsole.log("m57:");
    //c/onsole.log(morsel);
    if (!props)
    {
        props = {};
    }
    var m_properties = morsel.properties;
    
    var payl = morsel_def.payload;
    $(target_select).empty();
    var report = $("<div/>", { class: "map_item_report"});
    for ( var n = 0; n < payl.length; n++)
    {
        var payitem = payl[n];
        var tname, value;
        if (payitem.name)
        {
            var pname;
            if (payitem.pretty_name)
                {
                    pname = payitem.pretty_name;
                }
            else
                {
                    pname = payitem.name;
                }
            name = payitem.name;
            if (payitem.name in props)
            {
                value = props[payitem.name];
            }
            else
            {
                value = null;
                
            }
            //c onsole.log("mrsl6:"+name+" "+value);
            var nameEL = $("<div/>",
                            {   css: {  padding:"2px",
                                        fontSize: "70%",
                                        backgroundColor:"#ddffdd"
                                      },
                                text: pname
                            }
                        );
            if  (
                    value
                     &&
                    (   name == "submap_name" 
                    ||  name == "url"
                    ||  name == "video_id"
                    )
                )
            {
                //nameEL.css("color","blue")
                
                
                var enclosed_value;
                var enc_video_id;
                if (name == "submap_name")
                {
	                enclosed_value = "/n9/maps?map_name="+value;
                }
                if (name == "url")
                {
                    enclosed_value = value;
                }
                if (name == "video_id")
                {
                    enclosed_value = "javascript:void(0)";
                    enc_video_id = value;
                }
                var linkspan = $("<span>", 
                            { html: " ("
                                + $("<a>",
                                    {
                                     "href": enclosed_value,
                                     "text": "LINK",
                                     })[0].outerHTML 
                                 + ") ",
                              css: {"font-size":"90%"}
                                    
                            }
                            );
                nameEL.append(linkspan);
                linkspan.click( function (ev)
                    {
                        _njn.execute("video_player_video",
                                    {   video_id: enc_video_id,
                                        force_scan: false
                                    });
                    });
            }
           
            var valueEL = $("<div/>",
                            {   class: "mrsl_value value-"+name,
                                "data-key": name,
                                css: {  padding:"2px",
                                        fontSize: "80%",
                                        paddingLeft:"2em",
                                        backgroundColor:"#dddddd",
                                        }
                            }
                        );
            if (value)
            {
                valueEL.text(value);
            }
            else
            {
                valueEL.height("1em");
            }
            report.append(nameEL).append(valueEL);
        } 
    }
    var morse = _mrsl_compose(morsel_def, morsel);
    report.data(morse);
    //c/onsole.log("mjs93:"+JSON.stringify(_mrsl_JSONclean(morse)));
    $(target_select).append(report);
    return morse;
}

function _cmp_js2md_types(jstype, mdtype)
{
    var same = false;
    //c/onsole.log("mors167: jstype <==> mdtype", jstype,"?==?", mdtype);
    switch(mdtype)
    {   
        case "int":
        case "float":
        case "timestamp":
            if (jstype == "number") { same = true; }
            break;
        case "string":
        default: 
            if (jstype == "string") { same = true;}
            break;
    }
    return same;
}

function _mrsl_type_fix(morsel, morsel_def)
{
    var DEBUG = false;
    if (!morsel_def)
    {
        morsel_def = _njn.inline("get_map_item_morsel_def")[0];
        //console.log("morse188:", morsel_def);
    }
    //c/onsole.log(n9_strmul("-----",10));
    //c/onsole.log("mors190:",morsel);
    var payload = morsel.payload;
    var payload_def = morsel_def.payload;
    var made_change = false;
    for (var n=0; n<payload_def.length; n++)
    {
        var def = payload_def[n];
        var key = def.name;
        var type = def.type;
        if (!type) {type = "str"};
        if (key in payload)
        {
            var ptype = typeof(payload[key]);
            var compat_types = _cmp_js2md_types(ptype, type);
            var cval = payload[key];
            if (DEBUG)
            {
                console.log("mors203: mdef type: ",type);
                console.log("mors204: js type: ", ptype);
                console.log("mors205:",key, cval);
                console.log("mors206: compat_types?",compat_types);
            }            
            if (! compat_types)
            {   // convert
                switch(type)
                {
                    case "int":
                        cval = parseInt(cval)
                        break;
                    case "float":
                        cval = parseFloat(cval)
                        break;
                    case "str":
                        cval = "" + cval;
                        break;
                }
                payload[key] = cval;
                made_change = true;
            }
            if (DEBUG) {console.log("mors223:", n9_strmul("-=-",2))};
        }
    }
    return made_change;
}

function _mrsl_value_update(podid, key, val)
{
    $("#"+podid).find(".value-"+key).text(val);
    return;
}

function _mrsl_JSONclean(morsel)
{
    var rmorsel = $.extend(true,  {}, morsel);
    for (var section in rmorsel)
        {
            //c/onsole.log("mjs140:"+section);
            for (var prop in rmorsel[section])
            {
            
                //c onsole.log("mf171:"+prop);
                if  (typeof(morsel[section][prop]) == "object")
                {
                    delete rmorsel[section][prop]
                }
            }
        }
    return rmorsel;
}

function N9Morsel(userprops) {
        this.record =   { _obj:{},
                          properties:{},
                          payload: {}
                        };
        if (userprops)
        {
            userprops = $.extend(true, {}, userprops);
            if ("_obj" in userprops)
            {
                this.updateRecord(userprops);
            }
            else
            {
                this.updatePayload(userprops);
            }
        }
}

N9Morsel.prototype = {
    record: null,
    createValueLocation: function (keyname)
    {
        var keyparts = n9_splitrim(keyname);
        var obj = this.record;
        for (var i=0; i<(keyparts.length -1); i++)
        {
            if (!(keyparts[i] in obj))
            {
                obj[keyparts[i]] = {};
            }
            obj = obj[keyparts];
        }
    },
    
    get: function (keyname)
    {
        return this.record.payload[keyname];
    },
    get_objval: function (keyname)
    {
        return this.record._obj[keyname];
    },
    get_prop: function (keyname)
    {
        return this.record.properties[keyname];
    },
    
    set: function (keyname, val)
    {
        this.record.payload[keyname] = val;
    },
    set_objval: function (keyname, val)
    {
        this.record._obj[keyname] = val;
    },
    set_prop: function (keyname, val)
    {
        this.record.properties[keyname] = val;
    },
    
    remove: function (keyname)
    {
        delete this.record.payload[keyname];
    },
    getMorselVal: function (keyname) 
    {
        return eval("this.record."+keyname);
    },
    prepareServerData: function ()
    {
        var servdata = $.extend(true, {}, this.record );
        if (servdata.payload.entry)
        {
            delete servdata.payload.entry;
        }
        if (!servdata._id)
        {
            var _id = servdata._obj.name;
            if (_id) 
            {
                servdata._id = _id;
            }
        }
        return servdata;
    },
    
    setMorselVal: function (keyname, value)
    {
        this.createValueLocation(keyname);
        eval("this.record."+keyname+"=value");
    },
    updateRecord: function(valuedict)
    {
        $.extend(true, this.record, valuedict);
    },
    updatePayload: function (valuedict)
    {
        for (var key in valuedict)
        {
            this.record.payload[key] = valuedict[key];
        }
    }
}

function n9_safeget(entry, name)
{
    try
    {
        var value = eval("entry."+name);
        return value
    }
    catch (error)
    {
        return null;
    }
}