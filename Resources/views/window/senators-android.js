Ti.include("../../inc/globals.js");


	Titanium.API.debug("loading senators json");
	
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'senators.json');
	var contents = file.read();

	Titanium.API.debug("parsing senators json");
	
	var items = JSON.parse(contents.text).senators;
	 	
	Titanium.API.debug("got senators JSON: " + items.length);
	
	var data = [];
	var c;
	
	for (c=0; c<items.length; c++)
	{
	
		Titanium.API.debug("adding senator: " + c);

		var row = Ti.UI.createTableViewRow({height:80});
		var title = "Sen. " + items[c].name;
		var summary = "District " + items[c].district;
	
		var thumbnail = "../../img/senators/small/" + items[c].key + ".jpg";
	
		var labelTitle = Ti.UI.createLabel({
			text:title,
			left:60,
			top:10,
			height:25,
			font:{fontSize:18}
		});
		row.add(labelTitle);
		
		var labelSummary = Ti.UI.createLabel({
			text:summary,
			left:60,
			top:35,
			font:{fontSize:14}
		});
		row.add(labelSummary);
	
		var img = Ti.UI.createImageView({
			url:thumbnail,
			left:0,
			height:80,
			width:55
		});
		row.add(img);
		
		row.hasDetail = true;
		
		data[c] = row;
		
	}

	senatorView = Titanium.UI.createTableView({
	    data:data
	});

	Titanium.UI.currentWindow.add(senatorView);
	
	if (Titanium.Platform.name == 'iPhone OS')
	{

	var btnSearch = Titanium.UI.createButton({
		title:'By Address'
	});


	btnSearch.addEventListener('click',function()
	{
		var winSearch = Titanium.UI.createWindow({
			url:'findsenator.js',
			title:'Senator Search',
			barColor:DEFAULT_BAR_COLOR,
			backgroundImage:'../../img/bg/wood.jpg'

		});

		Titanium.UI.currentTab.open(winSearch,{animated:true});
	
	});
			
	Titanium.UI.currentWindow.rightNavButton = btnSearch;

}
else
{
	var menu = Titanium.UI.Android.OptionMenu.createMenu();
 
	var item1 = Titanium.UI.Android.OptionMenu.createMenuItem({
		title : 'Search by Address'
	});
	 
	item1.addEventListener('click', function(){
		var winSearch = Titanium.UI.createWindow({
			url:'findsenator.js',
			title:'Senator Search',
			barColor:DEFAULT_BAR_COLOR,
			backgroundImage:'../../img/bg/wood.jpg'

		});

		Titanium.UI.currentTab.open(winSearch,{animated:true});
	});
	
	menu.add(item1);

	Titanium.UI.Android.OptionMenu.setMenu(menu);

}

/*
	var btnSearch = Titanium.UI.createButton({
		title:'District Map'
	});


	btnSearch.addEventListener('click',function()
	{
		showNYSenateContent("District Map","http://www.nysenate.gov/districts/map");
	
	});
			
Titanium.UI.currentWindow.rightNavButton = btnSearch;
*/
	
	// click listener - when image is clicked
	senatorView.addEventListener('click',function(e)
	{
		Titanium.API.info("image clicked: "+e.index);

		var newWin = Titanium.UI.createWindow({
			url:'senator.js',
			title:items[e.index].name,
			senatorName:items[e.index].name,
			senatorImage:"../../img/senators/" + items[e.index].key + ".jpg",
			senatorKey:items[e.index].key,
			senatorDistrict:items[e.index].district,
			twitter:items[e.index].twitter,
			facebook:items[e.index].facebook,
			backgroundImage:'../../img/bg/wood.jpg'
		
		});

		Titanium.UI.currentTab.open(newWin,{animated:true});
	
	});

	

