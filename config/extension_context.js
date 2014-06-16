n9_extension_context = { 
    "development_mode": "http://localhost", // development_mode sets an alternate novemserver_url... other setting ignored
    "novemserver_url" : "http://discourse.technology",
    "relative_mode": false
};

n9_operation_mode       = false;
n9_novemserver_url      = false;
n9_relative_mode        = false;
n9_novemserver_url_use  = false;

if ("relative_mode" in n9_extension_context)
{
    n9_relative_mode = n9_extension_context["relative_mode"];
}

if ("development_mode" in n9_extension_context)
{
    n9_operation_mode = "DEVELOPMENT";
    n9_novemserver_url = n9_extension_context["development_mode"];
}
else
{
    n9_operation_mode = "e_DEPLOYMENT";
    n9_novemserver_url = n9_extension_context["novemserver_url"];
}

if (n9_relative_mode)
{
    n9_novemserver_url_use = "";
}
else
{
    n9_novemserver_url_use = n9_novemserver_url;
}

