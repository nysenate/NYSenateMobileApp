Ti.include("globals.js");
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor(DEFAULT_BAR_COLOR);

//
// create base UI tab and root window
//
var win;

win = Titanium.UI.createWindow({
    title:'New York State Senate',
    barColor:DEFAULT_BAR_COLOR,
    orientationModes:[Titanium.UI.PORTRAIT],
    navBarHidden:true
});

var imgHeader = Ti.UI.createImageView({
			image:'img/header/headerfull.jpg',
			top:0,
			left:0,
			height:70
		});

win.add(imgHeader);

var imgTitle = Ti.UI.createImageView({
		image:'img/header/nyss_logo.png',
		top:4,
		left:4,
		height:56,
		width:259
	});
win.add(imgTitle);


// create table view data object
var data = [
	{title:'Senators', summary:'', hasDetail:true, ilink:'tabs.js',tabIdx:0,  icon:'img/icons/senators.png'},
	{title:'Session Calendar', summary:'', hasDetail:true,ilink:'tabs.js',tabIdx:1,  icon:'img/icons/calendar.png'},
	{title:'Newsroom', summary:'', hasDetail:true,ilink:'tabs.js',tabIdx:2,  icon:'img/icons/comments.png'},
	{title:'Open Legislation', summary:'', hasDetail:true,  ilink:'tabs.js',tabIdx:3,  icon:'img/icons/legislation.png'},
	{title:'Latest Videos', summary:'', hasDetail:true,  ilink:'inc/youtube.js', icon:'img/icons/videos.png'},
	{title:'Find Your Senator', summary:'', hasDetail:true,  ilink:'views/findsenator.js', icon:'img/icons/search.png'},
	{title:'More Information', summary:'', hasDetail:true,  ilink:'tabs.js',tabIdx:4,   icon:'img/icons/more.png'},
	{title:'Visit NYSenate.gov', summary:'', hasDetail:true, elink:'http://nysenate.gov',  icon:'img/icons/home.png'},
];

var tableview = Titanium.UI.createTableView(
{
backgroundImage:'img/bg/bglight.jpg',
top:70,
separatorColor:"#cccccc"

});

for (var c = 0; c < data.length; c++)
{


	row = Ti.UI.createTableViewRow({height:60, fontSize:'14pt', color:'#333333'});
	row.pageTitle = data[c].title;
	row.link =  data[c].link;
	row.rss =  data[c].rss;
	row.ilink =  data[c].ilink;
	row.oltype = data[c].oltype;
	row.hasDetail =  data[c].hasDetail;
	//row.leftImage = data[c].icon;
	row.tabIdx = data[c].tabIdx;

	var labelImg = Ti.UI.createImageView({
			image:data[c].icon,
			top:6,
			left:2,
			height:48,
			width:48
		});
	row.add(labelImg);

	var labelTitle = Ti.UI.createLabel({
		text:data[c].title,
		left:56,
		top:12,
		height:35,
		font:{fontSize:20},
		color:'#333333'
	});
	row.add(labelTitle);

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
			title:e.rowData.pageTitle,
			modal:true
		});

		subWin.channel = e.rowData.channel;
		subWin.tabIdx = e.rowData.tabIdx;

		subWin.barColor = DEFAULT_BAR_COLOR;
		subWin.open({animated:true});
		subWin.focusCount = 0;

		subWin.addEventListener('focus', function(e)
		{

			Titanium.API.info("TAB PARENT - got focus");

			subWin.focusCount = subWin.focusCount + 1;

			if (subWin.focusCount > 1)
				subWin.close();

			//	Ti.API.info("closing curr window");
			//	Ti.UI.currentWindow.close();


		});

		subWin.addEventListener('blur', function(e)
			{
				Titanium.API.info("TAB PARENT - got blur");

			});

		subWin.addEventListener('close', function(e)
			{
				Titanium.API.info("TAB PARENT - got close");

			});

		subWin.addEventListener('android:back', function(e)
			{
				Titanium.API.info("TAB PARENT - got android:back!");
				subWin.close();
			});


	}
	else if (e.rowData.elink)
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
			title:e.rowData.pageTitle,
			modal:true

		});

		subWin.barColor = DEFAULT_BAR_COLOR;
		subWin.rss = e.rowData.rss;

		subWin.open({animated:true});
	}
});

// add table view to the window
win.add(tableview);
Titanium.UI.currentWindow = win;
win.open({});


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
				backgroundImage:'img/bg/Default.png',
				modal:true

			});
			win.open(winSearch,{animated:true});

		}

		Titanium.App.Properties.setString("welcome","done");

	});

	dialog.show();


}

