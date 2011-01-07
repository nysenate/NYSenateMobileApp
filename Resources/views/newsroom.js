Ti.include("../globals.js");
Ti.include("../inc/jssha256.js");
Ti.include("../inc/drupal_services.js");


var win = Ti.UI.currentWindow;
var newsTable = Titanium.UI.createTableView({});
var newsItems = [];

// click listener - when image is clicked
newsTable.addEventListener('click',function(e)
{
	

});

win.add(newsTable);

	
	
function loadTheNews()
{
	
		
	var serviceCallback = function(){
		parseNewsroomResponse(this.responseText);
	};
	
	doNYSenateServiceCall('views.get',['view_name'],['senate_updates'],serviceCallback);
	
}

function parseNewsroomResponse (responseText)
{
	newsItems = [];
		
	var data = JSON.parse('{"data":' + responseText + '}').data;
	
	
	 for (i = 0; i < data["#data"].length; i++)
	 {
		newsItems[i] = new Object();
		newsItems[i].title = data["#data"][i].title;
		newsItems[i].body = data["#data"][i].body;
		
	
		var row = addRow (newsItems[i]);
		newsTable.appendRow(row);
	}

	  
	
}


function addRow (newsItem)
{
	
	var rowHeight = 70;
			
	var row = Ti.UI.createTableViewRow({height:rowHeight});
	
	var labelTitle = Ti.UI.createLabel({
		text:newsItem.title,
		left:60,
		top:10,
		height:rowHeight,
		font:{fontSize:18}
	});
	row.add(labelTitle);
	/*
	if (newsItem.body.length > 0)
	{
		var labelSummary = Ti.UI.createLabel({
			text:processHtml(newsItem.body).substring(0,50),
			left:60,
			top:35,
			font:{fontSize:14}
		});
		row.add(labelSummary);
	}*/
	
	/*
	var cachedImage = getCachedFile(thumbnail);
				
	if (!cachedImage)
	{
		cacheFile(thumbnail);
		cachedImage = thumbnail;
	}
	
	var img = Ti.UI.createImageView({
		image:cachedImage,
		left:0,
		width:55,
		height:rowHeight
	});
	row.add(img);
	*/
	
	row.hasDetail = true;
	return row;

}
	


	
loadTheNews();

