var SENATOR_THUMB_BASE = "http://nysenate.gov/files/imagecache/senator_teaser/profile-pictures/";
	var SENATOR_FULL_BASE = "http://nysenate.gov/files/imagecache/teaser_featured_image/profile-pictures/";


var DEFAULT_BAR_COLOR = '#1B4E81';
var DEFAULT_BG = 'img/bg/nysenatebglight.png';

var BG_BLACK = 'img/bg/bg.png';
var BG_SPLASH = 'img/bg/Default.png';
var BG_LIGHT = 'img/bg/nysenatebglight.png';

var webModal;
var webModalView;
var toolActInd;
var currentLink;
		
var btnSearch = Titanium.UI.createButton({
	title:'Browser',
	style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
});

btnSearch.addEventListener('click',function()
{
	Titanium.Platform.openURL(currentLink);
	
});

/*
var win = Ti.UI.currentWindow;

win.addEventListener('android:back', function (e) {
	if (toolActInd)
	toolActInd.hide();

});
*/

var toolActInd;
function showLoadingDialog (mTitle, mMessage)
{
	toolActInd = Titanium.UI.createAlertDialog({
    		title: mTitle,
    		message: mMessage,
    		buttonNames: []
	});
	toolActInd.show();

}

function hideLoadingDialog ()
{
	if (toolActInd)
		toolActInd.hide();
}


var senatorJson;
function getSenatorJSON ()
{
	if (!senatorJson)
	{
		//Titanium.API.info("loading senators json");
		
		
		var cachedFeed = getCachedFile("senatorsJson");

		//Titanium.API.info("parsing senators json: " + cachedFeed);

		if (cachedFeed)
			senatorJson = JSON.parse(cachedFeed.text);
	 	
	}

	return senatorJson;
}

function processNYSenateHtml (rawHTML)
{
	var respText = rawHTML;
	var baseHref = "http://nysenate.gov";
	
	var contentIdx = respText.indexOf('id="content">');
	
	if (contentIdx && contentIdx != -1)
	{
		respText = respText.substring(contentIdx+13);
		
		respText = respText.substring(0, respText.indexOf('<!-- /#content-inner') );
		
		respText = respText.replace("<div>","");
		respText = respText.replace("</div>","");
		/*
		var videoIdIdx = respText.indexOf("http://www.youtube.com/v/");
		
		if (videoIdIdx !=-1)
		{
			
			var vguid = respText.substring(videoIdIdx+25);
			vguid = vguid.substring(0,vguid.indexOf('&'));
			
			var thumbPlayer = '<embed id="yt" src="http://www.youtube.com/v/' + vguid + '" type="application/x-shockwave-flash" width="320" height="240"></embed>';
			
			respText = respText + "<br/>" + thumbPlayer;
			
		//	Titanium.API.debug("adding youtube player: " + respText);
			
		}
		
		
		respText = '<html><head><style>#emvideo-youtube-flash-1, .group-video, object {display:none;} .links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:295px;max-height:161px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><base href="' + baseHref + '"/>' + respText + '</body></html>';
		*/
	
			respText = '<html><head><style>#emvideo-youtube-flash-1, .group-video, object {display:none;} .links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:295px;max-height:161px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><base href="' + baseHref + '"/>' + respText + '</body></html>';

	}
	
	return respText;
}


function createWebView ()
{
	
		webModal = Ti.UI.createWindow({
			
			barColor:DEFAULT_BAR_COLOR	
	
		});
		
		webModal.orientationModes = [
			Titanium.UI.PORTRAIT,
			Titanium.UI.LANDSCAPE_LEFT,
			Titanium.UI.LANDSCAPE_RIGHT
		];
				
	
		webModalView = Ti.UI.createWebView();
		webModalView.scalesPageToFit = true;
		
		webModal.add(webModalView);
		
		if (Titanium.Platform.name == 'iPhone OS')
		{
			webModal.rightNavButton = btnSearch;
		}
	
		toolActInd = Titanium.UI.createActivityIndicator();
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Loading...';
		
		webModalView.addEventListener('beforeload',function(e)
		{
			Ti.API.debug("webview beforeload: "+e.url);
			
			toolActInd.show();

		});
			
		webModalView.addEventListener('load',function(e)
		{
			Ti.API.debug("webview loaded: "+e.url);
			
			toolActInd.hide();

		});
	
		return webModalView;
}

