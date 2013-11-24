
// Restores select box state to saved value from localStorage.
function restore_options() {
	
	setVersionNumber();
}


document.addEventListener('DOMContentLoaded', restore_options);

function setVersionNumber(){

var manifest = chrome.runtime.getManifest();
var heading = document.getElementById("app_name");

heading.innerHTML = manifest.name+ "<span class='ytcl_notice'>&nbsp;&nbsp;"+manifest.version+"</span>";

}
function cgeWindow()
{
	console.log("pop74: cgeWindow()");
	$("#popup_notify").append($("<span>", {text:"TEST TEST"}));
	_njn.send({cmd:"open_home"}, 
				{ complete: function (msg) 
					{
						console.log("pop76:", msg);
					}
				 }
			);
}
					
$("#popup_notify").append($("<span>", {text:"TEST TEST"}));
$("#open_home_butt").click(cgeWindow);