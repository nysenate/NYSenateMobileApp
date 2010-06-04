

var DEFAULT_BAR_COLOR = '#1B4E81';
var DEFAULT_BG = '../../img/bg/nysenatebglight.png';

var BG_BLACK = '../../img/bg/bg.png';
var BG_SPLASH = '../../img/bg/Default.png';
var BG_LIGHT = '../../img/bg/nysenatebglight.png';

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



var senatorJson;

function getSenatorJSON ()
{
	if (!senatorJson)
	{
		Titanium.API.info("loading senators json");
	
		var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'senators.json');
		var contents = file.read();

		Titanium.API.info("parsing senators json");
		
	 	senatorJson = JSON.parse(contents.text);
	}

	return senatorJson;
}

function processNYSenateHtml (rawHTML)
{
	var respText = rawHTML;
	var baseHref = "http://nysenate.gov";
	
	var contentIdx = respText.indexOf('id="content">');
	
	if (contentIdx != -1)
	{
		respText = respText.substring(contentIdx+13);
		
		respText = respText.substring(0, respText.indexOf('<!-- /#content-inner') );
		
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
			
			webModal.setToolbar([toolActInd],{animated:true});
			toolActInd.show();

		});
			
		webModalView.addEventListener('load',function(e)
		{
			Ti.API.debug("webview loaded: "+e.url);
			
			toolActInd.hide();
			webModal.setToolbar(null,{animated:true});

		});
	
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
	
	
};

function playYouTube (vtitle, vguid)
{
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var ytVideoSrc = "http://www.youtube.com/v/" + vguid;
		var thumbPlayer = '<html><head><style type="text/css"> body { background-color: black;color: white;} </style></head><body style="margin:0"><br/><br/><center><embed id="yt" src="' + ytVideoSrc + '" type="application/x-shockwave-flash" width="100%" height="75%"></embed></center></body></html>';

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
		Titanium.API.info("loading modal web view for: " + wUrl);
		
		currentLink = wUrl;
		
		createWebView();
		
		webModal.title = wTitle;
		webModalView.html = "";
		
		Titanium.UI.currentTab.open(webModal,{animated:true});
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(30000);
		xhr.open("GET",wUrl);

		xhr.onload = function()
		{
			
			
			webModalView.html = processNYSenateHtml(this.responseText);
				
			toolActInd.hide();
			webModal.setToolbar(null,{animated:true});
				
		};
		
	
		xhr.send();
	
};