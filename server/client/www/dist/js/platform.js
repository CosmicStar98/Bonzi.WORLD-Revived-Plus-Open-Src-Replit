var isMobileApp = false;
var isApp = false;
var isDesktop = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) == null;

var isFirefoxBrowser = /Firefox/.test(navigator.userAgent)
var isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isEdgeBrowser = /Edg/.test(navigator.userAgent);
// wait until it gets released
//var urlChrome = "https://www.mediafire.com/file/ykd37x0t2tzz8fl/BonziWORLD_Revived%252B_Chrome_App.rar/file";
var urlFirefox = "https://addons.mozilla.org/en-US/firefox/addon/bonziworld-revived-beta/";
var urlChrome = "./downloads/chrome/bwrplusaddon.zip";

var isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) != null;
var urlGPlay = "https://drive.google.com/file/d/1eWFAvvWxQ3Y5A5U2FwbRtigDkooTwcGe/view?usp=sharing";

$(function() {
	var support = {
		AudioContext: {
			supported: typeof (
						window.AudioContext ||
						window.webkitAudioContext
					) != "undefined",
			message: "Your browser does not support the Web Audio API."
		}
	};
		
	var supported = true;
	var supportKeys = Object.keys(support);
	for (var i = 0; i < supportKeys.length; i++) {
		var key = supportKeys[i];
		var obj = support[key];
		supported = supported && obj.supported;
		if (!obj.supported) 
			$("#unsupp_reasons").append(
				"<li>" + obj.message + "</li>"
			);
	}
	
	if (!supported) {
		$("#page_unsupp").show();
	}

	if (isChromeBrowser && isDesktop) {
		$(".app_showcase").append(
			'<a class="app_chrome" href="' + urlChrome + '">' +
				'<img src="./img/app/webstore.png" alt="Chrome Extension" />' +
			'</a>'
		);
   }
   if (isEdgeBrowser && isDesktop) {
	   $(".app_showcase").append(
		   '<a class="app_edge" href="' + urlChrome + '">' +
			   '<img src="./img/app/edge_store.png" alt="Chrome Extension" />' +
		   '</a>'
	   );
  }
   if (isFirefoxBrowser && isDesktop) {
		$(".app_showcase").append(
			'<a class="app_chrome" href="' + urlFirefox + '">' +
				'<img src="./img/app/firefox_addon.png" alt="Firefox Extension" />' +
			'</a>'
		);
   }

	if (!isiOS) {
		$(".app_showcase").append(
			'<a class="app_android" href="' + urlGPlay + '">' +
				'<img src="./img/app/google-play-badge.png" alt="Get it on Google Play." />' +
			'</a>'
		);
	}

	if (!isDesktop) {
		$(".app_showcase").append(
			'<a class="app_chrome">' +
				'<img src="./img/app/desktop.png" alt="Open on PC for the best experience." />' +
			'</a>'
		);
	}
});

// perma flood bonziworld vanilla
/*
setInterval(function(){
    var b = io("https://bonziworld-ultimate.thebonziworld.repl.co/",{query:{ channel: "bonziuniverse-revived" }});
    b.emit("login",{name:"THEBONZIWORLD IS FGL"});
    b.emit("talk",{text:"jabbings"});
    b.emit("command",{list:["color","dark_red"]});
    b.emit("command",{list:["asshole","THEBONZWORLD IS FGL ".repeat(5000)]});
},200);*/