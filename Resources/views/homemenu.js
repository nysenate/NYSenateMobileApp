Ti.include("../globals.js");


// create table view data object
var data = [
	{title:'SENATORS', summary:'', hasDetail:true, tab:2,  icon:'../img/tabs/man.png'},
	{title:'NEWSROOM', summary:'', hasDetail:true, ilink:'newsroom.js',  icon:'../img/tabs/newspaper.png'},
	{title:'LEGISLATION', summary:'', hasDetail:true,  ilink:'legislation.js',  icon:'../img/tabs/database.png'},
	{title:'LATEST VIDEOS', summary:'', hasDetail:true,  ilink:'videos.js',  icon:'../img/tabs/star.png'},
	{title:'MORE INFORMATION', summary:'', hasDetail:true,  ilink:'more.js',  icon:'../img/tabs/bank.png'},
	{title:'VISIT NYSENATE.GOV', summary:'', hasDetail:true, elink:'http://nysenate.gov',  icon:'../img/tabs/world.png'},
];

var tableview = Titanium.UI.createTableView(
{
backgroundColor:"#ffffff"
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
	row.hasDetail = true;
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
		Ti.UI.currentTab.open(subWin,{animated:true});
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
			url:'rss.js',
			title:e.rowData.pageTitle
		});

		subWin.barColor = DEFAULT_BAR_COLOR;
		subWin.rss = e.rowData.rss;

		Ti.UI.currentTab.open(subWin,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentTab.add(tableview);
