// create table view data object
Ti.include("../../inc/globals.js");

var data = [];

/*
data.push({title:'Bills & Resolutions', leftImage:'../../img/btn/bill.png', hasChild:true, link:'olsearch-json.js', oltype:'bill'});
data.push({title:'Meeting Agendas', leftImage:'../../img/btn/meeting.png',hasChild:true, link:'olsearch-json.js', oltype:'meeting'});
data.push({title:'Calendars & Active Lists', leftImage:'../../img/btn/calendar.png',hasChild:true, link:'olsearch-json.js', oltype:'calendar'});
data.push({title:'Bill Actions', leftImage:'../../img/btn/action.png',hasChild:true, link:'olsearch-json.js', oltype:'action'});
data.push({title:'Recent Votes',leftImage:'../../img/btn/vote.png', hasChild:true, link:'olsearch-json.js', oltype:'vote'});
data.push({title:'Transcripts', leftImage:'../../img/btn/transcript.png',hasChild:true, link:'olsearch-json.js', oltype:'transcript'});
data.push({title:'By Committee', hasChild:true, link:'committees.js'});
*/

data.push({title:'Bills & Resolutions', hasChild:true, link:'olsearch-json.js', oltype:'bill'});
data.push({title:'Meeting Agendas', hasChild:true, link:'olsearch-json.js', oltype:'meeting'});
data.push({title:'Calendars & Active Lists', hasChild:true, link:'olsearch-json.js', oltype:'calendar'});
data.push({title:'Bill Actions', hasChild:true, link:'olsearch-json.js', oltype:'action'});
data.push({title:'Recent Votes',hasChild:true, link:'olsearch-json.js', oltype:'vote'});
data.push({title:'Transcripts',hasChild:true, link:'olsearch-json.js', oltype:'transcript'});
data.push({title:'By Committee', hasChild:true, link:'committees.js'});
	
// create table view
var tableview = Titanium.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.link)
	{
		var win = Titanium.UI.createWindow({
			url:e.rowData.link,
			title:e.rowData.title,
			orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
		});
		
		if (e.rowData.title_image)
		{
			win.titleImage = e.rowData.title_image;
		}
		
		if (e.rowData.oltype)
		{
			win.oltype = e.rowData.oltype;
		}
		
		Titanium.UI.currentTab.open(win,{animated:true});
	}
});


	var search = Titanium.UI.createSearchBar({
		barColor:'#000', 
		showCancel:true,
		height:43,
		top:0
	});


	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);
	
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
	var menu = Titanium.UI.Android.OptionMenu.createMenu();
 
	var item1 = Titanium.UI.Android.OptionMenu.createMenuItem({
		title : 'Search Legislation'
	});
	 
	item1.addEventListener('click', function(){
		search.visible = true;
		tableview.top = 45;
		
	});
	
	menu.add(item1);

	Titanium.UI.Android.OptionMenu.setMenu(menu);

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
		url:'olsearch-json.js',
		title:'Search: ' + e.value
	});
	
	win.barColor = DEFAULT_BAR_COLOR;
	win.olterm = e.value;

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
search.visible = false;

