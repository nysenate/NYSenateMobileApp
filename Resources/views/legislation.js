// create table view data object
Ti.include("../globals.js");

var data = [];

data.push({title:'Bills & Resolutions',summary:'Senate Bills, Resolution and more', link:'olsearch.js', oltype:'bill'});
data.push({title:'Meeting Agendas',summary:'Committee Meetings Time, Place, Notes and Bills',  link:'olsearch.js', oltype:'meeting'});
data.push({title:'Calendars & Active Lists', summary:'Bills scheduled for the Senate Floor',link:'olsearch.js', oltype:'calendar'});
data.push({title:'Bill Actions',summary:'Every Action for Every Bill', link:'olsearch.js', oltype:'action'});
data.push({title:'Recent Votes', summary:'Floor and Committee Vote Records',link:'olsearch.js', oltype:'vote'});
data.push({title:'Transcripts', summary:'Senate Session and Hearing Transcripts', link:'olsearch.js', oltype:'transcript'});
data.push({title:'By Committee', summary:'Browse Legislation by Committee', link:'committees.js'});
	
// create table view
var tableview = Titanium.UI.createTableView({
	backgroundColor:"#ffffff"			
});

for (var c = 0; c < data.length; c++)
{
	
	
	row = Ti.UI.createTableViewRow({height:60});
	row.className = 'legrow';
	row.pageTitle = data[c].title;
	row.link =  data[c].link;
	row.oltype = data[c].oltype;
	row.hasDetail = true;
	
	
		
	var labelTitle = Ti.UI.createLabel({
		text:data[c].title,
		left:10,
		top:5,
		height:35,
		font:{fontSize:20},
		color:'#333333'
	});
	row.add(labelTitle);
	
	var labelTime = Ti.UI.createLabel({
		text:data[c].summary,
		left:10,
		top:40,
		font:{fontSize:14},
		color:'#555555'
	});
	row.add(labelTime);
			

	
	tableview.appendRow(row);
		
	
}

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.link)
	{
		var win = Titanium.UI.createWindow({
			url:e.rowData.link,
			title:e.rowData.pageTitle,
			orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
		});
		
		
		if (e.rowData.oltype)
		{
			win.oltype = e.rowData.oltype;
		}
		
		Titanium.UI.currentTab.open(win,{animated:true});
	}
});


	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);

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

