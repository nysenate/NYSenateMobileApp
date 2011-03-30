Ti.include("globals.js");
Ti.include("app-tabs.js");
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//Titanium.UI.setBackgroundColor(DEFAULT_BAR_COLOR);

//
// create base UI tab and root window
//
var win;
var tabGroup;

var screenWidth = Titanium.Platform.displayCaps.platformWidth-10;
var screenHeight = Titanium.Platform.displayCaps.platformHeight;

var hadWelcome = Titanium.App.Properties.getString("welcome");

var transpColor = '#00ffffff';

function buildWindow ()
{

	var win = Titanium.UI.createWindow({  
	    backgroundImage:'img/bg/bglight.jpg',
	    orientationModes:[Titanium.UI.PORTRAIT],
	    navBarHidden:true
	});

	win.addEventListener('android:back',function(e)
	{
		Titanium.API.info("got win android:back event");
			
	});

	win.open({});

	var imgHeader = Ti.UI.createImageView({
			image:"img/header/header1.jpg",
			top:0,
			left:0,
			height:60
		});
	win.add(imgHeader);

	var imgTitle = Ti.UI.createImageView({
			image:"img/header/nyss_logo.png",
			top:0,
			left:0,
			height:56,
			width:259
		});
	win.add(imgTitle);

	
	var tableview = Titanium.UI.createTableView({
		separatorColor: transpColor,
		top:64,
		left:0
	});

	// add table view to the window
	win.add(tableview);

	var iconsPerRow = 3;

	var gridData = [];

	gridData.push({image:'img/tabs/man.png', label:'Senators', tabIdx:1});
	gridData.push({image:'img/tabs/man.png', label:'Committees', tabIdx:1});
	gridData.push({image:'img/tabs/database.png', label:'Legislation',  tabIdx:3});
	gridData.push({image:'img/tabs/newspaper.png', label:'Newsroom', tabIdx:1});
	gridData.push({image:'img/tabs/bank.png', label:'Calendar', tabIdx:2});
	gridData.push({image:'img/tabs/star.png', label:'Videos',  tabIdx:4});
	gridData.push({image:'img/tabs/preferences.png', label:'About',  tabIdx:4});
	gridData.push({image:'img/tabs/man.png', label:'Find Senator', link:'views/findsenator.js'});
	gridData.push({image:'img/tabs/world.png', label:'NYSenate.gov', elink:'http://nysenate.gov'});

	var gridColIdx = -1;
	var gridRow;
	var gridRowHeight = 120;

	var gridIconHeight = 48;
	var gridIconWidth = 48;
	var gridIconBuffer = 15;
	var gridLabelBuffer = 20;
	var gridFontColor = "#555555";
	var gridFontSize = "14";

	var xLeft = gridIconBuffer;
	var xRight = screenWidth - gridIconWidth - (gridIconBuffer*2);
	var xCenter = screenWidth/2 - (gridIconWidth/2);

	for (var i = 0; i < gridData.length; i++)
	{
	
		if (gridColIdx == -1 || gridColIdx > 2)
		{
			gridRow = Ti.UI.createTableViewRow({
				height:gridRowHeight,
				backgroundSelectedColor:transpColor
			});
			tableview.appendRow(gridRow);
			gridColIdx = 0;
		}

		var imgLeft = 0;

		if (gridColIdx == 0)
			imgLeft = xLeft;
		else if (gridColIdx == 1)
			imgLeft = xCenter;
		else if (gridColIdx == 2)
			imgLeft = xRight;	
	
		var img = Ti.UI.createImageView({
			image:gridData[i].image,
			top:gridIconBuffer,
			left:imgLeft,
			height:gridIconHeight,
			width:gridIconWidth,
			pageLink:gridData[i].link,
			pageTitle:gridData[i].label,
			tabIdx:gridData[i].tabIdx
		});

		img.addEventListener('click', function(e)
		{
			if (e.source.pageLink)
			{
				var newWin = Titanium.UI.createWindow({
					url:e.source.pageLink,
					title:e.source.pageTitle,
					orientationModes:[Titanium.UI.PORTRAIT],
					modal:true

				});
				
				newWin.close();
				newWin.open();

				newWin.addEventListener('close',function(e)
				{

					Titanium.API.info("got android BACK key event for new win");
					

				});
		
			}
			else if (e.source.tabIdx)
			{
				
				
				var tabWin = Titanium.UI.createWindow({
					url:"app-tabs.js",
					orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT],
					modal:true
				});
			
				tabWin.open({});

				tabWin.addEventListener('close',function(e)
				{
					Titanium.API.info("got tab win close key event!");
					//win.visible = true;

				});
			}
	
		});
		
		gridRow.add(img);

		var imgLabel = Ti.UI.createLabel({
			text:gridData[i].label,
			left:imgLeft-gridLabelBuffer,
			width:gridIconWidth+(gridLabelBuffer*2),
			textAlign:'center',
			top:gridIconBuffer+gridIconHeight,
			font:{fontSize:gridFontSize},
			color:gridFontColor
		});
		gridRow.add(imgLabel);
		
		gridColIdx++;
	
	}

	
	return win;
}



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
				backgroundImage:'../img/bg/senatebg.jpg',
				fullscreen:false,
				top:100

			});
			win.open(winSearch,{animated:true});

		}
		
		Titanium.App.Properties.setString("welcome","done");
		
	});

	dialog.show();
	
				
}


win = buildWindow();

