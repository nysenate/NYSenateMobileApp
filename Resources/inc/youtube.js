
var win = Titanium.UI.currentWindow;
var tableview;
// create table view data object
var data = [];

var webModal;
var webModalView;
var toolActInd;
var currentLink;

var DEFAULT_CHANNEL = 'NYSenate';


var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading videos...';
toolActInd.show();


tableview = Titanium.UI.createTableView({
			data:data,
			backgroundColor:"#000000",
			separatorColor:"#000000",
			top:45
			});
			
			Titanium.UI.currentWindow.add(tableview);
			tableview.addEventListener('click',function(e)
			{
				
					playYouTube(e.row.videotitle,e.row.guid);
			
			});
			


			var search = Titanium.UI.createSearchBar({
				barColor:'#000', 
				showCancel:false,
				hintText:'enter keywords to search',
				height:43,
				top:0
			});

		


			//
			// SEARCH BAR EVENTS
			//
			search.addEventListener('change', function(e)
			{

			});
			search.addEventListener('cancel', function(e)
			{
			    search.blur();
				//search.visible = false;
			
			});
			search.addEventListener('return', function(e)
			{
				var searchText = e.value;
				
			//	Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
			 	search.blur();
			//	search.visible = false;
				
				doYouTubeSearch (DEFAULT_CHANNEL,searchText);
				
			});
			search.addEventListener('focus', function(e)
			{
			});
			search.addEventListener('blur', function(e)
			{
			});


			Titanium.UI.currentWindow.add(search);
			
var xhr = Ti.Network.createHTTPClient();


function doYouTubeSearch (channel, searchTerm)
{
	var searchUrl = 'http://gdata.youtube.com/feeds/api/videos?alt=rss&author=' + escape(channel) + '&q=' + escape(searchTerm) + "&orderby=published&max-results=25&v=2";
	toolActInd.show();
	
	xhr = Ti.Network.createHTTPClient();
	

xhr.onload = function()
{
	try
	{
			var doc;
	
	Titanium.API.debug("got youtube video response");
	
		if (!this.responseXML)
		{
			Titanium.API.debug("got plaintext");
	
			doc = Titanium.XML.parseString(this.responseText).documentElement;
		}
		else
		{
		
			Titanium.API.debug("got XML");
			doc = this.responseXML.documentElement;
		}

		data = [];
		tableview.setData(data);

		var items = doc.getElementsByTagName("item");
		var x = 0;
		var c;
		
		if (items.length == 0)
		{
			var row = Ti.UI.createTableViewRow({height:80});
			row.hasDetail = false;
			row.title = "No matching results";
			row.text = "No matching results";
			data[x++] = row;
		}
		
		
		for (c=0;c<items.length;c++)
		{
			var item = items.item(c);
		
			var title = item.getElementsByTagName("title").item(0).text;
			
			var summary = "";
			if (item.getElementsByTagName("pubDate"))
			{
				summary = item.getElementsByTagName("pubDate").item(0).text;
				}
				
			var link = "";
			
			if (item.getElementsByTagName("link"))
			{
				link = item.getElementsByTagName("link").item(0).text;	
			}
			
			var guid = link.substring(link.indexOf("?v=")+3);
			guid = guid.substring(0,guid.indexOf("&"));
			
			var thumbnail = "http://i.ytimg.com/vi/" + guid + "/2.jpg";
			
			var row = Ti.UI.createTableViewRow({height:80});
		
			row.url = link;
			row.guid = guid;
			row.videotitle = title;
			row.backgroundColor="#000000";
			row.color ="#ffffff";
			
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:105,
				top:10,
				height:40,
				font:{fontSize:16},
				color:"#ffffff"
			});
			row.add(labelTitle);
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:105,
				top:45,
				font:{fontSize:12},
				color:"#ffffff"
			});
			row.add(labelSummary);
		
			var img = Ti.UI.createImageView({
				url:thumbnail,
				left:0,
				height:80,
				width:100
			});
			row.add(img);
			
			data[x] = row;
			tableview.appendRow(data[x]);

			x++;
		}
		
		
	}
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'Video Search', message:'There was an error accessing YouTube.'}).show();
	
	}
	
		toolActInd.hide();
};

xhr.open("GET",searchUrl);
	xhr.send();
	
	
	Ti.API.debug("youtube: " + searchUrl);
}

function createWebView ()
{
	
		webModal = Ti.UI.createWindow({
		});
		
		webModal.orientationModes = [
			Titanium.UI.PORTRAIT,
			Titanium.UI.LANDSCAPE_LEFT,
			Titanium.UI.LANDSCAPE_RIGHT
		];
				
	
		webModalView = Ti.UI.createWebView();
		webModalView.scalesPageToFit = true;
		
		webModal.add(webModalView);
		

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


doYouTubeSearch(DEFAULT_CHANNEL,'');
