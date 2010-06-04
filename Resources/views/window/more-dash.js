var win = Titanium.UI.currentWindow;

var data = [];
var labels = ['Video','Photos','Committees','Contact','About'];
var img = ['../../img/tabs/_world.png','../../img/tabs/_world.png','../../img/tabs/_world.png','../../img/tabs/_world.png','../../img/tabs/_world.png'];
var imgSelect = ['../../img/tabs/_world.png','../../img/tabs/_world.png','../../img/tabs/_world.png','../../img/tabs/_world.png','../../img/tabs/_world.png'];

for (var c=0;c<labels.length;c++)
{
	data[c] = Titanium.UI.createDashboardItem({
		image:img[c],
		selectedImage:imgSelect[c],
		label:labels[c]
	});
}

var dashboard = Titanium.UI.createDashboardView({
	data:data,
	top:30,
	bottom:10
});

win.add(dashboard);

var label = Titanium.UI.createLabel({
	text:"Click and hold to re-order or delete",
	width:"auto",
	top:10,
	color:"#aaaaaa",
	height:"auto"
});
win.add(label);


var cancel = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.DONE
});
cancel.addEventListener('click', function()
{
	dashboard.stopEditing();
});

dashboard.addEventListener('edit',function()
{
	win.rightNavButton = cancel;
});

dashboard.addEventListener('commit',function()
{
	win.rightNavButton = null;
});

dashboard.addEventListener('click',function(e)
{
	if (e.item.label == 'account')
	{
		e.item.badge = 10;
	}
	else if (e.item.label == 'cases')
	{
		for (var c=0;c<data.length;c++)
		{
			if (data[c].label=='account')
			{
				data[c].badge = 0;
				break;
			}
		}
	}
	else
	{
		try
		{
			var rect = e.location;
			var transform = Ti.UI.create2DMatrix().scale(0);
			var view = Ti.UI.createView({
				backgroundColor:'black',
				transform:transform,
				opacity:0,
				top:rect.y,
				left:rect.x,
				height:rect.height,
				width:rect.width
			});
			var close = Ti.UI.createButton({
				title:'Close',
				width:100,
				height:30
			});
			view.add(close);
			win.add(view);
			var animation = Ti.UI.createAnimation();
			animation.left = 0;
			animation.right = 0;
			animation.top = 0;
			animation.bottom = 0;
			animation.width = 320;
			animation.height = 460;
			animation.opacity = 1;
			animation.duration = 500;
			animation.transform = Ti.UI.create2DMatrix();
			view.animate(animation);
			close.addEventListener('click',function()
			{
				view.animate({
					top:rect.y,
					left:rect.x,
					height:rect.height,
					width:rect.width,
					opacity:0,
					duration:400
				},function()
				{
					win.remove(view);
				});
			});
		}
		catch(E)
		{
			Ti.API.error("ERROR = "+E);
		}
	}
});


