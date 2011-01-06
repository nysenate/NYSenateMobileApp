Ti.include("globals.js");


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup({
		backgroundColor:DEFAULT_BAR_COLOR
	});

//
// create base UI tab and root window
//
var winHome;

winHome = Titanium.UI.createWindow({  
    title:'New York State Senate',
	url:'views/homeslider.js',
	//url:'views/window/newsroom.js',
    barColor:DEFAULT_BAR_COLOR,
	backgroundImage:"img/bg/black.png",
//	orientationModes:[Titanium.UI.PORTRAIT]
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});

var tabHome = Titanium.UI.createTab({  
    icon:'img/tabs/bank.png',
    title:'Newsroom',
    window:winHome,
	active:true
});

tabGroup.addTab(tabHome);



//
// create controls tab and root window
//
var winToday = Titanium.UI.createWindow({  
    title:'Calendar',
	url:'views/today.js',
 	barColor:DEFAULT_BAR_COLOR,
 		backgroundImage:"img/bg/Default.png",
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]

});
var tabToday = Titanium.UI.createTab({  
    icon:'img/tabs/newspaper.png',
    title:'Calendar',
    window:winToday
});

tabGroup.addTab(tabToday);


//third tab
var winSenators;


winSenators = Titanium.UI.createWindow({  
		title:'Senators',
		url:'views/senators.js',
		barColor:DEFAULT_BAR_COLOR,
		backgroundImage:'img/bg/Default.png',
		orientationModes:[Titanium.UI.PORTRAIT]
});


var tabSenators = Titanium.UI.createTab({  
    icon:'img/tabs/man.png',
    title:'Senators',
    window:winSenators
});


tabGroup.addTab(tabSenators); 

//fourth tab
var winOpenLeg = Titanium.UI.createWindow({  
    title:'Legislation',
	url:'views/legislation.js',
 	barColor:DEFAULT_BAR_COLOR,
 		backgroundImage:"img/bg/Default.png",
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});
var tabOpenLeg = Titanium.UI.createTab({  
    icon:'img/tabs/database.png',
    title:'Legislation',
    window:winOpenLeg
});

tabGroup.addTab(tabOpenLeg); 

//fifth tab
var winMore = Titanium.UI.createWindow({  
    title:'More',
	url:'views/more.js',
 	barColor:DEFAULT_BAR_COLOR,
 	backgroundImage:"img/bg/Default.png",
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});
var tabMore = Titanium.UI.createTab({  
    icon:'img/tabs/preferences.png',
    title:'More',
    window:winMore
});

tabGroup.addTab(tabMore); 

var hadWelcome = Titanium.App.Properties.getString("welcome");

// open tab group with a transition animation
tabGroup.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});

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
			tabGroup.setActiveTab(2);
		}
		
		Titanium.App.Properties.setString("welcome","done");
		
	});

	dialog.show();
	

				
}

