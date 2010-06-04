

var data = [];





	data[0] = Ti.UI.createTableViewRow({title:'Events for Today',header:'April 11, 2010'});
	
		data[1] = Ti.UI.createTableViewRow({hasDetail:true,title:'Committee Meeting: Banking',header:'8:00AM'});
		data[2] = Ti.UI.createTableViewRow({hasDetail:true,title:'Another Meeting',backgroundColor:'#aaaaff'});
		data[3] = Ti.UI.createTableViewRow({hasDetail:true,title:'Another Meeting 2',backgroundColor:'#cccccc'});
		
		data[4] = Ti.UI.createTableViewRow({hasDetail:true,title:'General Session',header:'1:00PM'});
		data[5] = Ti.UI.createTableViewRow({hasDetail:true,title:'Public Hearing',header:'5:00PM'});
		
		data[6] = Ti.UI.createTableViewRow({title:'Events for Tomorrow',header:'April 12, 2010'});
			data[7] = Ti.UI.createTableViewRow({hasDetail:true,title:'Committee Meeting: Banking',header:'8:00AM'});
	//	data[3] = Ti.UI.createTableViewRow({title:'',footer:'End of April 11, 2010'});

		// now do it with direct properties
		/*
		var row = Ti.UI.createTableViewRow();
		row.header = "Blah";
		row.title = "Header should be Blah";
		data[4] = row;
	*/

	// create table view
	var tableview = Titanium.UI.createTableView({
		data:data
	});

	// create table view event listener
	tableview.addEventListener('click', function(e)
	{
		// event data
		var index = e.index;
		var section = e.section;
		var row = e.row;
		var rowdata = e.rowData;

	//
	});

	// add table view to the window
	Titanium.UI.currentWindow.add(tableview);




