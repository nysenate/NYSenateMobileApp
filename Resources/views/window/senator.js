Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;


var senatorName = win.senatorName;
var senatorImage = win.senatorImage;
var senatorKey = win.senatorKey;
var senatorDistrict = win.senatorDistrict;
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


var imgSenator = Titanium.UI.createImageView({
	url:senatorImage,
	width:90,
	height:112,
	top:10,
	left:10,
	visible:true,
	backgroundColor:"#ffffff",
	borderColor:"#ffffff",
	borderWidth:5
});

win.add(imgSenator);

var messageLabel = Titanium.UI.createLabel({
	color:'#fff',
	text:senatorTitleText,
	left:110,
	width:200,
	top:20,
	height:'auto'
	
});

win.add(messageLabel);

// create table view data object
var tdata = [
	{title:"Latest News & Updates",hasChild:true, rss:"http://www.nysenate.gov/senator/" + senatorKey + "/content/feed"},
	{title:'Legislative Activity',hasChild:true,olterm:legSearchKey},
	{title:'Contact Information',hasChild:true,link:"http://www.nysenate.gov/senator/" + senatorKey + "/contact"},
	{title:'Biography',hasChild:true,link:"http://www.nysenate.gov/senator/" + senatorKey + "/bio"},
	{title:'Senate Videos',hasChild:true,vsearch:senSearchKey}
];

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
	else if (e.rowData.olterm)
	{
		subWin = Titanium.UI.createWindow({
			url:'olsearch-json.js',
			title:e.rowData.title,
			olterm:e.rowData.olterm
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
	else if (e.rowData.vsearch)
	{
		subWin = Titanium.UI.createWindow({
			url:'videos.js',
			title:e.rowData.title,
			search:e.rowData.vsearch
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
	else if (e.rowData.rss)
	{
		subWin = Titanium.UI.createWindow({
			url:'rss.js',
			title:e.rowData.title,
			rss:e.rowData.rss
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
	

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);