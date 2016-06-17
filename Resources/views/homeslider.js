Ti.include("../globals.js");
Ti.include("../inc/jssha256.js");
Ti.include("../inc/drupal_services.js");


//
// SETUP WINDOW STYLES
//
var win = Ti.UI.currentWindow;

var screenHeight = win.size.height;
var screenWidth = win.size.width;

var currentTop = 0;
var rowHeight = 140;

var urlRegex = new RegExp("http:\\/\\/\\S+\\.[jJ][pP][eE]?[gG]", "g");
//var urlRegex = new RegExp("((?:(?:https?|ftp|file)://|www.|ftp.)[-A-Z0-9+&@#/%=~|$?!:,.][A-Z0-9+&@#/%=~_|$]+.(jpg|png|gif|jpeg|bmp))(?!([^<]+)?>)");

var feeds = [
['Newsroom','views','senate_updates'],
['Latest Video Highlights','youtube','nysenate'],
//['Legislative Updates','rss','http://www.nysenate.gov/issues-list/199/all/feed'],
//['General News','rss','http://www.nysenate.gov/issues-list/117/all/feed'],
['NYSenate Uncut Videos','youtube','nysenateuncut'],
//['Government Operations','rss','http://www.nysenate.gov/issues-list/186/all/feed'],
];

var feedViews = [];
var feedXhr = [];
var thisXhr;
var toolActInd = Titanium.UI.createActivityIndicator({
  	  height:50,
  	  width:10
	});

	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	toolActInd.color = 'white';
	toolActInd.message = 'Connecting to the Senate...';


var scrollViewMain;

function loadFeeds ()
{

	screenHeight = win.size.height;
	screenWidth = win.size.width;

	currentTop = 0;
	rowHeight = 140;

	feedViews = [];
	feedXhr = [];
	thisXhr = null;

	if (scrollViewMain)
	{
		win.remove(scrollViewMain);
		scrollViewMain = null;
	}

	scrollViewMain = Titanium.UI.createScrollView({
		top:0,
		left:0,
		width:screenWidth,
		contentWidth:'auto',
		contentHeight:'auto',
		showVerticalScrollIndicator:false,
		showHorizontalScrollIndicator:false,
		scrollType:'vertical'
	});
	win.add(scrollViewMain);

	toolActInd.show();

	for (i = 0; i < feeds.length; i++)
	{

		var labelTitle = Ti.UI.createLabel({
			text:feeds[i][0],
			left:0,
			top:currentTop,
			height:20,
			font:{fontSize:14},
			color:'#ffffff'
		});

		scrollViewMain.add(labelTitle);

		var scrollViewRow = Titanium.UI.createScrollView({
					top:currentTop+20,
					left:0,
					height:120,
					width:screenWidth,
					contentWidth:'auto',
					showVerticalScrollIndicator:false,
					showHorizontalScrollIndicator:true,
					scrollType:'horizontal'

		});

		feedViews[feedViews.length] = scrollViewRow;

		loadFeed(feeds[i][1],feeds[i][2],i);
		currentTop += rowHeight;
	}
}

var errorHandler = function ()
{
	toolActInd.hide();
		var alertOff = Titanium.UI.createAlertDialog({
			title:'Network Error',
			message:'Unable to connect to NYSenate.gov.\nPlease try again later.',
			 buttonNames: ['OK']

		});

		alertOff.show();

};



