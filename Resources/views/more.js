Ti.include("../globals.js");

// create table view data object
var data = [
	//{title:'Video Search', summary:'Access to the YouTube Video Archive', hasDetail:true, color:"#000000", ilink:'../inc/youtube.js', channel:'NYSenate'},
	{title:'About the Senate', summary:'From the NYSenate.gov Website', hasDetail:true,  color:"#000000",link:'http://www.nysenate.gov/about-us'},
	{title:'Knowledge Base', summary:'Frequently Asked Questions and more', hasDetail:true,  color:"#000000",link:'http://www.nysenate.gov/frequently-asked-questions'},
	{title:'Visiting the Capitol', summary:'Directions and Maps', hasDetail:true, color:"#000000", link:'http://www.nysenate.gov/node/76'},
	{title:'Senate Rules', summary:'The Rules of Order for the NY State Senate', hasDetail:true, color:"#000000", link:'http://www.nysenate.gov/rules'},
	{title:'Constitution', summary:'New York State Constitution',hasDetail:true,  color:"#000000",link:'http://www.nysenate.gov/constitution'},
	{title:'State Seal', summary:'New York State Seal Image and Explanation',hasDetail:true, color:"#000000", link:'http://www.nysenate.gov/state-seal'},
	{title:'State History Timeline', summary:'From 1609 and onward', hasDetail:true, color:"#000000", link:'http://www.nysenate.gov/timeline'},

];

var tableview = Titanium.UI.createTableView(
{
backgroundColor:"#ffffff"
});



for (var c = 0; c < data.length; c++)
{
	
	
	row = Ti.UI.createTableViewRow({height:60});
	row.className = 'morerow';
	row.pageTitle = data[c].title;
	row.link =  data[c].link;
	row.rss =  data[c].rss;
	row.ilink =  data[c].ilink;
	row.oltype = data[c].oltype;
	row.hasDetail = true;

		
	var labelTitle = Ti.UI.createLabel({
		text:data[c].title,
		left:10,
		top:5,
		height:35,
		font:{fontSize:20},
		color:'#000'
	});
	row.add(labelTitle);
	
	var labelTime = Ti.UI.createLabel({
		text:data[c].summary,
		left:10,
		top:40,
		font:{fontSize:14},
		color:'#333'
	});
	row.add(labelTime);
			

	
	tableview.appendRow(row);
		
	
}


var subWin;

// create table view event listener
tableview.addEventListener('click', function(e)
{
	
	if (e.rowData.ilink)
	{
			subWin = Titanium.UI.createWindow({
				url:e.rowData.ilink,
				title:e.rowData.pageTitle
				
			});

			subWin.channel = e.rowData.channel;
				
			subWin.barColor = DEFAULT_BAR_COLOR;
			Titanium.UI.currentTab.open(subWin,{animated:true});
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

		Titanium.UI.currentTab.open(subWin,{animated:true});
	}
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
