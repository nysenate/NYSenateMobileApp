Ti.include("../globals.js");

var win = Titanium.UI.currentWindow;

var dToday = new Date();

var calBase = "http://www.nysenate.gov/calendar/"

var calType = "session";

var calTag = "/YEAR-MONTH/ical";

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// create table view
var tableview;
var monthOffset = 0;


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

//20100731T083000
function getDateString (timeString)
{
	
	//Ti.API.debug("get date string: " + timeString);
	
	var tYear = parseInt(timeString.substring(0,4));
	var tMonth = parseInt(timeString.substring(4,6),10);
	var tDay = parseInt(timeString.substring(6,8),10);
	
	return tMonth + '/' + tDay + '/' + tYear;

}

/*

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
		
		tableview.setData(data);
	
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("event");

		var greyBg = false;
		var cDateString;
		
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
			
			var dateString = getDateString(startTime);
			
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
				
			if ((!cDateString) || cDateString != dateString)
			{
				cDateString = dateString;
				row.header = cDateString;
				
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
				font:{fontSize:20}
			});
			row.add(labelTitle);
			
			var labelTime = Ti.UI.createLabel({
				text:timeString,
				left:10,
				top:55,
				font:{fontSize:16}
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
	
	

}*/


function CalEvent (summary, url, startDateTime, endDateTime, startTime, endTime)
{
	this.startDateTime = startDateTime;
	this.endDateTime = endDateTime;
	this.startTime = startTime;
	this.endTime = endTime;
	this.summary = summary;
	this.url = url;
}

function CalEventSort(a1,a2){
if(a1.startDateTime < a2.startDateTime)
return -1;
if(a1.startDateTime > a2.startDateTime)
return 1;
if(a1.startDateTime == a2.startDateTime)
return 0;

}

function setMonthTitle (month)
{

	win.title = months[month-1];
		
}


function loadMonthTable (year, month)
{	
	
	var win = Titanium.UI.currentWindow;

	setMonthTitle(month);
		
	var iCalUrl = calBase + calType + calTag;
	iCalUrl = iCalUrl.replace('YEAR',year);
	iCalUrl = iCalUrl.replace('MONTH',month);
	
	iCalURL = "http://nysenatemobile.appspot.com/data/icalxml.jsp?cal=" + escape(iCalUrl);
	
	
	Titanium.API.info("loading iCalUrl: " + iCalURL);
	
	showLoadingDialog("Loading","Loading Calendar...");
	
		
	var xhr = Ti.Network.createHTTPClient();


	xhr.onload = function()
	{
		Titanium.API.info("got iCalUrl onload");
		hideLoadingDialog();

		var data = [];
		
		var isFirst = true;
		
		tableview.setData(data);
	
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("event");

		var greyBg = false;
		
		var cDateString;
		
		var sortCalEvents = [];
		var item;
		
		if (items)
		{
			for (var c=0;c<items.length;c++)
			{
				
				
			//	Ti.API.debug("building calevent: " + c);
				
				item = items.item(c);
				
				var summary = item.getElementsByTagName("summary").item(0).text;
				var url = item.getElementsByTagName("url").item(0).text;
				
				var startDateTime = item.getElementsByTagName("starttime").item(0).text;
				var endDateTime = item.getElementsByTagName("endtime").item(0).text;
			
				var startTime = startDateTime.substring(9,13);
				var endTime = endDateTime.substring(9,13);
				
				sortCalEvents[c] = new CalEvent(summary, url, startDateTime, endDateTime, startTime, endTime);
			}
			
			
			sortCalEvents.sort(CalEventSort);
			
		//	Ti.API.debug("found calevents: " + sortCalEvents.length);
			
			for (var c = 0; c < sortCalEvents.length; c++)
			{
				
			
				var dateString = getDateString(sortCalEvents[c].startDateTime);
				
				var timeString;
				
				if (sortCalEvents[c].startTime == "0000")
				{
					timeString = "All Day";
				}
				else if (sortCalEvents[c].startTime == sortCalEvents[c].endTime)
				{
					timeString = processTime(sortCalEvents[c].startTime);
				}
				else
				{
					timeString = processTime(sortCalEvents[c].startTime) + " to " + processTime(sortCalEvents[c].endTime);
				}
				
				//Titanium.API.info("got event: " + summary + "; " + startTime + "; " + endTime);
			
				var summary = sortCalEvents[c].summary;
				
				
				if (summary.length > 80)
				{
					summary = summary.substring(0,77) + "...";
				}
					
				if ((!cDateString) || cDateString != dateString)
				{
					cDateString = dateString;
					
					row = Ti.UI.createTableViewRow({height:20});
					row.title = cDateString;
					row.backgroundColor = "#333333";
					row.color = "#ffffff";
					
					tableview.appendRow(row);
					
				}
				
				row = Ti.UI.createTableViewRow({height:60});
				row.className = 'calrow';
				row.pageTitle = summary;
				row.url = sortCalEvents[c].url;
				row.hasDetail = true;
					
				var labelTitle = Ti.UI.createLabel({
					text:summary,
					left:10,
					top:5,
					height:30,
					font:{fontSize:20},
					color:'#000'
				});
				row.add(labelTitle);
				
				var labelTime = Ti.UI.createLabel({
					text:timeString,
					left:10,
					top:35,
					font:{fontSize:16},
					color:'#333'
				});
				row.add(labelTime);
						
				
				row.url =  sortCalEvents[c].url;
				
				tableview.appendRow(row);
					
				
			}
	
			}
		
			


			
	};
	
	
	xhr.onerror = function(e)
	{
		Titanium.API.debug("error loading iCalUrl: " + e.error);
		hideLoadingDialog();

	};
	
	xhr.setTimeout(30000);
	xhr.open("GET",iCalURL);
	xhr.send();
	
	

}