function parseDoc(doc, feedIdx)
{

	var items = doc.getElementsByTagName("item");

	var item;

	//Titanium.API.debug("viewing items: " + items.length);

	var greyBg = false;

	var x = 0;
	var c;

	var rTop = 10;

	var vWidth = 160;
	var vHeight = 120;
	var vHorizSpacing = 30;

	if (screenWidth < 768)
		vHorizSpacing = 5;

	var rLeft = 0;
	var vContainerHeight = 200;
	var vLabelHeight = 70;

	var scrollViewRss = feedViews[feedIdx];
	var title = "";
	var link = "";
	var desc = "";
	var dateString = "";

	for (c = 0; c < items.length; c++)
	{
		try
		{
			item = items.item(c);

			title = item.getElementsByTagName("title");

			if (title && title.item)
				title = title.item(0).text;
			else
				title = "";

			//Ti.API.info(c + ": " + title);

			link = item.getElementsByTagName("link");
			if (link && link.item)
				link = link.item(0).text;
			else
				link = "";

			//Ti.API.info(c + ": " + link);

			dateString = item.getElementsByTagName("pubDate");


			if (dateString && dateString.item)
				dateString = new Date(dateString.item(0).text).format('M jS');
			else
				dateString = "";

		//	Ti.API.info(c + ": " + dateString);

			desc = item.getElementsByTagName("description");
			if (desc && desc.item(0))
				desc = desc.item(0).text;
			else
				desc = "";

		//	Ti.API.info(c + ": desc length " + desc.length);

			var thumbnail = "";

			var mediaThumbnail = item.getElementsByTagName("media:thumbnail");

			if (mediaThumbnail && mediaThumbnail.item && mediaThumbnail.item.length > 0)
			{
				Ti.API.info("got media:thumbnail");
				mediaThumbnail = mediaThumbnail.item(0);
				thumbnail = mediaThumbnail.getAttribute("url");

			}
			else
			{

				try
				{
					//Ti.API.info("checking for images in desc text");

					var descImages = desc.match(urlRegex);
					if (descImages)
					{
						for (dIdx = 0; dIdx < descImages.length; dIdx++)
						{
							Ti.API.debug("found match: " + descImages[dIdx]);
							thumbnail = descImages[dIdx];

						}
					}

					Ti.API.info(c + ': ' + thumbnail);

				}
				catch (err)
				{
					Titanium.API.info("error getting thumbnail: " + c);

					Titanium.API.error(err);
				}
			}



			var videoBox = Titanium.UI.createView({
				height:vHeight,
				width:vWidth,
				top:0,
				left:rLeft,
				backgroundColor:"#000000"
			});

			rLeft+=vWidth+6;

			var labelBottom = 80;
			var labelHeight = 40;
			var img;
			var labelTitle = title;
			var labelFontSize = 14;

			if (thumbnail)
			{

				Ti.API.info("setting thumbnail: " + thumbnail);

				thumbnail = thumbnail.replace("files/", "files/imagecache/teaser_featured_image/");

				/*
				var cachedImage = getCachedFile(thumbnail);

				if (!cachedImage)
				{
					cacheFile(thumbnail);
					cachedImage = thumbnail;
				}*/

				img = Ti.UI.createImageView({
					//image:cachedImage,
					url:thumbnail,
					left:0,
					top:0,
					height:vHeight,
					width:vWidth
				});

				videoBox.add(img);

			}
			else
			{

				labelTitle = title;// + '\n' + processHtml(desc);

				labelBottom = 0;
				labelHeight = 120;
				labelFontSize = 16;
			//	Ti.API.info("setting title: " + labelTitle);

			}

			var labelTitle = Ti.UI.createLabel({
				text:labelTitle,
				left:0,
				top:labelBottom,
				width:155,
				height:labelHeight,
				font:{fontSize:labelFontSize},
				color:'#ffffff',
				backgroundColor:"#000000",
				opacity:.7
			});
			videoBox.add(labelTitle);

			if (thumbnail)
			{
				img.blogContent = desc;
				img.blogTitle = title;
				img.blogLink = link;

				img.addEventListener('singletap',function(e)
				{

					var htmlData =  e.source.blogContent;
						htmlData = '<html><head><style>.links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><h2>' + e.source.blogTitle + '</h2>' + htmlData + '</body></html>';
						showHTMLContent(e.source.blogTitle,e.source.blogLink,htmlData);

				});
			}
			else
			{
				labelTitle.left = 3;

				labelTitle.blogContent = desc;
				labelTitle.blogTitle = title;
				labelTitle.blogLink = link;

				labelTitle.addEventListener('singletap',function(e)
				{

					var htmlData =  e.source.blogContent;
						htmlData = '<html><head><style>.links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><h2>' + e.source.blogTitle + '</h2>' + htmlData + '</body></html>';
						showHTMLContent(e.source.blogTitle,e.source.blogLink,htmlData);

				});
			}

			scrollViewRss.add(videoBox);
		}
		catch (err)
		{
			Titanium.API.info("error parsing item: " + c);

			Titanium.API.error(err);
		}
	}

	scrollViewMain.add(scrollViewRss);

}




