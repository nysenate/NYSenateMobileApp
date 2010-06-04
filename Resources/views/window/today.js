Ti.include("../../inc/globals.js");

var dToday = new Date();

var calBase = "http://www.nysenate.gov/calendar/ical/";

// create table view
var tableview;

function processTime (timeString)
{
	
	var tHour = parseInt(timeString.substring(0,2),10);
	var tMin = timeString.substring(2);
	var tMod = "am";
		
	if (tHour >= 12)
	{
		tMod = "pm";
	}
			
	if (tHour > 12)
	{
		tHour -= 12;
	}
	
	return tHour + ":" + tMin + tMod;
}

function loadDayTable (year, month, day)
{	
	
	var win = Titanium.UI.currentWindow;

	var iCalURL = "http://nysenatemobile.appspot.com/data/icalxml.jsp?cal=" + escape(calBase + year + "-" + month + "-" + day);
	
	Titanium.API.info("loading iCalUrl: " + iCalURL);
	
	var toolActInd = Titanium.UI.createActivityIndicator();
	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	toolActInd.color = 'white';
	toolActInd.message = 'Loading calendar...';
	win.setToolbar([toolActInd],{animated:true});
	toolActInd.show();
		
	var xhr = Ti.Network.createHTTPClient();


	xhr.onload = function()
	{
		Titanium.API.info("got iCalUrl onload");
			
		var data = [];
		
		var isFirst = true;
		
		tableview.setData(data);
	
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("event");

		for (var c=0;c<items.length;c++)
		{
			
			var item = items.item(c);
			
			Titanium.API.info("parsing item: " + c);
		
			var summary = item.getElementsByTagName("summary").item(0).text;
			var url = item.getElementsByTagName("url").item(0).text;
			
			var startDateTime = item.getElementsByTagName("starttime").item(0).text;
			var endDateTime = item.getElementsByTagName("endtime").item(0).text;
		
			var startTime = startDateTime.substring(9,13);
			var endTime = endDateTime.substring(9,13);
			
			var timeString;
			
			if (startTime == "0000")
			{
				timeString = "All Day";
			}
			else if (startTime == endTime)
			{
				timeString = processTime(startTime);
			}
			else
			{
				timeString = processTime(startTime) + " to " + processTime(endTime);
			}
			
			Titanium.API.info("got event: " + summary);
		
			row = Ti.UI.createTableViewRow({height:80});
				
			row.pageTitle = summary;
			row.url = url;
			row.hasDetail = true;
				
			if (isFirst)
			{
				row.header = month + '/' + day + '/' + year;
				isFirst = false;
			}
			
			if (summary.length > 80)
			{
				summary = summary.substring(0,77) + "...";
			}
				
			var labelTitle = Ti.UI.createLabel({
				text:summary,
				left:10,
				top:5,
				height:45,
				font:{fontSize:16}
			});
			row.add(labelTitle);
			
			var labelTime = Ti.UI.createLabel({
				text:timeString,
				left:10,
				top:55,
				font:{fontSize:12}
			});
			row.add(labelTime);
					
			
			row.url = url;
			
			tableview.appendRow(row);
				
			
		}
	
	
		
			toolActInd.hide();
			win.setToolbar(null,{animated:true});

			
	};
	
	
	xhr.onerror = function(e)
	{
		Titanium.API.debug("error loading iCalUrl: " + e.error);
			toolActInd.hide();
			win.setToolbar(null,{animated:true});
	};
	
	xhr.setTimeout(30000);
	xhr.open("GET",iCalURL);
	xhr.send();
	
	

}




if (!tableview)
{
	tableview= Titanium.UI.createTableView({});
	
	tableview.addEventListener('swipe',function(e)
	{
		Titanium.API.debug("swipe");
	
	
		if (e.direction == "left")
		{
			dToday = new Date(dToday.getTime() + 86400000);
			
		}
		else
		{
			dToday = new Date(dToday.getTime() - 86400000);
			
		}
	
	
		
		
		loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());
		
	});
	
	
	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);
	
	

if (Titanium.Platform.name == 'iPhone OS')
{
	


	var btnNext = Titanium.UI.createButton({
		title:'Next >'
	});

	
	Titanium.UI.currentWindow.rightNavButton = btnNext;

	btnNext.addEventListener('click',function()
	{
		Titanium.API.debug("next day");
		
		dToday = new Date(dToday.getTime() + 86400000);
		
		loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());
		
	});

	var btnPrev = Titanium.UI.createButton({
		title:'< Prev'
	});
	
	Titanium.UI.currentWindow.leftNavButton = btnPrev;
	
	btnPrev.addEventListener('click',function()
	{
		Titanium.API.debug("prev day");
		
		dToday = new Date(dToday.getTime() - 86400000);
		
		loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());
	});

	tableview.addEventListener('click',function(e)
	{
	
		showNYSenateContent(e.row.pageTitle,e.row.url);
	
	});

}
else
{
	var menu = Titanium.UI.Android.OptionMenu.createMenu();
 
	var item1 = Titanium.UI.Android.OptionMenu.createMenuItem({
		title : 'Previous Day'
	});
	 
	item1.addEventListener('click', function(){
		Titanium.API.debug("prev day");
		
		dToday = new Date(dToday.getTime() - 86400000);
		
		loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());
	});
	
	var item2 = Titanium.UI.Android.OptionMenu.createMenuItem({
		title : 'Next Day'
	});
	 
	item2.addEventListener('click', function(){
		Titanium.API.debug("next day");
		
		dToday = new Date(dToday.getTime() + 86400000);
		
		loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());
	});
	
	menu.add(item1);
	menu.add(item2);

	
	Titanium.UI.Android.OptionMenu.setMenu(menu);
}

	
	loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());

}
