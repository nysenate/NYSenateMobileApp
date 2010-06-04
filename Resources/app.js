Ti.include("inc/globals.js");

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

if (Titanium.Platform.name == 'iPhone OS')
{
winHome = Titanium.UI.createWindow({  
    title:'New York State Senate',
	url:'views/window/home.js',
    barColor:DEFAULT_BAR_COLOR,
	backgroundImage:"img/bg/black.png",
	orientationModes:[Titanium.UI.PORTRAIT]
//orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});
}
else
{


winHome = Titanium.UI.createWindow({  
    title:'New York State Senate',
	url:'views/window/home-android.js',
    barColor:DEFAULT_BAR_COLOR,
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});

}

var tabHome = Titanium.UI.createTab({  
    icon:'img/tabs/bank.png',
    title:'Senate',
    window:winHome,
	active:true
});

//
// create controls tab and root window
//
var winToday = Titanium.UI.createWindow({  
    title:'Calendar',
	url:'views/window/today.js',
 	barColor:DEFAULT_BAR_COLOR,
 		backgroundImage:"img/bg/black.png",
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]

});
var tabToday = Titanium.UI.createTab({  
    icon:'img/tabs/newspaper.png',
    title:'Calendar',
    window:winToday
});


//third tab
var winSenators;

/*
if (Titanium.Platform.name == 'iPhone OS')
{
	winSenators = Titanium.UI.createWindow({  
		title:'Senators',
		url:'views/window/senators.js',
		barColor:DEFAULT_BAR_COLOR,
		backgroundImage:'img/bg/black.png',
		orientationModes:[Titanium.UI.PORTRAIT]
	});
}
else
{*/
	winSenators = Titanium.UI.createWindow({  
		title:'Senators',
		url:'views/window/senators-android.js',
		barColor:DEFAULT_BAR_COLOR,
		orientationModes:[Titanium.UI.PORTRAIT]
	});
//}

var tabSenators = Titanium.UI.createTab({  
    icon:'img/tabs/man.png',
    title:'Senators',
    window:winSenators
});

//fourth tab
var winOpenLeg = Titanium.UI.createWindow({  
    title:'Legislation',
	url:'views/window/legislation.js',
 	barColor:DEFAULT_BAR_COLOR,
 		backgroundImage:"img/bg/black.png",
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});
var tabOpenLeg = Titanium.UI.createTab({  
    icon:'img/tabs/database.png',
    title:'Legislation',
    window:winOpenLeg
});

//fifth tab
var winMore = Titanium.UI.createWindow({  
    title:'More',
	url:'views/window/more.js',
 	barColor:DEFAULT_BAR_COLOR,
 	backgroundImage:"img/bg/black.png",
	orientationModes:[Titanium.UI.LANDSCAPE_LEFT,Titanium.UI.LANDSCAPE_RIGHT,Titanium.UI.PORTRAIT]
});
var tabMore = Titanium.UI.createTab({  
    icon:'img/tabs/preferences.png',
    title:'More',
    window:winMore
});




//
//  add tabs
//
tabGroup.addTab(tabHome);
tabGroup.addTab(tabToday);  
tabGroup.addTab(tabSenators); 
tabGroup.addTab(tabOpenLeg); 
tabGroup.addTab(tabMore); 

 
//tabGroup.setActiveTab(1);

var hadWelcome = true;// Titanium.App.Properties.getString("welcome");

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
		title:'Welcome to the NY Senate! Would you like to find out who your Senator is?'
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
	

	
	/*
	var winMore = Titanium.UI.createWindow({  
	    title:'More',
		url:'views/window/welcome.js',
	 	barColor:DEFAULT_BAR_COLOR,
		backgroundImage:'img/bg/Default.png'
	});
		
		winMore.open({modal:false,
				transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
				*/
				
}

