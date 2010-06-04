Ti.include("../../inc/globals.js");

var OL_ITEM_BASE = 'http://open.nysenate.gov/api/1.0/mobile/';


var win = Titanium.UI.currentWindow;

var toolActInd = Titanium.UI.createActivityIndicator();
//toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Searching legislative data...';
win.setToolbar([toolActInd],{animated:true});
toolActInd.show();

// create table view data object
var data =[];

var listUrl = "http://open.nysenate.gov/legislation/search/?";

if (Titanium.UI.currentWindow.oltype)
{
	var oltype = Titanium.UI.currentWindow.oltype;
	listUrl += "&type=" + oltype;
}

if (Titanium.UI.currentWindow.olterm)
{
	var olterm = Titanium.UI.currentWindow.olterm;
	listUrl += "&term=" + escape(olterm);
}

/*
var pageIdx = "1";
var pageSize = "50";

if (Titanium.UI.currentWindow.pageIdx)
{
	pageIdx = Titanium.UI.currentWindow.pageIdx + "";
}

if (Titanium.UI.currentWindow.pageSize)
{
	pageSize = Titanium.UI.currentWindow.pageSize + "";
}

listUrl += "&format=json&sort=when&sortOrder=true&pageIdx=" + pageIdx + "&pageSize=" + pageSize;
*/

listUrl += "&format=json&sort=when&sortOrder=true&pageIdx=1&pageSize=50";

var xhr = Ti.Network.createHTTPClient();
xhr.setTimeout(30000);

xhr.onerror = function (e)
{
	Titanium.API.debug("got xhr error: " + e);
	
	toolActInd.hide();
	win.setToolbar(null,{animated:true});
		
	//alert(e);
	Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the legislative data. Please try again later.'}).show();
	
};

xhr.onload = function()
{
	
	try
	{
		Titanium.API.debug("got xhr resp for: " + listUrl);
		
		var items = JSON.parse('{"results":' + this.responseText + '}').results;
		
		var c;
		var x = 0;

		var greyBg = false;
		
		for (c in items)
		{
			var item = items[c];
			
			Titanium.API.debug("viewing item: " + c);
			
			var	itemType = item.type;
			var title = item.type.toUpperCase();
			
			if (itemType == "bill")
			{
				title += " (" + item.id + ")";
			}
			else if (itemType == "action" || itemType == "bill")
			{
				title += " (" + item.billno + ")";
			}
			
			title += ": " + item.title;
			var itemId = item.id;
			var summary = item.summary;
		
			var media = "../../img/btn/" + itemType + ".png";
			
			var row = Ti.UI.createTableViewRow({height:80});
			row.hasDetail = true;
			
			if (Titanium.Platform.name == 'iPhone OS')
			{
				if (greyBg)
				{
					row.backgroundColor="#eeeeee";
				}
				else
				{
					row.backgroundColor = "#ffffff";
				}
					
			
			}
			else
			{
				if (greyBg)
				{
					row.backgroundColor="#000000";
				}
				else
				{
					row.backgroundColor = "#333333";
				}
			}
			
				greyBg = !greyBg;
			
			if (itemType == "action" || itemType == "vote")
			{
				itemType = "bill";
				itemId = item.billno;
			}
				
			row.url = "http://open.nysenate.gov/legislation/api/1.0/mobile/" + itemType + "/" + escape(itemId);
			row.pageTitle = title;
			
			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:5,
				top:5,
				height:40,
				font:{fontSize:16}
			});
			row.add(labelTitle);
			
			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:5,
				top:50,
				font:{fontSize:11}
			});
			row.add(labelSummary);
			
			/*
			var img = Ti.UI.createImageView({
				url:media,
				left:5,
				height:26,
				width:26
			});
			row.add(img);*/
			
			data[x++] = row;
			
		}
		
		Titanium.API.debug("creating table view");

		var tableview = Titanium.UI.createTableView({
			data:data
		});
			
		Titanium.UI.currentWindow.add(tableview);
		
		tableview.addEventListener('click',function(e)
		{
			
			var wTitle = e.row.pageTitle;
			var wUrl = e.row.url;
			
			showWebModal(wTitle,wUrl);
		
		
		});
	}
	catch(E)
	{
		Titanium.API.debug("got xhr error processing response: " + E);
		
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the legislative data. Please try again later.'}).show();
	
	}
	
	
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
};


xhr.open("GET",listUrl);
xhr.send();




