Ti.include("../globals.js");
Ti.include("../inc/jssha256.js");
Ti.include("../inc/drupal_services.js");

Titanium.UI.currentWindow.backgroundImage = BG_LIGHT;


// create table view
var tableViewOptions = {backgroundColor:"#ffffff"};
var tableview = Titanium.UI.createTableView(tableViewOptions);

function loadCommittees()
{
	var serviceCallback = function(){
	
		  // perform your code here with the data coming back,
		  // data will be the object containing the response.
		  //  Ti.API.debug(this.responseText);
		  //var data = JSON.parse('{' + this.responseText + '}');
		  
		var data = JSON.parse('{"data":' + this.responseText + '}').data;
		  
		 for (i = 0; i < data["#data"].length; i++)
		 {
		 var nodeTitle = data["#data"][i].node_title;
		   var newRow = Ti.UI.createTableViewRow({height:80});
		   newRow.hasChild = true;
		   newRow.searchText = nodeTitle;
		   var labelTitle = Ti.UI.createLabel({
				text:nodeTitle,
				left:5,
				top:0,
				height:80,
				font:{fontSize:22},
				color:"#000000"
			});
			newRow.add(labelTitle);
		   
		   tableview.appendRow(newRow);
		  }
	};
	
	doNYSenateServiceCall('views.get',['view_name'],['committees'],serviceCallback);
}

// create table view event listener
tableview.addEventListener('click', function(e)
{
	var searchValue = e.row.searchText;
	
	var win = Titanium.UI.createWindow({
		url:'olsearch.js',
		title:'Search: ' + searchValue
	});
	
	win.barColor = DEFAULT_BAR_COLOR;
	win.olterm = "committee:\"" + searchValue + "\"";

	Titanium.UI.currentTab.open(win,{animated:true});
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);

loadCommittees();