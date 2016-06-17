Ti.include("globals.js");

var tabIdx = 0;

if (Ti.UI.currentWindow.tabIdx)
	tabIdx = Ti.UI.currentWindow.tabIdx;

// create tab group
var tabGroup = Titanium.UI.createTabGroup({});

//third tab
var winSenators;

winSenators = Titanium.UI.createWindow({
		title:'Senators',
		url:'views/senators.js',
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});


var tabSenators = Titanium.UI.createTab({
    icon:'img/icons/senators32.png',
    title:'Senators',
    window:winSenators
});


tabGroup.addTab(tabSenators);



//
// create controls tab and root window
//
var winToday = Titanium.UI.createWindow({
    title:'Calendar',
	url:'views/today.js',
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]

});
var tabToday = Titanium.UI.createTab({
    icon:'img/icons/calendar32.png',
    title:'Calendar',
    window:winToday
});

tabGroup.addTab(tabToday);

//
// create base UI tab and root window
//
var winHome;

	winHome = Titanium.UI.createWindow({
	    title:'New York State Senate',
		url:'views/newsroom.js',
		orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
	});

var tabHome = Titanium.UI.createTab({
    icon:'img/icons/comments32.png',
    title:'Newsroom',
    window:winHome
});

tabGroup.addTab(tabHome);

//fourth tab
var winOpenLeg = Titanium.UI.createWindow({
    title:'Legislation',
	url:'views/legislation.js',
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT],
	backgroundColor:"#ffffff"
});
var tabOpenLeg = Titanium.UI.createTab({
    icon:'img/icons/legislation32.png',
    title:'Legislation',
    window:winOpenLeg
});

tabGroup.addTab(tabOpenLeg);

//fifth tab
var winMore = Titanium.UI.createWindow({
    title:'More',
	url:'views/more.js',
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});
var tabMore = Titanium.UI.createTab({
    icon:'img/icons/more32.png',
    title:'More',
    window:winMore
});

tabGroup.addTab(tabMore);

// open tab group with a transition animation
tabGroup.open({
	transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});

tabGroup.setActiveTab(tabIdx);

tabGroup.addEventListener('close', function(e)
{
//	Titanium.API.info("TAB GROUP - got close");

});

