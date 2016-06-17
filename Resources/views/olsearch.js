Ti.include("../globals.js");

var OL_ITEM_BASE = 'http://open.nysenate.gov/api/1.0/mobile/';


var win = Titanium.UI.currentWindow;



// create table view data object
var data =[];
var tableview;

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

showLoadingDialog("Searching","Connecting to Open Legislation...");


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

listUrl += "&format=json&sort=modified&sortOrder=true&pageIdx=1&pageSize=50";

var xhr = Ti.Network.createHTTPClient();
xhr.setTimeout(30000);

xhr.onerror = function (e)
{
	Titanium.API.debug("got xhr error: " + e);

	hideLoadingDialog();

	//alert(e);
	Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the legislative data. Please try again later.'}).show();

};

xhr.onload = function()
{

	try
	{

		//Titanium.API.info("got xhr resp for: " + this.status + "=" + this.responseText);

		if (!this.responseText || this.status == 404)
		{
				Titanium.UI.createAlertDialog({title:'NY Senate', message:'There were no matching items for your search'}).show();

		}
		else
		{

			var items = JSON.parse('{"results":' + this.responseText + '}').results;

			var c;
			var x = 0;

			var greyBg = false;

			if (items.length == 0)
			{
				var row = Ti.UI.createTableViewRow({height:80});
				row.hasDetail = false;
				row.title = "No matching results";
				row.text = "No matching results";
				data[x++] = row;
			}

			for (c in items)
			{
				var item = items[c];

			//	Titanium.API.debug("viewing item: " + c);

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

				if (greyBg)
				{
					row.backgroundColor="#eeeeee";
				}
				else
				{
					row.backgroundColor = "#ffffff";
				}

				greyBg = !greyBg;

				if (itemType == "action" || itemType == "vote")
				{
					itemType = "bill";
					itemId = item.billno;
				}

				row.url = "http://open.nysenate.gov/legislation/api/1.0/mobile/" + itemType + "/" + escape(itemId);
				row.pageTitle = title;


				var labelTitleHeight = 40;

				if (summary)
				{

					if (summary.length == 0)
						labelTitleHeight = 70;
				}
				else
				{
					labelTitleHeight = 70;
				}

				var labelTitle = Ti.UI.createLabel({
					text:title,
					left:5,
					top:5,
					height:labelTitleHeight,
					font:{fontSize:16},
					color:"#333333"
				});
				row.add(labelTitle);

				if (summary)
				{
					if (summary.length > 0)
					{

						var labelSummary = Ti.UI.createLabel({
							text:summary,
							left:5,
							top:50,
							font:{fontSize:11},
							color:"#333333"
						});
						row.add(labelSummary);
					}
				}

				data[x++] = row;

			}

		//	Titanium.API.debug("creating table view");

			tableview = Titanium.UI.createTableView({
				data:data,
				color:"#333333",
				separatorColor:"#cccccc",
				backgroundImage:'../img/bg/bglight.jpg',
			});

			Titanium.UI.currentWindow.add(tableview);

			tableview.addEventListener('click',function(e)
			{

				var wTitle = e.row.pageTitle;
				var wUrl = e.row.url;

				showWebModal(wTitle,wUrl);


			});
		}
	}
	catch(E)
	{
		Titanium.API.debug("got xhr error processing response: " + E);

		Titanium.UI.createAlertDialog({title:'NY Senate', message:'There was an error accessing the legislative data. Please try again later.'}).show();

	}



	hideLoadingDialog();
};


xhr.open("GET",listUrl);
xhr.send();



	var search = Titanium.UI.createSearchBar({
		barColor:'#000',
		showCancel:true,
		height:43,
		top:0,
		visible:false
	});



if (Titanium.Platform.name == 'iPhone OS')
{

	var btnSearch = Titanium.UI.createButton({
		title:'Search',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});



	Titanium.UI.currentWindow.rightNavButton = btnSearch;

	btnSearch.addEventListener('click',function()
	{
		search.visible = true;
		tableview.top = 45;
	});


}
else
{

	var tb1 = null;
var tb2 = null;

var menuHandler = function() {
    tb1.addEventListener('click', function() {
        search.visible = true;
		tableview.top = 45;
    });
};

var activity = Ti.Android.currentActivity;
activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;
    tb1 = menu.add({title : 'Search Legislation'});
    menuHandler();
};
}




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
	search.visible = false;
	tableview.top = 0;
});
search.addEventListener('return', function(e)
{
//	Titanium.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();

	var win = Titanium.UI.createWindow({
		url:'olsearch.js',
		title:'Search: ' + search.value
	});

	win.barColor = DEFAULT_BAR_COLOR;
	win.olterm = search.value;

	Titanium.UI.currentTab.open(win,{animated:true});


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



