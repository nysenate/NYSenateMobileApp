Ti.include("../globals.js");

var SENATOR_THUMB_BASE = "http://nysenate.gov/files/imagecache/senator_teaser/profile-pictures/";
var SENATOR_FULL_BASE = "http://nysenate.gov/files/imagecache/teaser_featured_image/profile-pictures/";

var senatorItems = [];
var senatorRows = [];

var rowHeight = 40;

var senatorJsonUrl = "http://open.nysenate.gov/legislation/senators.json";

var xhr = Ti.Network.createHTTPClient();
xhr.setTimeout(30000);

var toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading Senators...';

senatorView = Titanium.UI.createTableView({
	backgroundColor:"#ffffff",
	left:0
	//opacity:.8,
	
});
	

	// click listener - when image is clicked
	senatorView.addEventListener('click',function(e)
	{
		Titanium.API.info("image clicked: "+e.index + ": nodeid=" + senatorItems[e.index].nid);

		var newWin = Titanium.UI.createWindow({
			url:'senator.js',
			title:senatorItems[e.index].senator.name,
			nid:senatorItems[e.index].senator.key,
			senatorUrl:senatorItems[e.index].senator.url,
			senatorName:senatorItems[e.index].senator.name,
			senatorImage:senatorItems[e.index].senator.imageUrlLarge,
			senatorKey:senatorItems[e.index].senator.name,
			senatorDistrict:senatorItems[e.index].senator.district,
			backgroundImage:'../img/bg/wood.jpg'
		
		});

		Titanium.UI.currentTab.open(newWin,{animated:true});
	
	});

	

Titanium.UI.currentWindow.add(senatorView);

if (Titanium.Platform.name == 'iPhone OS')
{

	var btnSearch = Titanium.UI.createButton({
		title:'By Address'
	});
	
	
	btnSearch.addEventListener('click',function()
	{
		var winSearch = Titanium.UI.createWindow({
			url:'findsenator.js',
			title:'Senator Search',
			barColor:DEFAULT_BAR_COLOR,
			backgroundImage:'../img/bg/wood.jpg'
	
		});
	
		Titanium.UI.currentTab.open(winSearch,{animated:true});
	
	});
			
	Titanium.UI.currentWindow.rightNavButton = btnSearch;
}
else
{
	var tb1 = null;
	 
	var menuHandler = function() {
		tb1.addEventListener('click', function() {
			var winSearch = Titanium.UI.createWindow({
				url:'findsenator.js',
				title:'Senator Search',
				barColor:DEFAULT_BAR_COLOR,
				backgroundImage:'../img/bg/Default.png'

			});
			Titanium.UI.currentTab.open(winSearch,{animated:true});

		});
	};
	 
	var activity = Ti.Android.currentActivity;
	activity.onCreateOptionsMenu = function(e) {
		var menu = e.menu;
		tb1 = menu.add({title : 'Find Your Senator'});
		menuHandler();
	};

}
	

function loadSenators()
{
	

	if (senatorItems && senatorItems.length > 0)
	{
		//Ti.API.debug("got cached senator items");
		
			senatorRows = [];
			
			for (i = 0; i < senatorItems.length; i++)
			{
				senatorRows[i] = loadSenatorRow (i, senatorItems[i].senator.name, senatorItems[i].senator.district, senatorItems[i].senator.imageUrl);
						
			}
			
			senatorView.data = senatorRows;
	}
	else
	{
		Ti.API.debug("loading senators...");
	
		
		xhr.onerror = function (e)
		{
			Titanium.API.debug("got xhr error: " + e);
			
			toolActInd.hide();
				
			//alert(e);
			Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the senator data. Please try again later.'}).show();
			
		};
		
		xhr.onload = function()
		{
		//	Titanium.API.debug("got resp: "  +this.responseText);
			toolActInd.hide();

			cacheFile("senatorsJson",this.responseText);

			parseSenatorResponse(this.responseText);
		}
		
		
		toolActInd.show();

		xhr.open("GET",senatorJsonUrl);
		xhr.send();

	}
}

