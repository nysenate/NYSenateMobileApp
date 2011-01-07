var win = Titanium.UI.currentWindow;
win.backgroundColor = '#13386c';
win.barColor = '#13386c';

//
//  CREATE FIELD ONE
//
var messageView = Titanium.UI.createView({
	top:30,
	left:10,
	backgroundColor:'#eee',
	height:'auto',
	width:'auto',
	borderRadius:10,
	opacity:0.9
});

var messageLabel = Titanium.UI.createLabel({
	color:'#111',
	text:'Welcome to the New York State Senate mobile app. You can find your Senator now, or continue on to view all Senate information.',
	width:'auto',
	height:'auto',
	opacity:0.7
	
});

messageView.add(messageLabel);

win.add(messageView);


//
// CREATE BUTTON
//
var find = Titanium.UI.createButton({
	title:'Find My Senator Now',
	top:340,
	left:30,
	height:30,
	width:250
});

find.addEventListener('click',function(e)
{
	win.close(	{
				transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
				
});

win.add(find);


var skip = Titanium.UI.createButton({
	title:'View all Senate Information',
	top:380,
	left:30,
	height:30,
	width:250
});
win.add(skip);

skip.addEventListener('click',function(e)
{
win.close(	{
			transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
});