function parseYoutube (respObj)
{
	try
	{
		if(toolActInd)
			toolActInd.hide();

		var doc;

		//Titanium.API.debug("got youtube video response");

		if (!respObj.responseXML)
		{
		//	Titanium.API.debug("got plaintext");

			doc = Titanium.XML.parseString(respObj.responseText).documentElement;
		}
		else
		{

		//	Titanium.API.debug("got XML");
			doc = respObj.responseXML.documentElement;
		}

		var scrollViewVideos = feedViews[respObj.feedIdx];

		var items = doc.getElementsByTagName("item");

		var c;


		var x = 0;
		var rTop = 10;

		var vWidth = 160;
		var vHeight = 120;
		var vHorizSpacing = 30;

		if (screenWidth < 768)
			vHorizSpacing = 5;

		var rLeft = 0;
		var vContainerHeight = 200;
		var vLabelHeight = 70;



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


			var videoBox = Titanium.UI.createView({
				height:vHeight,
				width:vWidth,
				borderSize:0,
				top:0,
				left:rLeft,
				backgroundColor:"#000000"
			});


			rLeft+=vWidth+6;

			/*
			var cachedImage = getCachedFile(thumbnail);

			if (!cachedImage)
			{
				cacheFile(thumbnail);
				cachedImage = thumbnail;
			}*/

			var img = Ti.UI.createImageView({
				//image:cachedImage,
				url:thumbnail,
				left:0,
				top:0,
				height:vHeight,
				width:vWidth
			});

			img.guid = guid;
			img.videotitle = title;

			videoBox.add(img);



			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:0,
				bottom:0,
				height:45,
				font:{fontSize:14},
				color:'#ffffff',
				backgroundColor:'#000000',
				opacity:.7
			});
			videoBox.add(labelTitle);


			img.addEventListener('singletap',function(e)
			{

					playYouTube(e.source.videotitle,e.source.guid);

			});

			scrollViewVideos.add(videoBox);


		}

		scrollViewMain.add(scrollViewVideos);


	}
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'No videos were found for this search.'}).show();
	}

}

