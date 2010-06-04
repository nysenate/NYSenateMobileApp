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

		homeItems = JSON.parse(featuresJSON).nodes;

		var BASEPATH = "http://nysenate.gov/";
		
		
		var senImages = [];
		var cTransform = Ti.UI.create2DMatrix().scale(0.25);

		
		for (var c=0;c<homeItems.length;c++)
		{
			
			var imageUrl = BASEPATH + homeItems[c].files_node_data_field_feature_image_filepath;
			imageUrl = imageUrl.replace("\/","/");
			imageUrl = imageUrl.replace(" ","%20");
			
			senImages[c] = imageUrl;
			
			
		}
		
	

	var sWidth = Titanium.UI.currentWindow.size.width;
	var sHeight = Titanium.UI.currentWindow.size.height;

	senatorView = Titanium.UI.createCoverFlowView({
	    images:senImages,
		top:5,
		left:0,
		width:sWidth,
		height:sHeight,
		transform:cTransform
	});

	
		
	
		
		Ti.UI.currentWindow.add(senatorView);
		
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





