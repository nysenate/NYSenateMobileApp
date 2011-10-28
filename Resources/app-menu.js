Ti.include("globals.js");
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor(DEFAULT_BAR_COLOR);

//
// create base UI tab and root window
//
var winHome;

winHome = Titanium.UI.createWindow({
    title:'New York State Senate',
    barColor:DEFAULT_BAR_COLOR,
    backgroundImage:'img/bg/bglight.jpg',
    orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});


// create table view data object
var data = [
	{title:'Senators', summary:'', hasDetail:true, ilink:'tabs.js',  icon:'img/tabs/man.png'},
	{title:'Newsroom', summary:'', hasDetail:true,ilink:'tabs.js',  icon:'img/tabs/newspaper.png'},
	{title:'Legislation', summary:'', hasDetail:true,  ilink:'tabs.js',  icon:'img/tabs/database.png'},
	{title:'Latest Videos', summary:'', hasDetail:true,  ilink:'tabs.js',  icon:'img/tabs/star.png'},
	{title:'More Information', summary:'', hasDetail:true,  ilink:'tabs.js',  icon:'img/tabs/bank.png'},
	{title:'Visit NYSenate.gov', summary:'', hasDetail:true, elink:'http://nysenate.gov',  icon:'img/tabs/world.png'},
];

var tableview = Titanium.UI.createTableView(
{
backgroundColor:"#ffffff",
opacity:.8
});

for (var c = 0; c < data.length; c++)
{


	row = Ti.UI.createTableViewRow({height:60});
	row.className = 'morerow';
	row.color = '#333333';
	row.pageTitle = data[c].title;
	row.link =  data[c].link;
	row.rss =  data[c].rss;
	row.ilink =  data[c].ilink;
	row.oltype = data[c].oltype;
	row.hasDetail =  data[c].hasDetail;
	row.leftImage = data[c].icon;

	row.title = data[c].title;

	tableview.appendRow(row);


}


var subWin;

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.tab)
	{
		//Titanium.UI.currentTab.setActiveTab(e.rowData.tab);
	}
	else if (e.rowData.ilink)
	{
		subWin = Titanium.UI.createWindow({
			url:e.rowData.ilink,
			title:e.rowData.pageTitle

		});

		subWin.channel = e.rowData.channel;

		subWin.barColor = DEFAULT_BAR_COLOR;
		subWin.open({animated:true});
	}
	if (e.rowData.elink)
	{
		showWebModal(e.rowData.pageTitle,e.rowData.elink);
	}
	else if (e.rowData.link)
	{
		showNYSenateContent(e.rowData.pageTitle,e.rowData.link);
	}
	else if (e.rowData.rss)
	{
		subWin = Titanium.UI.createWindow({
			url:'views/rss.js',
			title:e.rowData.pageTitle
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
		subWin.rss = e.rowData.rss;

		subWin.open({animated:true});
	}
});

// add table view to the window
winHome.add(tableview);
Titanium.UI.currentWindow = winHome;
winHome.open({});


var hadWelcome = Titanium.App.Properties.getString("welcome");


if (!hadWelcome)
{
	//
	// BASIC OPTIONS DIALOG
	//
	var dialog = Titanium.UI.createOptionDialog({
		options:['Lookup My Senator', 'No thanks'],
		title:'Would you like to find your Senator?'
	});

	// add event listener
	dialog.addEventListener('click',function(e)
	{
		if (e.index == 0)
		{
		//	tabGroup.setActiveTab(2);
			var winSearch = Titanium.UI.createWindow({
				url:'views/findsenator.js',
				title:'Senator Search',
				barColor:DEFAULT_BAR_COLOR,
				backgroundImage:'img/bg/Default.png'

			});
			winHome.open(winSearch,{animated:true});

		}

		Titanium.App.Properties.setString("welcome","done");

	});

	dialog.show();


}

