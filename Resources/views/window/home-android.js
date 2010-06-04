Ti.include("../../inc/globals.js");

var data = [];

//
// SETUP WINDOW STYLES
//
var win = Ti.UI.currentWindow;

toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();
	

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


	toolActInd.hide();
		win.setToolbar(null,{animated:true});
		
		var alertOff = Titanium.UI.createAlertDialog({
			title:'Network Error',
			message:'Unable to connect to NYSenate.gov.\nPlease try again later.',
			 buttonNames: ['OK']
			
		});
		
		alertOff.show();
	
};

xhr.onload = function() {

	loadFeatures(this.responseText);
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
		
			var row = Ti.UI.createTableViewRow({height:120});
		
			//row.url = link;
			row.guid = item.nid;
			row.ntitle = item.node_title;
			
			
			var labelTitle = Ti.UI.createLabel({
				text:item.node_title,
				left:165,
				top:10,
				font:{fontSize:18}
			});
			row.add(labelTitle);
		
		
			var img = Ti.UI.createImageView({
				url:imageUrl,
				left:0,
				width:160,
				canScale:true,
				enableZoomControls:false
			});
			row.add(img);
			
			data[c] = row;
			
		
		}
		
		tableview = Titanium.UI.createTableView({
			data:data
		});
		
		Titanium.UI.currentWindow.add(tableview);
		tableview.addEventListener('click',function(e)
		{
			
					showNYSenateContent(e.rowData.ntitle,"http://nysenate.gov/node/" + e.rowData.guid);
		
		});
		
		
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
		

};


/*
*/

Titanium.API.info("loading json...");

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
			width:140,
			height:120,
			left:10,
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
		
		
		imageViewVideo.addEventListener('singletap', function(e)
		{
			playYouTube("Featured Video",videoItem.node_data_field_video_field_video);
			
		});
	
	
		
	}
	catch (E)
	{
		Titanium.API.debug("error: " + E);
		alert(E);	
	}
};


/*
*/

Titanium.API.info("loading json...");

xhrVideo.open("GET","http://www.nysenate.gov/front_video/json");
xhrVideo.send();



var xhrBlog = Ti.Network.createHTTPClient();


xhrBlog.onreadystatechange = function () {
	Titanium.API.info("json request - ready start: " + xhr.readyState);
	
	
};


xhrBlog.onload = function() {

	try
	{
		Titanium.API.info("got blog data");

		var itemBlog = JSON.parse(this.responseText).nodes[0];

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

	
		imageViewBlog.addEventListener('singletap', function(e)
		{

			showNYSenateContent(itemBlog.node_title,BASEPATH + "node/" + itemBlog.nid);
		});
	
		
	}
	catch (E)
	{
		Titanium.API.debug("error: " + E);
		alert(E);	
	}
};


/*
*/

Titanium.API.info("loading json...");

xhrBlog.open("GET","http://www.nysenate.gov/front_content/blog/json");
xhrBlog.send();

