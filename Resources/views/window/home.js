Ti.include("../../inc/globals.js");

var IMAGE_RESIZER = "http://nysenatemobile.appspot.com/servlet/ImageResizer?url=";

//
// SETUP WINDOW STYLES
//
Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK;
var win = Ti.UI.currentWindow;

var cover = Titanium.UI.createView({
	backgroundImage:DEFAULT_BG,
	zIndex:5
});
win.add(cover);


var messageView = Titanium.UI.createView({
	top:5,
	backgroundColor:'transparent',
	height:50,
	width:320,
	borderRadius:10,
	opacity:0.8
});

var messageLabel = Titanium.UI.createLabel({
	color:'#fff',
	text:'Featured News & Updates',
	textAlign:'center',
	font:{fontSize:16},
	top:5,
	left:5,
	width:320,
	height:'auto'
});

messageView.add(messageLabel);
win.add(messageView);

var messageView2 = Titanium.UI.createView({
	top:190,
	backgroundColor:'transparent',
	height:50,
	width:300,
	left:20,
	borderRadius:10,
	opacity:0.8
});

var messageLabel2 = Titanium.UI.createLabel({
	color:'#fff',
	text:'Featured Video',
	textAlign:'center',
	font:{fontSize:16},
	top:0,
	left:0,
	width:300,
	height:'auto'
});

messageView2.add(messageLabel2);
win.add(messageView2);

/*

var messageView3 = Titanium.UI.createView({
	top:190,
	backgroundColor:'transparent',
	height:50,
	width:160,
	right:20,
	borderRadius:10,
	opacity:0.8
});

var messageLabel3 = Titanium.UI.createLabel({
	color:'#fff',
	text:'Featured Blog',
	textAlign:'right',
	font:{fontSize:16},
	top:5,
	left:5,
	width:150,
	height:'auto'
});

messageView3.add(messageLabel3);
win.add(messageView3);
*/



var xhr = Ti.Network.createHTTPClient();


xhr.onreadystatechange = function () {
	Titanium.API.info("json request - ready start: " + xhr.readyState);
	
	
};

var homeItems;

function checkOnline (onlineState)
{
	
	
	if (!onlineState)
	{
		var alertOff = Titanium.UI.createAlertDialog({
			title:'No Network',
			message:'You must be online to access the NY Senate site',
			 buttonNames: ['OK']
			
		});
		
		alertOff.show();
	}
	else
	{
		//no worries!
		
	}
}

checkOnline(Ti.Network.online);

Ti.Network.addEventListener('change',function(e) {
	
	checkOnline (e.online);
	
});

xhr.onerror = function ()
{
		var alertOff = Titanium.UI.createAlertDialog({
			title:'Network Error',
			message:'Unable to connect to NYSenate.gov.\nPlease try again later.',
			 buttonNames: ['OK']
			
		});
		
		alertOff.show();
	
};

function loadFeatures (featuresJSON)
{		
		
		
		Titanium.API.info("got features data");

		var cTransform = Ti.UI.create2DMatrix().scale(0.75);
	
		homeItems = JSON.parse(featuresJSON).nodes;

		var BASEPATH = "http://nysenate.gov/";
		
		var sViews = [homeItems.length];
		
		for (var c=0;c<homeItems.length;c++)
		{
			var item = homeItems[c];
			
			var imageUrl = BASEPATH + item.files_node_data_field_feature_image_filepath;
			imageUrl = imageUrl.replace("\/","/");
			imageUrl = imageUrl.replace(" ","%20");
			
			Titanium.API.info("LOADING IMAGE " +imageUrl);
		
		//	imageUrl = IMAGE_RESIZER + escape(imageUrl);
			
			var imageView = Titanium.UI.createImageView({
				url:imageUrl,
				transform:cTransform,
				visible:true,
				canScale:true,
				width:320,
				height:150,
				borderColor:"transparent",
				borderWidth:10
			});
			
			imageView.nid = item.nid;
			imageView.ntitle = item.node_title;
			
			sViews[c] = imageView;
			
			sViews[c].addEventListener('singletap', function(e)
			{
			//	Titanium.API.info('singletap event: ' + e + " : " + e.source.nid);
				showNYSenateContent(e.source.ntitle,"http://nysenate.gov/node/" + e.source.nid);

			});
			
		
		}
		
		Titanium.API.info("adding scrollview!");
		
		var scrollView = Titanium.UI.createScrollableView({
			views:sViews,
			showPagingControl:true,
			clipViews:true,
			top:20,
			left:30,
			right:30,
			height:150,
			layout:'horizontal',
			horizontalBounce:true,
			showHorizontalScrollIndicator:true
		});
		
	
		
		Ti.UI.currentWindow.add(scrollView);
		
		Titanium.API.info("fading cover");
		
		cover.animate({opacity:0,duration:2000});
		
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
		

};


xhr.onload = function() {

	loadFeatures(this.responseText);
};


Titanium.API.info("loading json...");

toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();
	
xhr.open("GET","http://nysenate.gov/front_carousel/json");
xhr.send();