function parseSenatorResponse (responseText)
{

	senatorItems = JSON.parse('{"data":' + responseText + '}').data;
		
	//Titanium.API.debug("got senator items: " + senatorItems.length);

	
	for (i = 0; i < senatorItems.length; i++)
	 {
	 	
	 	
	 	var imageUrl = senatorItems[i].senator.imageUrl;
	 	
	 	var idx = imageUrl.lastIndexOf("/");
	 	imageUrl = imageUrl.substring(idx+1);
	 	
		 senatorItems[i].senator.imageFileName = imageUrl;
	
		senatorItems[i].senator.imageUrl = "../img/senators/" + escape(senatorItems[i].senator.imageFileName);

		if (senatorItems[i].senator.key == "lanza")
		{
					senatorItems[i].senator.imageUrl = "../img/senators/" + senatorItems[i].senator.key + "-" + escape(senatorItems[i].senator.imageFileName);
		}
		
		Ti.API.debug(senatorItems[i].senator.imageUrl);
		
	 	//senatorItems[i].senator.imageUrl = SENATOR_THUMB_BASE + escape(imageUrl);
		senatorItems[i].senator.imageUrlLarge = SENATOR_FULL_BASE + escape(imageUrl);

		senatorItems[i].senator.district = senatorItems[i].senator.district.split(' ')[3];
		senatorRows[i] = loadSenatorRow (i, senatorItems[i].senator.name, senatorItems[i].senator.district, senatorItems[i].senator.imageUrl);

		//senatorView.appendRow(senatorRows[i]);
		
	}

	senatorView.data = senatorRows;

}

function loadSenatorRow (rowIdx, name, district, thumbnail)
{
	
	var rowHeight = 70;
			
	var row = Ti.UI.createTableViewRow({
		height:rowHeight,
		color:"#000000",
		font:{fontSize:18}
	});
	
	
	var labelTitle = Ti.UI.createLabel({
		text:name,
		left:60,
		top:10,
		height:25,
		color:"#000000",
		font:{fontSize:18}
	});
	row.add(labelTitle);
	
	if (district.length > 0)
	{
		var labelSummary = Ti.UI.createLabel({
			text:"District " + district,
			left:60,
			top:35,
			color:"#333333",
			font:{fontSize:14}
		});
		row.add(labelSummary);
	}
	
	//Ti.API.debug("loading image: " + thumbnail);
		var img = Ti.UI.createImageView({
			image:thumbnail,
			top:0,
			left:0,
			width:55,
			height:rowHeight
		});
		
		row.add(img);
			
			
	/*
	var cachedImage = getCachedFile(thumbnail);
				
	if (!cachedImage)
	{
		Ti.API.debug("could not find cached file: " + thumbnail);
		
		cacheFile(thumbnail,null, function doit(fileUrl, savedFile)
		{
			Ti.API.debug("got cache file callback for: " + fileUrl);

			var img = Ti.UI.createImageView({
				image:savedFile.read(),
				top:0,
				left:0,
				width:55,
				height:rowHeight
			});
		
			row.add(img);
			
			
			//senatorRows[i].leftImage = savedFile.read();
			//senatorView.updateRow(i,row);
			
		});
	}
	else
	{
		//Ti.API.debug("loading image: " + thumbnail);
		var img = Ti.UI.createImageView({
			image:cachedImage,
			top:0,
			left:0,
			width:55,
			height:rowHeight
		});
		
		row.add(img);
			
		//row.leftImage = cachedImage;
		//senatorView.updateRow(i,row);
	}*/
	
	
		
	row.hasDetail = true;
	
	
	return row;

}
	
	
loadSenators();

/*
{"districtUrl":"http://www.nysenate.gov/district/20",
"senator":{
	"offices":[{"id":1,"zip":"","phone":"(518) 455-2431","lon":42.652855,"fax":"(518) 426-6856","officeName":"Albany Office","street":"188 State Street ","state":"NY","contact":"eadams@senate.state.ny.us","lat":-73.759091,"city":"Albany"},
	{"id":2,"zip":"","phone":"(718) 284-4700","lon":40.659736,"fax":"(718) 282-3585","officeName":"District Office","street":"572 Flatbush Avenue","state":"NY","contact":"eadams@senate.state.ny.us","lat":-73.960689,"city":"Brooklyn"}],
	"imageUrl":"http://www.nysenate.gov/files/imagecache/senator_teaser/profile-pictures/(02-04-09) Adams-HS-059NEW HEADSHOT_1.JPG",
	"social":{"flickr":"","twitter":"http://twitter.com/NYSSenAdams","faceBook":"http://www.facebook.com/pages/New-York-State-Senator-Eric-Adams/80559174013",
	"youtube":"","rss":"http://www.nysenate.gov/senator/eric-adams/content/feed",
	"contact":"eadams@senate.state.ny.us"},
	"name":"Eric Adams","district":"State Senate District 20",
	"contact":"eadams@senate.state.ny.us","key":"adams","url":"http://www.nysenate.gov/senator/eric-adams"},
	"district":"State Senate District 20"}
*/

