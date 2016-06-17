/*
Ti.include("../globals.js");
Ti.include("../inc/jssha256.js");
Ti.include("../inc/drupal_services.js");

var win = Titanium.UI.currentWindow;
var tableview;
// create table view data object
var data = [];

var toolActInd = Titanium.UI.createActivityIndicator();
toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
toolActInd.color = 'white';
toolActInd.message = 'Loading videos...';
toolActInd.show();

function loadVideos(searchTerm)
{
	toolActInd.show();

	var serviceCallback = function(){
		parseVideoResponse(this.responseText);
	};

	doNYSenateServiceCall('views.get',['view_name'],['video_archives'],serviceCallback);


}

function parseVideoResponse (responseText)
{
		var items = JSON.parse('{"data":' + responseText + '}').data["#data"];

		for (i = 0; i < items.length; i++)
		{

			var guid = link.substring(link.indexOf("?v=")+3);
			guid = guid.substring(0,guid.indexOf("&"));


			var thumbnail = "http://i.ytimg.com/vi/" + guid + "/2.jpg";

			var row = Ti.UI.createTableViewRow({height:80});

			row.url = link;
			row.guid = guid;
			row.videotitle = title;
			row.backgroundColor="#000000";
			row.color ="#ffffff";


			var labelTitle = Ti.UI.createLabel({
				text:title,
				left:105,
				top:10,
				height:40,
				font:{fontSize:16},
				color:"#ffffff"
			});
			row.add(labelTitle);

			var labelSummary = Ti.UI.createLabel({
				text:summary,
				left:105,
				top:45,
				font:{fontSize:12},
				color:"#ffffff"
			});
			row.add(labelSummary);

			var img = Ti.UI.createImageView({
				url:thumbnail,
				left:0,
				height:80,
				width:100
			});
			row.add(img);

			data[x++] = row;

		}

		if (tableview)
		{
			tableview.setData(data);
		}
		else
		{
			tableview = Titanium.UI.createTableView({
			data:data,
			backgroundColor:"#000000",
			separatorColor:"#000000",
			top:45
			});

			Titanium.UI.currentWindow.add(tableview);
			tableview.addEventListener('click',function(e)
			{

					playYouTube(e.row.videotitle,e.row.guid);

			});

			var btnSearch = Titanium.UI.createButton({
				title:'Search',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});


			var search = Titanium.UI.createSearchBar({
				barColor:'#000',
				showCancel:false,
				hintText:'enter keywords to search',
				height:43,
				top:0
			});

			Titanium.UI.currentWindow.rightNavButton = btnSearch;

			btnSearch.addEventListener('click',function()
			{
				search.visible = true;

			});


			//
			// SEARCH BAR EVENTS
			//
			search.addEventListener('change', function(e)
			{
			//	Titanium.API.info('search bar: you type ' + e.value + ' act val ' + search.value);

			});
			search.addEventListener('cancel', function(e)
			{
				Titanium.API.info('search bar cancel fired');
			    search.blur();
				//search.visible = false;

			});
			search.addEventListener('return', function(e)
			{
			//	Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
			 	search.blur();
			//	search.visible = false;

				loadVideos (search.value);

			});
			search.addEventListener('focus', function(e)
			{
			   	Titanium.API.info('search bar: focus received');
			});
			search.addEventListener('blur', function(e)
			{
			   	Titanium.API.info('search bar:blur received');
			});


			Titanium.UI.currentWindow.add(search);
		}
	}
	catch(E)
	{
	//	alert(E);
		Titanium.API.debug(E);
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'No videos were found for this search.'}).show();


	}

		toolActInd.hide();
};


loadVideos();
*/