Ti.include("globals.js");


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#ffffff');

// create tab group
var tabGroup = Titanium.UI.createTabGroup({});

//
// create base UI tab and root window
//
var winHome;

winHome = Titanium.UI.createWindow({  
    title:'New York State Senate',
	//url:'views/homemenu.js',
url:'views/newsroom.js',
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
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
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

// open tab group with a transition animation
tabGroup.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});



