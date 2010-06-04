Ti.include("../../inc/globals.js");

var win = Titanium.UI.currentWindow;

var listUrl = Titanium.UI.currentWindow.rss;

var xhr = Ti.Network.createHTTPClient();

xhr.onload = function()
{
	
	var doc;
	

	if (!this.responseXML)
	{
		doc = Titanium.XML.parseString(this.responseText).documentElement;
	}
	else
	{
		doc = this.responseXML.documentElement;
	}

	
	var items = doc.getElementsByTagName("item");
	var x = 0;
	var c;
	var item;
	// create table view data object
	var data = [];

	Titanium.API.debug("viewing items: " + items.length);

	for (c = 0; c < items.length; c++)
	{
		try
		{
			item = items.item(c);
		
			var title = item.getElementsByTagName("title").item(0).text;
			
			Titanium.API.debug("parsing item: " + title);

			var summary = "Published " + item.getElementsByTagName("pubDate").item(0).text;
			
			var row = Ti.UI.createTableViewRow({height:80});
			
			row.hasChild = true;
			row.htmlTitle = title;
			
			row.url = item.getElementsByTagName("link").item(0).text;
			row.htmlview = item.getElementsByTagName("description").item(0).text;
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:5,
				top:10,
				height:40,
				font:{fontSize:16}
			});
			row.add(labelTitle);
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:5,
				top:45,
				font:{fontSize:11}
			});
			row.add(labelSummary);
			
			
			
			/*
			 //		var media = thumbnails.item(0).getAttribute("url");

			var img = Ti.UI.createImageView({
				url:media,
				left:5,
				height:60,
				width:60
			});
			row.add(img);
			*/
			
			data[x++] = row;
		}
		catch (E)
		{
			Titanium.API.debug("error parsing item: " + E);

			alert(E);
		}
	}
	
	var tableview = Titanium.UI.createTableView({data:data});
	Titanium.UI.currentWindow.add(tableview);
	
	tableview.addEventListener('click',function(e)
	{
		
		var htmlData =  e.row.htmlview;
		htmlData = '<html><head><style>.links, .share_links { display: none;} body {font-family:"Helvetica";} h1, h2{color:#012849;} a:link,a:visited{color:#5E4D42;} .imagecache-full_node_featured_image {width:280px;max-height:200px;}</style><meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" /> <meta name="apple-mobile-web-app-capable" content="YES"></head><body><h2>' + e.row.htmlTitle + '</h2>' + htmlData + '</body></html>';
		showHTMLContent(e.row.htmlTitle,e.row.url,htmlData);
	
	});


	toolActInd.hide();
	win.setToolbar(null,{animated:true});
	
};


var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Connecting to feed...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

xhr.open("GET",listUrl);
xhr.send();