Titanium.API.info("json request: " + xhr.status);

var xhrVideo = Ti.Network.createHTTPClient();


xhrVideo.onreadystatechange = function () {
	Titanium.API.info("json request - ready start: " + xhr.readyState);
	
	
};


xhrVideo.onload = function() {

	try
	{
		Titanium.API.info("got featured video data");

		var videoItem = JSON.parse(this.responseText).nodes[0];

		var BASEPATH = "http://nysenate.gov/";
	
		var imageUrlVideo = "http://img.youtube.com/vi/" + videoItem.node_data_field_video_field_video + "/0.jpg";
		
		Titanium.API.info("LOADING IMAGE " +imageUrlVideo);
	
	//	imageUrlVideo = IMAGE_RESIZER + escape(imageUrlVideo);
	
		var imageViewVideo = Titanium.UI.createImageView({
			url:imageUrlVideo,
			visible:true,
			canScale:true,
			width:200,
			height:160,
			left:60,
			backgroundColor:"#000000",
			borderColor:"#ffffff",
			borderWidth:3,
			top:220,
			opacity:0
		});
		
		var videoTitle = videoItem.node_title;
		var videoTitleMax = 18;
		if (videoTitle.length > videoTitleMax)
		{
			videoTitle = videoTitle.substring(0,videoTitleMax) + "...";
		}
			
		videoTitle = '"' + videoTitle + '"';
		
		var messageView4 = Titanium.UI.createView({
			bottom:3,
			backgroundColor:'transparent',
			height:20,
			width:300,
			left:10,
			borderRadius:0,
			opacity:0.8
		});

		var messageLabel4 = Titanium.UI.createLabel({
			color:'#fff',
			text:videoTitle,
			textAlign:'left',
			font:{fontSize:14},
			top:0,
			left:0,
			width:300,
			height:'auto'
		});

		messageView4.add(messageLabel4);
		win.add(messageView4);
		
		imageViewVideo.addEventListener('singletap', function(e)
		{
			playYouTube("Featured Video",videoItem.node_data_field_video_field_video);
			
		});
	
		Ti.UI.currentWindow.add(imageViewVideo);
		
		imageViewVideo.animate({opacity:1,duration:2000});
		
	}
	catch (E)
	{
		Titanium.API.debug(E);
		alert("Error connecting to NYSenate.gov");		
	}
};


Titanium.API.info("loading json...");

xhrVideo.open("GET","http://www.nysenate.gov/front_video/json");
xhrVideo.send();

/*

var xhrBlog = Ti.Network.createHTTPClient();


xhrBlog.onreadystatechange = function () {
	Titanium.API.info("json request - ready start: " + xhr.readyState);
	
	
};


xhrBlog.onload = function() {

	try
	{
		Titanium.API.info("got blog data: " + this.responseText);

		var jsonText = this.responseText;
		jsonText = jsonText.replace("\"1275497471\",","\"1275497471\"");
		
		var itemBlog = JSON.parse(jsonText).nodes[0];

		var BASEPATH = "http://nysenate.gov/";
	
			var imageUrl = BASEPATH + itemBlog.files_node_data_field_feature_image_filepath;
			imageUrl = imageUrl.replace("\/","/");
			imageUrl = imageUrl.replace(" ","%20");
			
		//	imageUrl = IMAGE_RESIZER + escape(imageUrl);
		
	
		var imageViewBlog = Titanium.UI.createImageView({
			url:imageUrl,
			visible:true,
			canScale:true,
			width:140,
			height:120,
			right:10,
			backgroundColor:"#000000",
			borderColor:"#ffffff",
			borderWidth:3,
			top:220,
			opacity:0
		});
		
		
			var blogTitle = itemBlog.node_title;
			var blogTitleMax = 18;
			if (blogTitle.length > blogTitleMax)
			{
				blogTitle = blogTitle.substring(0,blogTitleMax) + "...";
			}

			blogTitle = '"' + blogTitle + '"';

			var messageView5 = Titanium.UI.createView({
				bottom:3,
				backgroundColor:'transparent',
				height:20,
				width:170,
				right:5,
				borderRadius:0,
				opacity:0.8
			});

			var messageLabel5 = Titanium.UI.createLabel({
				color:'#fff',
				text:blogTitle,
				textAlign:'right',
				font:{fontSize:14},
				top:0,
				left:0,
				width:170,
				height:'auto'
			});

			messageView5.add(messageLabel5);
			win.add(messageView5);
			
		imageViewBlog.addEventListener('singletap', function(e)
		{

			showNYSenateContent(itemBlog.node_title,BASEPATH + "node/" + itemBlog.nid);
		});
	
		Ti.UI.currentWindow.add(imageViewBlog);
		
		imageViewBlog.animate({opacity:1,duration:2000});
		
		
	}
	catch (E)
	{
		Titanium.API.debug(E);
		alert("Error connecting to NYSenate.gov");	
	}
};


Titanium.API.info("loading json...");

xhrBlog.open("GET","http://www.nysenate.gov/front_content/blog/json");
xhrBlog.send();

*/