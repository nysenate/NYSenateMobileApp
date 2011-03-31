Ti.include("../globals.js");
Ti.include("../inc/jssha256.js");
Ti.include("../inc/drupal_services.js");

var urlRegex = new RegExp("http:\\/\\/\\S+\\.[jJ][pP][eE]?[gG]", "g");
//var urlRegex = new RegExp("((?:(?:https?|ftp|file)://|www.|ftp.)[-A-Z0-9+&@#/%=~|$?!:,.][A-Z0-9+&@#/%=~_|$]+.(jpg|png|gif|jpeg|bmp))(?!([^<]+)?>)");
var win = Ti.UI.currentWindow;
var newsTable = Titanium.UI.createTableView({
	
backgroundColor:"#ffffff"
});
var newsItems = [];


win.add(newsTable);

function loadTheNews()
{
	
	showLoadingDialog("Loading","Loading News...");
	var serviceCallback = function(){
		parseNewsroomResponse(this.responseText);
	};
	
	doNYSenateServiceCall('views.get',['view_name'],['senate_updates'],serviceCallback);
	
}

function parseNewsroomResponse (responseText)
{

	hideLoadingDialog();

	newsItems = [];

	//Ti.API.info(responseText);
		
	var data = JSON.parse('{"data":' + responseText + '}').data;

	

	 for (i = 0; i < data["#data"].length; i++)
	 {
		var item = data["#data"][i];
		newsItems[i] = new Object();
		newsItems[i].title = item.title;
		newsItems[i].body = item.body;
		newsItems[i].link = "http://nysenate.gov/" + item.path;

		
			
			if (item.field_video && item.field_video.length > 0 && item.field_video[0].data.thumbnail)
			{
				newsItems[i].thumbnail = item.field_video[0].data.thumbnail.url;
				
				//link = item.field_video[0].embed;
				link = item.field_video[0].value;
				
			}
			else
			{

				try
				{
					//Ti.API.info("checking for images in desc text");

					var descImages = newsItems[i].body.match(urlRegex);
					if (descImages)
					{
						for (dIdx = 0; dIdx < descImages.length; dIdx++)
						{
							//Ti.API.debug("found match: " + descImages[dIdx]);
							newsItems[i].thumbnail = descImages[dIdx];
		
						}
					}
	

				}
				catch (err)
				{

					Titanium.API.error(err);
				}
			}		

	
		var row = addRow (newsItems[i]);
		newsTable.appendRow(row);
	}

	newsTable.addEventListener('click',function(e)
	{
	
		if (e.row.url)
			showNYSenateContent(e.row.pageTitle,e.row.url,Ti.UI.currentWindow.detailView);
	
	});
	
}


function addRow (newsItem)
{
	
	var rowHeight = 70;
			
	var row = Ti.UI.createTableViewRow({height:rowHeight});
	
	row.url = newsItem.link;
	row.pageTitle = newsItem.title;

	var labelTitle = Ti.UI.createLabel({
		text:newsItem.title,
		left:60,
		top:1,
		height:rowHeight * .6,
		font:{fontSize:18},
		color:'#333333'
	});
	row.add(labelTitle);


	if (newsItem.thumbnail)
	{
		var cachedImage = getCachedFile(newsItem.thumbnail);
				
		if (!cachedImage)
		{
			cacheFile(newsItem.thumbnail);
			cachedImage = newsItem.thumbnail;
		}
	
		var img = Ti.UI.createImageView({
			image:cachedImage,
			left:0,
			width:55,
			height:rowHeight
		});
		row.add(img);
	}
	else
	{
		labelTitle.left = 3;

	}

	row.hasDetail = true;
	return row;

}
	


	
loadTheNews();

