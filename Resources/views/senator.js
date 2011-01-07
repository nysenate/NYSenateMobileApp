Ti.include("../globals.js");

var win = Titanium.UI.currentWindow;
var IMAGE_RESIZER = "http://nysenatemobile.appspot.com/servlet/ImageResizer?url=";


var senatorName = win.senatorName;
var senatorImage = win.senatorImage;
var senatorKey = win.senatorKey;
var senatorDistrict = win.senatorDistrict;
var senatorNodeId = win.nid;
var senatorUrl = win.senatorUrl;

var twitter = win.twitter;
var facebook = win.facebook;
var youtube = win.youtube;

var senatorTitleText = "Senator\n" + senatorName + "\n" + "District " + senatorDistrict;


var senSearchKey = senatorName;

senSearchKey = senSearchKey.replace("Jr.","");
senSearchKey = senSearchKey.replace("Jr","");
senSearchKey = senSearchKey.replace("Sr.","");
senSearchKey = senSearchKey.replace("Sr","");
senSearchKey = senSearchKey.replace(".","");

var legSearchKey = senatorKey;
legSearchKey = legSearchKey.replace("-jr","");
legSearchKey = legSearchKey.replace("-sr","");
legSearchKey = legSearchKey.substring(legSearchKey.lastIndexOf("-")+1);

/*
var cachedImage = getCachedFile(senatorImage);
				
	if (!cachedImage)
	{
		cacheFile(senatorImage);
		cachedImage = senatorImage;
	}
	*/
	
var imgSenator = Titanium.UI.createImageView({
	url:senatorImage,
	width:85,
	height:112,
	top:10,
	left:10,
	visible:true,
	backgroundColor:"#ffffff",
	borderColor:"#ffffff",
	borderWidth:5
});

 
imgSenator.addEventListener('singletap',function(e)
{
	var senatorImageFull = senatorImage.replace("files/imagecache/teaser_featured_image/","files/imagecache/full_node_featured_image/" );

	var htmlData = '<html><head><style>.links, .share_links { display: none;} body {margin:0px;padding:0px;font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><center><img src="' + senatorImageFull + '" width="100%"/></center></body></html>';
	showHTMLContent(senatorTitleText,senatorImageFull,htmlData);
		
});

win.add(imgSenator);

var messageLabel = Titanium.UI.createLabel({
	color:'#fff',
	text:senatorTitleText,
	left:105,
	width:205,
	top:20,
	height:'auto',
	font:{fontSize:20}
	
});

win.add(messageLabel);

// create table view data object
var tdata = null;

if (isiOS4Plus())
	{
tdata = [
	{title:'Contact Information',hasChild:true,link:senatorUrl + "/contact"},
	{title:'View District Map',hasChild:true,title:'District Map',kml:'http://geo.nysenate.gov/maps/kml/sd' + senatorDistrict + '.kml?key=YgiZWjKgealrvSlyDMQRMYEaNLv2fFiz'},	
	{title:"Latest News & Updates",hasChild:true, rss:senatorUrl+ "/content/feed"},
	{title:'Sponsored Bills',hasChild:true,olterm:"sponsor:"+legSearchKey + " AND otype:bill AND (oid:S* or oid:A*)"},
	{title:'Chaired Meetings',hasChild:true,olterm:"chair:"+legSearchKey + " AND otype:meeting"},
	{title:'All Legislative Activity',hasChild:true,olterm:legSearchKey},
	{title:'Biography',hasChild:true,link:senatorUrl + "/bio"}
];
}
else
{
	tdata = [
	{title:'Contact Information',hasChild:true,link:senatorUrl + "/contact"},	
    {title:'View District Map',hasChild:true,title:'District Map',elink:'http://www.nysenate.gov/files/imagecache/district_map/' + senatorDistrict + '_small_0.png'},
	{title:"Latest News & Updates",hasChild:true, rss:senatorUrl+ "/content/feed"},
	{title:'Sponsored Bills',hasChild:true,olterm:"sponsor:"+legSearchKey + " AND otype:bill AND (oid:S* or oid:A*)"},
	{title:'Chaired Meetings',hasChild:true,olterm:"chair:"+legSearchKey + " AND otype:meeting"},
	{title:'All Legislative Activity',hasChild:true,olterm:legSearchKey},
	{title:'Biography',hasChild:true,link:senatorUrl + "/bio"}
];

}

if (twitter && twitter != "null")
{
var row = new Object();
row.title = "Twitter Feed";
row.hasChild = true;
row.link = twitter;
tdata[tdata.length] = row;

//tdata[tdata.length] = {title:'Twitter Feed',hasChild:true,link:twitter};
	
}


if (facebook && facebook != "null")
{

var row = new Object();
row.title = "Facebook Page";
row.hasChild = true;
row.link = facebook;
tdata[tdata.length] = row;


//tdata[tdata.length] = {title:'Facebook Page',hasChild:true,link:facebook};

}


// create table view
var tableViewOptions = {
		data:tdata,
	top:130,
	left:0,
	visible:true
	};




var tableview = Titanium.UI.createTableView(tableViewOptions);

var subWin;

// create table view event listener
tableview.addEventListener('click', function(e)
{
	
	if (e.rowData.ilink)
	{
			subWin = Titanium.UI.createWindow({
				url:e.rowData.ilink,
				title:e.rowData.title
			});

			subWin.barColor = DEFAULT_BAR_COLOR;
			Titanium.UI.currentTab.open(subWin,{animated:true});
	}
	else if (e.rowData.elink)
	{
		showWebModal(e.rowData.title,e.rowData.elink);
	}
	else if (e.rowData.link)
	{
		showNYSenateContent(e.rowData.title,e.rowData.link);
	}
	else if (e.rowData.kml)
	{
		subWin = Titanium.UI.createWindow({
			url:'../inc/map.js',
			kml:e.rowData.kml,
			title:e.rowData.title
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
	else if (e.rowData.olterm)
	{
		subWin = Titanium.UI.createWindow({
			url:'olsearch.js',
			title:e.rowData.title,
			olterm:e.rowData.olterm
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
	else if (e.rowData.vsearch)
	{
		subWin = Titanium.UI.createWindow({
			url:'../inc/youtube.js',
			title:e.rowData.title,
			search:e.rowData.vsearch
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
	else if (e.rowData.rss)
	{
		subWin = Titanium.UI.createWindow({
			url:'../inc/rss.js',
			title:e.rowData.title,
			rss:e.rowData.rss
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);