function showWebModal(wTitle, wUrl)
{
		Titanium.API.info("loading modal web view for: " + wUrl);
		
		currentLink = wUrl;
		
		createWebView();
		
		
		webModal.title = wTitle;
		
		Titanium.UI.currentTab.open(webModal,{animated:true});
		webModalView.html = null;
		webModalView.url = wUrl;
		webModalView.scalesPageToFit = true;
		
};

function playYouTube (vtitle, vguid)
{
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var ytVideoSrc = "http://www.youtube.com/v/" + vguid;
		var thumbPlayer = '<html><head><style type="text/css"> h1 { font-family:\'Helvetica\'; font-size:30pt;} body { background-color: black;color: white;} </style></head><body style="margin:0"><h1>' + vtitle + '</h1><center><embed id="yt" src="' + ytVideoSrc + '" type="application/x-shockwave-flash" width="100%" height="75%"></embed></center></body></html>';

		showHTMLContent(vtitle,'http://www.youtube.com/watch?v=' + vguid,thumbPlayer);
	}
	else
	{
		Titanium.Platform.openURL('http://www.youtube.com/watch?v=' + vguid);
	}
}

function showYouTubeVideo (wTitle, wYouTube)
{
	
	var wYouTubeId = wYouTube.substring(wYouTube.indexOf("v=")+2);
	
	if (wYouTubeId.indexOf("&") != -1)
	{
		wYouTubeId = wYouTubeId.substring(0,wYouTubeId.indexOf("&"));
	}
	
	Titanium.API.info("loading youtube page: " + wYouTubeId + " / " + wYouTube);
	
	var youTubePlayer = '<html><body><center><div id="emvideo-youtube-flash-wrapper-1"><object type="application/x-shockwave-flash" height="350" width="425" data="http://www.youtube.com/v/' + wYouTubeId + '&amp;rel=0&amp;fs=1" id="emvideo-youtube-flash-1" allowFullScreen="true"> <param name="movie" value="http://www.youtube.com/v/' + wYouTubeId + '&amp;rel=0&amp;fs=1" />  <param name="allowScriptAcess" value="sameDomain"/>  <param name="quality" value="best"/>  <param name="allowFullScreen" value="true"/>  <param name="bgcolor" value="#FFFFFF"/>  <param name="scale" value="noScale"/> <param name="salign" value="TL"/> <param name="FlashVars" value="playerMode=embedded" /> <param name="wmode" value="transparent" /> <a href="http://www.youtube.com/watch?v=' + wYouTubeId + '">	<img src="http://img.youtube.com/vi/' + wYouTubeId + '/0.jpg" width="480" height="360" alt="[Video title]" />YouTube Video</a></object></div></center></body></html>';

		showHTMLContent(wTitle, '', youTubePlayer);
	
}

function showHTMLContent(wTitle, wUrl, wHTMLContent)
{
	//Titanium.API.debug("loading html web view content: " + wHTMLContent);
		
		currentLink = wUrl;
		
		createWebView();
		
		
		webModal.title = wTitle;
		
		Titanium.UI.currentTab.open(webModal,{animated:true});
		
		webModalView.html = wHTMLContent;
		
	
};

function showNYSenateContent(wTitle, wUrl)
{

	//Titanium.API.info("loading modal web view for: " + wUrl);
			
			currentLink = wUrl;
			
			createWebView();
			
			webModal.title = wTitle;
			webModalView.title = wTitle;
			webModalView.html = "";
			
			Titanium.UI.currentTab.open(webModal,{animated:true});
			
		var cFile = null;//getCachedFile(wUrl);
		
		if (cFile)
		{
			
			webModalView.html = processNYSenateHtml(cFile);
					
			toolActInd.hide();
		}
		else
		{
			
			
			var xhr = Ti.Network.createHTTPClient();
			xhr.setTimeout(30000);
			xhr.open("GET",wUrl);
	
			xhr.onload = function()
			{
				
				cacheFile(wUrl, this.responseText);
				
				webModalView.html = processNYSenateHtml(this.responseText);
					
				toolActInd.hide();
					
			};
			
		
			xhr.send();
	}		
};


function getCachedFile (cacheUrl)
{

		
		var filename = Titanium.Utils.md5HexDigest(cacheUrl);

		try
		{
		//	Ti.API.debug('looking for cached file md5: ' + filename);
	
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			
			if (f)
			{
			//	Ti.API.debug('found cached file: ' + f.nativePath);
				return f.read();
			}
			else
				return null;
		}
		catch (E)
		{
			//Ti.API.debug('no cache for: ' + cacheUrl);
			return null;
		}	
		
		
		return null;

}

