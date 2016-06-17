Ti.include("globals.js");

function showTabs (tabIdx)
{

	// create tab group
	var tabGroup = Titanium.UI.createTabGroup({});

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
	    icon:'img/tabs/bank.png',
	    title:'Newsroom',
	    window:winHome,
	    background:DEFAULT_BAR_COLOR
	});

	tabGroup.addTab(tabHome);


	//
	// create controls tab and root window
	//
	var winToday = Titanium.UI.createWindow({
	    title:'Calendar',
		url:'views/today.js',

	 		backgroundImage:"img/bg/Default.png",
		orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]

	});
	var tabToday = Titanium.UI.createTab({
	    icon:'img/tabs/newspaper.png',
	    title:'Calendar',
	    window:winToday,
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

	tabGroup.addEventListener('blur', function(e)
	{
		Titanium.API.info("got tab win blur key event!");

	});

	tabGroup.addEventListener('close',function(e)
	{
		Titanium.API.info("got tab win close key event!");

	});

	tabGroup.close();
	// open tab group with a transition animation
	tabGroup.open();

	tabGroup.setActiveTab(tabIdx);

}

var focusCount = 0;

Ti.UI.currentWindow.addEventListener('focus', function(e)
	{
		focusCount++;

		Titanium.API.info("TAB PARENT - got focus; count=" + focusCount);

		if (focusCount > 1)
		{
			Ti.API.info("closing curr window");
			Ti.UI.currentWindow.close();
		}

	});

Ti.UI.currentWindow.addEventListener('blur', function(e)
	{
		Titanium.API.info("TAB PARENT - got blur");

	});

Ti.UI.currentWindow.addEventListener('close', function(e)
	{
		Titanium.API.info("TAB PARENT - got close");

	});

Ti.UI.currentWindow.addEventListener('android:back', function(e)
	{
		Titanium.API.info("TAB PARENT - got android:back!");

	});

showTabs(0);