function parseNewsroomResponse (responseText, feedIdx)
{
	var items = JSON.parse('{"data":' + responseText + '}').data["#data"];


	var x = 0;
	var c;

	var rTop = 10;

	var vWidth = 160;
	var vHeight = 120;
	var vHorizSpacing = 30;

	if (screenWidth < 768)
		vHorizSpacing = 5;

	var rLeft = 0;
	var vContainerHeight = 200;
	var vLabelHeight = 70;

	var scrollViewRss = feedViews[feedIdx];
	var title = "";
	var link = "";
	var desc = "";
	var dateString = "";

	for (i = 0; i < items.length; i++)
	 {

		try
		{
			item = items[i];

			title = item.title;

			link = "http://nysenate.gov/" + item.path;

			/*
			dateString = item.getElementsByTagName("pubDate");

			if (dateString && dateString.item)
				dateString = new Date(dateString.item(0).text).format('M jS');
			else
				dateString = "";
				*/

			desc = item.body;

			var thumbnail = "";

			var isVideo = false;

			if (item.field_video && item.field_video.length > 0 && item.field_video[0].data.thumbnail)
			{
				thumbnail = item.field_video[0].data.thumbnail.url;

				//link = item.field_video[0].embed;
				link = item.field_video[0].value;

				isVideo = true;
			}
			else
			{

				try
				{
					//Ti.API.info("checking for images in desc text");

					var descImages = desc.match(urlRegex);
					if (descImages)
					{
						for (dIdx = 0; dIdx < descImages.length; dIdx++)
						{
							Ti.API.debug("found match: " + descImages[dIdx]);
							thumbnail = descImages[dIdx];

						}
					}

					//Ti.API.info(c + ': ' + thumbnail);

				}
				catch (err)
				{
					Titanium.API.info("error getting thumbnail: " + c);

					Titanium.API.error(err);
				}
			}



			var videoBox = Titanium.UI.createView({
				height:vHeight,
				width:vWidth,
				top:0,
				left:rLeft,
				backgroundColor:"#000000"
			});

			rLeft+=vWidth+6;

			var labelBottom = 80;
			var labelHeight = 40;
			var img;
			var labelTitle = title;
			var labelFontSize = 14;

			if (thumbnail)
			{

			//	Ti.API.info("setting thumbnail: " + thumbnail);

				if( thumbnail.indexOf("nysenate.gov")!=-1)
					thumbnail = thumbnail.replace("files/", "files/imagecache/teaser_featured_image/");

				/*
				var cachedImage = getCachedFile(thumbnail);

				if (!cachedImage)
				{
					cacheFile(thumbnail);
					cachedImage = thumbnail;
				}*/

				img = Ti.UI.createImageView({
					//image:cachedImage,
					url:thumbnail,
					left:0,
					top:0,
					height:vHeight,
					width:vWidth
				});

				videoBox.add(img);

			}
			else
			{

				labelTitle = title;// + '\n' + processHtml(desc);

				labelBottom = 0;
				labelHeight = 120;
				labelFontSize = 16;
			//	Ti.API.info("setting title: " + labelTitle);

			}

			var labelTitle = Ti.UI.createLabel({
				text:labelTitle,
				left:0,
				top:labelBottom,
				width:155,
				height:labelHeight,
				font:{fontSize:labelFontSize},
				color:'#ffffff',
				backgroundColor:"#000000",
				opacity:.7
			});
			videoBox.add(labelTitle);

			if (thumbnail)
			{
				img.blogContent = desc;
				img.blogTitle = title;
				img.blogLink = link;

				if (isVideo)
				{
					img.addEventListener('singletap',function(e)
					{
						playYouTube(e.source.blogTitle,e.source.blogLink);
					});
				}
				else
				{
					img.addEventListener('singletap',function(e)
					{

						var htmlData =  e.source.blogContent;
							htmlData = '<html><head><style>.links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><h2>' + e.source.blogTitle + '</h2>' + htmlData + '</body></html>';
							showHTMLContent(e.source.blogTitle,e.source.blogLink,htmlData);

					});
				}
			}
			else
			{
				labelTitle.left = 3;

				labelTitle.blogContent = desc;
				labelTitle.blogTitle = title;
				labelTitle.blogLink = link;

				labelTitle.addEventListener('singletap',function(e)
				{

					var htmlData =  e.source.blogContent;
						htmlData = '<html><head><style>.links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><h2>' + e.source.blogTitle + '</h2>' + htmlData + '</body></html>';
						showHTMLContent(e.source.blogTitle,e.source.blogLink,htmlData);

				});
			}

			scrollViewRss.add(videoBox);
		}
		catch (err)
		{
			Titanium.API.info("error parsing item: " + c);

			Titanium.API.error(err);
		}
	}

	scrollViewMain.add(scrollViewRss);



}



