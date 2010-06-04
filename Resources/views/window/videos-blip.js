

Ti.include("../../inc/globals.js");



var win = Titanium.UI.currentWindow;

	var toolActInd = Titanium.UI.createActivityIndicator();
	toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	toolActInd.color = 'white';
	toolActInd.message = 'Loading videos...';
	win.setToolbar([toolActInd],{animated:true});
	toolActInd.show();


// create table view data object
var data = [];

var listUrl = "http://nysenate.blip.tv/posts/?skin=json";

var xhr = Ti.Network.createHTTPClient();


xhr.onload = function()
{
	
	try
	{
		//Titanium.API.info(this.responseText);
		
		var items = JSON.parse(this.responseText);
		var x = 0;

		for (var c=0;c<items.length;c++)
		{
			var item = items[c].Post;
			
		
				var itemId = item.postsId;
				var summary = item.description;
			
				var media = item.thumbnailUrl;
				
				var row = Ti.UI.createTableViewRow({height:80});
				
				row.url = item.mediaUrl;
				
				row.pageTitle = title;
				
				var labelTitle = Ti.UI.createLabel({
					text:title,
					left:35,
					top:10,
					height:40,
					color:"#000000",
					font:{fontSize:14}
				});
				row.add(labelTitle);
				
				var labelSummary = Ti.UI.createLabel({
					text:summary,
					left:35,
					top:45,
					color:"#555555",
					font:{fontSize:11}
				});
				row.add(labelSummary);
				
			
				var img = Ti.UI.createImageView({
					url:media,
					left:5,
					height:26,
					width:26
				});
				row.add(img);
				
				data[x++] = row;
			
		}
		
		var tableview = Titanium.UI.createTableView({
			data:data
			});
			
		Titanium.UI.currentWindow.add(tableview);
		
		tableview.addEventListener('click',function(e)
		{
			var w = Ti.UI.createWindow({
					title:"Video",
					barColor:DEFAULT_BAR_COLOR
				});
				
			var wb = Ti.UI.createWebView({url:e.row.url});
			
			w.add(wb);
			var b = Titanium.UI.createButton({
				title:'Close',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			w.setLeftNavButton(b);
			b.addEventListener('click',function()
			{
				w.close();
			});
			w.open({modal:true});
		});
	}
	catch(E)
	{
		alert(E);
	}
	
	
		toolActInd.hide();
		win.setToolbar(null,{animated:true});
};

xhr.setTimeout(30000);
xhr.open("GET",listUrl);
xhr.send();