function cacheFile (fileUrl, fileData, fileCallbackFunction)
{

	if (fileData)
	{
		var filename = Titanium.Utils.md5HexDigest(fileUrl);
			
			//Ti.API.debug('saving file ' + fileUrl + ' as : ' + filename);
	
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			
			f.write(fileData);
			
			if(fileCallbackFunction)
				fileCallbackFunction(fileUrl,f);
	
	}
	else
	{
		var c = Titanium.Network.createHTTPClient();
		
		c.setTimeout(30000);
		
		c.onload = function()
		{
			var filename = Titanium.Utils.md5HexDigest(fileUrl);
			
			//Ti.API.info('saving file ' + fileUrl + ' as : ' + filename);
	
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			
			f.write(this.responseData);
			
			if(fileCallbackFunction)
				fileCallbackFunction(fileUrl,f);

		};
		
		c.ondatastream = function(e)
		{
			//ind.value = e.progress ;
			//Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
		};
		
		c.error = function(e)
		{
			//Ti.UI.createAlertDialog({title:'XHR', message:'Error: ' + e.error}).show();
			//Ti.API.debug('ONDATASTREAM1 - ERROR: ' + e.error);
		};
		
		c.open('GET', fileUrl);
		
		// send the data
		c.send();
	}	
}

function processHtml (rawHTML)
{

	rawHTML = rawHTML.replace(/(Related information:)/gi," ");	
	rawHTML = rawHTML.replace(/(Authored by Senator:)/gi," ");
	rawHTML = rawHTML.replace(/(Authored by Senator)/gi," ");
	rawHTML = rawHTML.replace(/(Feature image:)/gi," ");
	rawHTML = rawHTML.replace(/(Senator:)/gi," ");
	rawHTML = rawHTML.replace(/(District:)/gi," ");
	rawHTML = rawHTML.replace(/(File\:)/gi," ");
	rawHTML = rawHTML.replace(/&lt;p&gt;/gi," ");
	rawHTML = rawHTML.replace(/&lt;\/p&gt;/gi," ");
	
	rawHTML=rawHTML.replace(/<br>/gi, " ");
	rawHTML=rawHTML.replace(/  /gi, " ");
	rawHTML=rawHTML.replace(/&nbsp;/gi, " ");
	rawHTML=rawHTML.replace(/&amp;/gi, " & ");
	rawHTML=rawHTML.replace(/<p.*>/gi, "");
	rawHTML=rawHTML.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, "");
	rawHTML=rawHTML.replace(/<(?:.|\s)*?>/g, "");
	rawHTML=rawHTML.replace(/^\s*|\s*$/g,'');
	
	rawHTML = rawHTML.replace(/(\r\n|\n|\r)/gm," ");
	
	rawHTML = trim(rawHTML);
	
	return rawHTML;
}



function trim(s) 
{ 
    var l=0; 
    var r= s.length-1; 
    while(l < s.length && s[l] == ' ') 
    {     l++; } 
    while(r > l && s[r] == ' ') 
    {     r-=1;     } 
    return s.substring(l, r+1); 
} 

// Simulates PHP's date function
Date.prototype.format = function(format) {
	var returnStr = '';
	var replace = Date.replaceChars;
	for (var i = 0; i < format.length; i++) {
		var curChar = format.charAt(i);
		if (replace[curChar]) {
			returnStr += replace[curChar].call(this);
		} else {
			returnStr += curChar;
		}
	}
	return returnStr;
};
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	
	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { return "Not Yet Supported"; },
	// Week
	W: function() { return "Not Yet Supported"; },
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { return "Not Yet Supported"; },
	// Year
	L: function() { return (((this.getFullYear()%4==0)&&(this.getFullYear()%100 != 0)) || (this.getFullYear()%400==0)) ? '1' : '0'; },
	o: function() { return "Not Supported"; },
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return "Not Yet Supported"; },
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	// Timezone
	e: function() { return "Not Yet Supported"; },
	I: function() { return "Not Supported"; },
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() % 60)); },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d") + "T" + this.format("H:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};


/**
*
*  URL encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Url = {
 
	// public method for url encoding
	encode : function (string) {
		return escape(this._utf8_encode(string));
	},
 
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

//
// returns true if iphone/ipad and version is 3.2+
//
function isIPhone3_2_Plus()
{
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0]);
		var minor = parseInt(version[1]);
		
		// can only test this support on a 3.2+ device
		if (major > 3 || (major == 3 && minor > 1))
		{
			return true;
		}
	}
	return false;
}

function isiOS4Plus()
{
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0]);
		
		// can only test this support on a 3.2+ device
		if (major >= 4)
		{
			return true;
		}
	}
	return false;
}
