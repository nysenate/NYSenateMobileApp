Ti.include("../globals.js");

var win = Titanium.UI.currentWindow;

win.top = 150;

var geoInProgress = false;
var rowHeight = 40;

if (isIPhone3_2_Plus())
{
	//NOTE: starting in 3.2+, you'll need to set the applications
	//purpose property for using Location services on iPhone
	Ti.Geolocation.purpose = "GPS Lookup for NYSenate";
}


//
//  CREATE FIELD ONE
//
var lblAddress = Titanium.UI.createLabel({
	text:'Street Address',
	top:5,
	left:30,
	width:'auto',
	height:rowHeight,
	color:"#ffffff"
});

win.add(lblAddress);

var txtAddress = Titanium.UI.createTextField({
	hintText:'10 Main Street',
	top:35,
	left:30,
	width:250,
	height:rowHeight,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

win.add(txtAddress);

//
//  CREATE FIELD TWO
//
var lblZipcode = Titanium.UI.createLabel({
	text:'Zipcode',
	top:70,
	left:30,
	width:100,
	height:rowHeight,
	color:"#ffffff"
});

win.add(lblZipcode);

var txtZipcode = Titanium.UI.createTextField({
	hintText:'00000',
	top:100,
	left:30,
	width:250,
	height:rowHeight,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

win.add(txtZipcode);

//
// CREATE BUTTON
//
var btnSearch = Titanium.UI.createButton({
	title:'Search by Address',
	top:150,
	left:30,
	width:250,
	height:40
});
win.add(btnSearch);

var btnGeo = Titanium.UI.createButton({
	title:'Find Senator by GPS Location',
	top:220,
	left:30,
	width:250,
	height:40
});
win.add(btnGeo);


function searchByAddress()
{
	Titanium.API.info("starting address search");
	
	
		var toolActInd = Titanium.UI.createActivityIndicator();
		toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Searching by address...';
		toolActInd.show();
	
		var valZip = txtZipcode.value;
		var valAddress = txtAddress.value;
		
		var searchUrl = "http://nysenatemobile.appspot.com/data/senatorbyaddress.jsp?street=" + escape(valAddress) + "&zip=" + escape(valZip);
		
		Titanium.API.info("searching: " + valAddress + " " + valZip + ": " + searchUrl);
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(30000);
		
		xhr.onload = function()
		{
			
			try
			{
								toolActInd.hide();
				//Titanium.API.info("senator lookup resp: " + this.responseText);
				
				var senatorKey = this.responseText;
				senatorKey = senatorKey.replace(/^\s+/, '');
   				senatorKey = senatorKey.replace(/\s+$/, '');
				
				var senatorItems = getSenatorJSON();
				var senator;
				
				for (i = 0; i < senatorItems.length; i++)
				{
					//Titanium.API.info("checking senator: " + senatorItems[i].senator.url + "==" + senatorKey);
					
					if (senatorItems[i].senator.url.indexOf(senatorKey)!=-1)
					{
						Titanium.API.info("MATCH!");
						
						var imageUrl = senatorItems[i].senator.imageUrl;
	 	
						var idx = imageUrl.lastIndexOf("/");
						imageUrl = imageUrl.substring(idx+1);
						senatorItems[i].senator.imageFileName = imageUrl;
						senatorItems[i].senator.imageUrl = SENATOR_THUMB_BASE + escape(imageUrl);
						senatorItems[i].senator.imageUrlLarge = SENATOR_FULL_BASE + escape(imageUrl);
				
						senatorItems[i].senator.district = senatorItems[i].senator.district.split(' ')[3];
					
						senator = senatorItems[i].senator;
						break;
					}
				}
				
				if (!senator)
				{
						var a = Titanium.UI.createAlertDialog({
							title:'Senator Lookup',
							message:'We could not find a Senator for that address'
						});
						a.show();
				}
				else
				{
				
					var senImage = "../../img/senators/" + senator.key + ".jpg";
				
					var newWin = Titanium.UI.createWindow({
						url:'senator.js',
						title:senator.name,
						senatorName:senator.name,
						senatorImage:senator.imageUrlLarge,
						senatorKey:senator.key,
						senatorUrl:senator.url,
						senatorDistrict:senator.district,
						backgroundImage:'../img/bg/wood.jpg'

					});
						
					Titanium.UI.currentTab.open(newWin,{animated:true});
				}
			}
			catch (E)
			{
				toolActInd.hide();
				alert("There was an error finding your location.");
				debug(E);
			}
			
					
		};
		
		xhr.onerror = function ()
		{

				toolActInd.hide();
				var a = Titanium.UI.createAlertDialog({
					title:'Senator Lookup',
					message:'We could not find a Senator for that address'
				});
				a.show();
		};
		
		xhr.open("GET",searchUrl);
		xhr.send();
	
	
}

	var longitude = null;
	var latitude = null;
	var altitude = null;
	var heading = null;
	var accuracy = null;
	var speed = null;
	var timestamp  = null;
	var altitudeAccuracy = null;
	
		var toolActInd = Titanium.UI.createActivityIndicator();
		toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
		toolActInd.color = 'white';
		toolActInd.message = 'Finding your location...';

		var locationFound = false;
		
	function handleLocation (e)
	{
			
			toolActInd.hide();
		
		
			if (e.error)
			{
				//currentLocation.text = 'error: ' + JSON.stringify(e.error);

				Titanium.UI.createAlertDialog({title:'NY Senate', message:'We could not find your location. Please try again later'}).show();

				Ti.API.error(e.error);

				locationFound = false;
				return;
			}
			else
			{
				locationFound = true;
			}

			longitude = e.coords.longitude;
			latitude = e.coords.latitude;
			altitude = e.coords.altitude;
			heading = e.coords.heading;
			accuracy = e.coords.accuracy;
			speed = e.coords.speed;
			timestamp = e.coords.timestamp;
			altitudeAccuracy = e.coords.altitudeAccuracy;

		//	currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;

			Titanium.API.info('geo - current location: ' + new Date(timestamp) + ' long ' + longitude + ' lat ' + latitude + ' accuracy ' + accuracy);

			var url="http://maps.google.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&sensor=true";
			var xhrgeo = Titanium.Network.createHTTPClient();
			xhrgeo.open('GET',url);
					Ti.API.info('>>> go get data for Rgeocode! ...URL: '+url);
			xhrgeo.onload = function(){
				var json = this.responseText;
				//Ti.API.info(json);
				handleReverseGeo(json);
				/*
				var gotitems = eval('(' + json + ')');
				Ti.API.info('>ADR found:'+ gotitems.results[0].formatted_address);
				adrlabel.text=gotitems.results[0].formatted_address;
				*/
		 
			}
			xhrgeo.send(); 
			
				


				
	}

// reverse geo
				function handleReverseGeo (responseText)
				{
					Ti.API.info("responseText");
					var responseObj = JSON.parse(responseText);//JSON.parse('{"data":' + responseText + '}').data["#data"];

					var places = responseObj.results;
				//	reverseGeo.text = places[0].address;

					for (n = 0; n < places.length; n++)
					{
						if (places[n].types[0] == "street_address")
						{
							Ti.API.info("got address: " + places[n].formatted_address);
						
							for (i = 0; i < places[n].address_components.length; i++)
							{
								if (places[n].address_components[i].types[0] == "postal_code")
								{
								
										txtZipcode.value = places[n].address_components[i].short_name;

								}
								else if (places[n].address_components[i].types[0] == "street_number")
								{
								
										txtAddress.value = places[n].address_components[i].short_name;

								}
								else if (places[n].address_components[i].types[0] == "route")
								{
								
										txtAddress.value += ' ' + places[n].address_components[i].short_name;

								}
								
								
							
							}
							searchByAddress();
							
							break;
						}
					
					}
					//txtZipcode
					
				//	searchByAddress();

				}
				
function getGeo ()
{
	
		toolActInd.show();
		
	
	//
	//  SHOW CUSTOM ALERT IF DEVICE HAS GEO TURNED OFF
	//
	if (Titanium.Geolocation.locationServicesEnabled==false)
	{
		Titanium.UI.createAlertDialog({title:'NY Senate', message:'Your device has geo turned off unfortunately.'}).show();
	}
	else
	{
	
	

		//
		//  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
		//
		// Titanium.Geolocation.ACCURACY_BEST
		// Titanium.Geolocation.ACCURACY_NEAREST_TEN_METERS
		// Titanium.Geolocation.ACCURACY_HUNDRED_METERS
		// Titanium.Geolocation.ACCURACY_KILOMETER
		// Titanium.Geolocation.ACCURACY_THREE_KILOMETERS
		//
		//Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_KILOMETER;

		//Titanium.Geolocation.distanceFilter = 10;

		//
		//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
		//  THIS VALUE IS IN METERS
		//
		//Titanium.Geolocation.distanceFilter = 5;

	
		
		//
		// EVENT LISTENER FOR GEO EVENTS - THIS WILL FIRE REPEATEDLY (BASED ON DISTANCE FILTER)
		//

		/*
		Titanium.Geolocation.addEventListener('location',function(e)
		{
			if (!locationFound)
				handleLocation(e);
		
		});*/		

//
		// GET CURRENT POSITION - THIS FIRES ONCE
		//
		Titanium.Geolocation.getCurrentPosition(function(e)
		{
			handleLocation(e);
		});



	
	}

}

btnSearch.addEventListener('click',function()
{
	searchByAddress();
	
});

btnGeo.addEventListener('click',function()
{
    geoInProgress = true;
	getGeo();
});
