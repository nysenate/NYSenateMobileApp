
Ti.include("../../inc/globals.js");

Titanium.UI.currentWindow.backgroundImage = BG_LIGHT;



var data = [
{title:'AGING', hasChild:true},
{title:'AGRICULTURE',hasChild:true},
{title:'BANKS',hasChild:true},
{title:'CHILDREN AND FAMILIES',hasChild:true},
{title:'CITIES',hasChild:true},
{title:'CIVIL SERVICE AND PENSIONS',hasChild:true},
{title:'CODES',hasChild:true},
{title:'COMMERCE, ECONOMIC DEVELOPMENT AND SMALL BUSINESS',hasChild:true},
{title:'CONSUMER PROTECTION',hasChild:true},
{title:'CORPORATIONS, AUTHORITIES AND COMMISSIONS',hasChild:true},
{title:'CRIME VICTIMS, CRIME AND CORRECTION',hasChild:true},
{title:'CULTURAL AFFAIRS, TOURISM, PARKS AND RECREATION',hasChild:true},
{title:'EDUCATION',hasChild:true},
{title:'ELECTIONS',hasChild:true},
{title:'ENERGY AND TELECOMMUNICATIONS',hasChild:true},
{title:'ENVIRONMENTAL CONSERVATION',hasChild:true},
{title:'FINANCE',hasChild:true},
{title:'HEALTH',hasChild:true},
{title:'HIGHER EDUCATION',hasChild:true},
{title:'HOUSING, CONSTRUCTION AND COMMUNITY DEVELOPMENT',hasChild:true},
{title:'INSURANCE',hasChild:true},
{title:'INVESTIGATIONS AND GOVERNMENT OPERATIONS',hasChild:true},
{title:'JUDICIARY',hasChild:true},
{title:'LABOR',hasChild:true},
{title:'LOCAL GOVERNMENT',hasChild:true},
{title:'MENTAL HEALTH AND DEVELOPMENTAL DISABILITIES',hasChild:true},
{title:'RACING, GAMING AND WAGERING',hasChild:true},
{title:'RULES',hasChild:true},
{title:'SOCIAL SERVICES',hasChild:true},
{title:'SOCIAL SERVICES, CHILDREN AND FAMILIES',hasChild:true},
{title:'TOURISM, RECREATION AND SPORTS DEVELOPMENT',hasChild:true},
{title:'TRANSPORTATION',hasChild:true},
{title:'VETERANS, HOMELAND SECURITY AND MILITARY AFFAIRS',hasChild:true}
];


// create table view
var tableViewOptions = {
		data:data
	//	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	//	backgroundColor:'transparent',
	//	rowBackgroundColor:'white'
	};


var tableview = Titanium.UI.createTableView(tableViewOptions);

// create table view event listener
tableview.addEventListener('click', function(e)
{
	var searchValue = e.row.title;
	
	var win = Titanium.UI.createWindow({
		url:'olsearch-json.js',
		title:'Search: ' + searchValue
	});
	
	win.barColor = DEFAULT_BAR_COLOR;
	win.olterm = searchValue;

	Titanium.UI.currentTab.open(win,{animated:true});
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
