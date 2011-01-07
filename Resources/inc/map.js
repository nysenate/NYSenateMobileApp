var win = Ti.UI.currentWindow;


var kml = win.kml;
var routeName = win.title;
var routeColor = "#191970";


var data = [];

var mapview = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
  region:{latitude:40.75, longitude:-74.37, latitudeDelta:.5, longitudeDelta:.5},
	animate:true,
	regionFit:true,
	userLocation:true,
	annotations:[]
});

 
win.add(mapview);

function loadKMLPoly (kmlUrl)
{
	var centerLat;
	var centerLon;
	var centerDelta = 5;
	
   var xhr = Titanium.Network.createHTTPClient();
    xhr.open('GET',kmlUrl);

    xhr.onload = function(){
        // Now parse the XML 
        var xml = this.responseXML;
        var points = [];
        
        var coords = xml.documentElement.getElementsByTagName("coordinates");
        
        
        for(var cc=0; cc < coords.length; cc++) {
            var line = coords.item(cc);
            var str = line.firstChild.text.split("\n");
           
            for(dd = 0; dd < str.length; dd++) {
            	
            	if (str[dd].length > 0)
            	{            	
				//	Ti.API.info("coord" + dd + ": " + str[dd]);

					var loc = str[dd].split(',');
					
					if(loc[0] && loc[1]) {
					
						if (!centerLat)
							centerLat = [loc[1],loc[1]];
							
						centerLat[0] = Math.max(centerLat[0],loc[1]);
						centerLat[1] = Math.min(centerLat[1],loc[1]);
					//	Ti.API.info("lat max:" + centerLat[0] + " min:" + centerLat[1]);
						
						if (!centerLon)
							centerLon = [loc[0],loc[0]];
							
						centerLon[0] = Math.min(centerLon[0],loc[0]);
						centerLon[1] = Math.max(centerLon[1],loc[0]);
				//		Ti.API.info("long max:" + centerLon[1] + " min:" + centerLon[0]);
						

						points.push({latitude: loc[1], 
							 longitude: loc[0]});
					}
				}
            }
            
        }

        var route = {
                name:routeName,
                points:points,
                color:routeColor,
                width:3
            };
 
        // add a route
        mapview.addRoute(route);
        
       var latDif = (Math.abs(centerLat[1] - centerLat[0])/2);
       var lonDif = (Math.abs(centerLon[1] - centerLon[0])/2);
       centerDelta = centerDelta * latDif;
       Ti.API.info("diff: " + latDif + "," + lonDif);
       centerLat[2] = centerLat[1] + latDif;
       centerLon[2] = centerLon[0] + lonDif;

		Ti.API.info("map center: " + centerLat[2] + "," + centerLon[2]);
		
       mapview.setLocation({latitude:centerLat[2],longitude:centerLon[2],latitudeDelta:centerDelta,longitudeDelta:centerDelta});
    };  
    xhr.send();
    
  }



loadKMLPoly (kml);
