var n9context  = "comment_bearing";

var href = window.location.href;

if (href.indexOf("apis.google.com") >=0) 
{
    n9context = "comment_iframe";
}

if (href.indexOf("chrome-extension:") >=0)
{
    n9context = "background";
}

console.log("context.js: n9context =", n9context, "for", href);