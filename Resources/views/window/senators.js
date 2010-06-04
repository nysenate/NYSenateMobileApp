Ti.include("../../inc/globals.js");

var senatorView;

	var items = getSenatorJSON ().senators;
	
	var senImages = [];
	
	for (var c=0; c<items.length; c++)
	{
		senImages[c] = "../../img/senators/" + items[c].key + ".jpg";
	}

	var sWidth = Titanium.UI.currentWindow.size.width;
	var sHeight = Titanium.UI.currentWindow.size.height;

	senatorView = Titanium.UI.createCoverFlowView({
	    images:senImages,
		top:0,
		left:0,
		width:sWidth,
		height:sHeight
	});

	Titanium.UI.currentWindow.add(senatorView);
	
		var btnSearch = Titanium.UI.createButton({
			title:'By Address',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});

	
		Titanium.UI.currentWindow.rightNavButton = btnSearch;
	
		btnSearch.addEventListener('click',function()
		{
			var newWin = Titanium.UI.createWindow({
				url:'findsenator.js',
				title:'Senator Search',
				barColor:DEFAULT_BAR_COLOR,
				 backgroundImage:DEFAULT_BG

			});

			Titanium.UI.currentTab.open(newWin,{animated:true});
		
		});
		
	
		
	
	// click listener - when image is clicked
	senatorView.addEventListener('click',function(e)
	{
	//	Titanium.API.info("image clicked: "+e.index);

	
		var newWin = Titanium.UI.createWindow({
			url:'senator.js',
			title:items[e.index].name,
			senatorName:items[e.index].name,
			senatorImage:senImages[e.index],
			senatorKey:items[e.index].key,
			senatorDistrict:items[e.index].district,
			twitter:items[e.index].twitter,
			facebook:items[e.index].facebook,
			barColor:DEFAULT_BAR_COLOR,
			 backgroundImage:'../../img/bg/wood.jpg'
		
		});

		Titanium.UI.currentTab.open(newWin,{animated:true});
	
	});

	// add table view to the window


	var messageView = Titanium.UI.createView({
		bottom:15,
		backgroundColor:'#333',
		height:50,
		width:270,
		borderRadius:10,
		opacity:0.8
	});

	var messageLabel = Titanium.UI.createLabel({
		color:'#fff',
		text:'Select by photo\nor use the "By Address" option',
		textAlign:'center',
		font:{fontSize:18},
		top:5,
		left:5,
		width:250,
		height:'auto'
	});

	messageView.add(messageLabel);

	Titanium.UI.currentWindow.add(messageView);

	// change listener when active image changes
	senatorView.addEventListener('change',function(e)
	{
		//	Titanium.API.info("image changed: "+e.index);	
		//	Titanium.UI.currentWindow.title = senInfo[e.index];	
			messageLabel.text = items[e.index].name + "\nDistrict " + items[e.index].district;
	
	});