function loadFeed (type, value, feedIdx)
{


	thisXhr =  Ti.Network.createHTTPClient();
	thisXhr.feedIdx = feedIdx;

	if (type == 'rss')
	{
		var rssUrl = value;


		thisXhr.onload = function ()
		{
			if(toolActInd)
				toolActInd.hide();

		//	Titanium.API.debug("got rss response");
			cacheFile(this.location, this.responseText);

			var doc = Titanium.XML.parseString(this.responseText).documentElement;

			parseDoc(doc, this.feedIdx);

		};

		thisXhr.onerror = errorHandler;

		thisXhr.open("GET",rssUrl);
		thisXhr.send();

	//	Ti.API.debug('fetching rss: ' + rssUrl);
	}
	else if (type == 'youtube')
	{
		var searchTerm = '';
		var channel = value;
		var searchUrl = 'http://gdata.youtube.com/feeds/api/videos?alt=rss&author=' + escape(channel) + '&q=' + escape(searchTerm) + "&orderby=published&max-results=10&v=2";

		thisXhr.onload = function ()
		{
			if(toolActInd)
				toolActInd.hide();

			//cacheFile(this.location, this.responseText);
			parseYoutube(this);
		};
		thisXhr.onerror = errorHandler;

		thisXhr.open("GET",searchUrl);
		thisXhr.send();

		Ti.API.debug('fetching youtube: ' + searchUrl);

	}
	else if (type == 'views')
	{


			var serviceCallback = function(){
				cacheFile('view.' + value, this.responseText);
				parseNewsroomResponse(this.responseText, feedIdx);
			};

			doNYSenateServiceCall('views.get',['view_name'],[value],serviceCallback, function ()
			{

					var viewRespText = getCachedFile('view.' + value);

					if (viewRespText)
					{
						Ti.API.info("GOT CACHED VIEW:" + value);
						parseNewsroomResponse(viewRespText, feedIdx);
					}

			});
	}

	feedXhr[feedIdx] = thisXhr;
}

function checkOnline (onlineState)
{


	if (!onlineState)
	{
		var alertOff = Titanium.UI.createAlertDialog({
			title:'No Network',
			message:'You are offline.\nSome content may be inaccessible.',
			 buttonNames: ['OK']

		});

		alertOff.show();
	}
	else
	{
		//no worries!
		loadFeeds();
	}
}

if (Titanium.Platform.name == 'iPhone OS')
{

	var btnRefresh = Titanium.UI.createButton({
		image:'../img/btn/icon_refresh.png',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});


	win.rightNavButton = btnRefresh;

	btnRefresh.addEventListener('click',function()
	{
		//no worries!
		loadFeeds();
	});


}
else
{

	var tb1 = null;
var tb2 = null;

var menuHandler = function() {
    tb1.addEventListener('click', function() {
       //no worries!
		loadFeeds();
    });
};

var activity = Ti.Android.currentActivity;
activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;
    tb1 = menu.add({title : 'Refresh'});
    menuHandler();
};
}


checkOnline(Ti.Network.online);

var lastOrientation;


function reloadLayout()
{
	screenHeight = win.size.height;
	screenWidth = win.size.width;

	scrollViewMain.width = screenWidth;
	scrollViewMain.contentWidth = 'auto';
	scrollViewMain.contentHeight = 'auto';

	for (i = 0; i < feedViews.length; i++)
	{
		feedViews[i].width = screenWidth;
		feedViews[i].contentWidth = 'auto';
		feedViews[i].contentHeight = 'auto';

	}
}

Titanium.Gesture.addEventListener('orientationchange',function(e){

	Ti.API.debug(e.orientation);


	if (lastOrientation != e.orientation)
	{
		 if(e.orientation == 1 || e.orientation == 2)
		{
			// Function that changes the left property of
			// just about every item in the view
				reloadLayout();
		}
		else if(e.orientation == 3 || e.orientation == 4)
		{
				reloadLayout();
		}


 	}

 	lastOrientation =  Math.round(e.orientation);
});