if (!tableview)
{
	tableview= Titanium.UI.createTableView({
		backgroundColor:"#ffffff",
		opacity:.8
	});
	
	
	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);
	
	/*
	var buttonObjects = [
				{title:'Senate Wide', enabled:true, calBase:'http://www.nysenate.gov/calendar/ical/YEAR-MONTH'},
				{title:'Session Calendar', enabled:true, calBase:'http://www.nysenate.gov/calendar/session/YEAR-MONTH/ical/'}
				
				
				//{title:'Live Video', enabled:true, calBase:'http://www.nysenate.gov/calendar/live/ical/YEAR-MONTH'}
				
			//	{title:'Committee Meetings', enabled:true, calBase:'http://www.nysenate.gov/calendar/ical/YEAR-MONTH%3Fsenator%3DAll%2526type%3D3%2526committee%3DAll%2526initiative%3DAll'},
				//{title:'Public Hearings', enabled:true, calBase:'http://www.nysenate.gov/calendar/ical/YEAR-MONTH%3Fsenator%3DAll%2526type%3D1%2526committee%3DAll%2526initiative%3DAll'},
				
			];
			
				
			var bb1 = Titanium.UI.createButtonBar({
				labels:buttonObjects,
				style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
				height:35,
				width:'auto'
			});
			
			bb1.addEventListener('click', function(e)
			{
			//	for (i = 0; i < buttonObjects.length; i++)
				//	buttonObjects[0].enabled = true;
					
				if (e.index == 0)
				{
					//	buttonObjects[e.index].enabled = false;

				
				//	win.title = 'YouTube: Short Clips';
			//		currentChannel = 'nysenate';		
					//doYouTubeSearch (currentChannel, '');
				
				//	buttonObjects[0].enabled = false;
				//	buttonObjects[1].enabled = true;
					
				}
				
				calBase = buttonObjects[e.index].calBase;
				Titanium.UI.currentWindow.title = "Calendar: " + buttonObjects[e.index].title;
				
				bb1.labels = buttonObjects;
			
				loadMonthTable(dToday.getFullYear(), (dToday.getMonth()+1));

			});
			
			
var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
			
			// create and add toolbar
			var toolbar1 = Titanium.UI.createToolbar({
				items:[flexSpace,bb1,flexSpace],
				bottom:0,
				borderTop:true,
				borderBottom:false,
				backgroundColor:DEFAULT_BAR_COLOR
			});	
			

			Titanium.UI.currentWindow.add(toolbar1);
*/

	if (Titanium.Platform.name == 'iPhone OS')
	{
	


		var btnNext = Titanium.UI.createButton({
			title:'Next >'
		});

	
		Titanium.UI.currentWindow.rightNavButton = btnNext;
	
		btnNext.addEventListener('click',function()
		{
			Titanium.API.debug("next day");
			
			monthOffset++;
			loadMonthTable(dToday.getFullYear(), (dToday.getMonth()+1+monthOffset));
			
		});
	
		var btnPrev = Titanium.UI.createButton({
			title:'< Prev'
		});
		
		Titanium.UI.currentWindow.leftNavButton = btnPrev;
		
		btnPrev.addEventListener('click',function()
		{
			Titanium.API.debug("prev day");
			monthOffset--;
			loadMonthTable(dToday.getFullYear(), (dToday.getMonth()+1+monthOffset));
		});

	
	}
	else
	{
		var tb1 = null;
	 
		var menuHandler = function() {
			tb1.addEventListener('click', function() {
				loadMonthTable(dToday.getFullYear(), (dToday.getMonth()+1+monthOffset));
			});
		};
	 
		var activity = Ti.Android.currentActivity;
		activity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			tb1 = menu.add({title : 'Reload'});
			menuHandler();
		};
	}




	

tableview.addEventListener('click',function(e)
	{
	
		if (e.row.url)
			showNYSenateContent(e.row.pageTitle,e.row.url,Ti.UI.currentWindow.detailView);
	
	});


	
	//loadDayTable(dToday.getFullYear(), (dToday.getMonth()+1), dToday.getDate());
	//loadMonthTable(dToday.getFullYear(), (dToday.getMonth()+1+monthOffset));

}


loadMonthTable(dToday.getFullYear(), (dToday.getMonth()+1+monthOffset));

