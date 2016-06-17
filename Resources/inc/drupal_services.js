

var NYSENATE_SERVICES_ENDPOINT = 'http://www.nysenate.gov/services/json';
var NYSENATE_DOMAIN = 'nysenate.gov';
var NYSENATE_APIKEY = '55f7ea8c500758c8a9230fb9121abc36';

//service: views.get node.get

function doNYSenateServiceCall (drupal_method, drupal_method_key, drupal_method_val, callbackFunc, errorFunc)
{
	doServiceCall (NYSENATE_SERVICES_ENDPOINT, NYSENATE_DOMAIN, NYSENATE_APIKEY, drupal_method, drupal_method_key, drupal_method_val, callbackFunc, errorFunc);
}

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function rnd() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}



function doServiceCall (serviceUrl, domain, apikey, drupal_method, drupal_method_keys, drupal_method_vals, callbackFunc, errorFunc)
{

var date = new Date();
var obj = {
  domain_name: domain,
  domain_time_stamp: date.getTime() + "",
  nonce: rnd() /* just a random function that returns a random string */
  /*sessid: sessionid //not using sessionid's because we have API keys*/
};

// create the hash using secure hash algorithm using 256bit encryption
obj.hash = HMAC_SHA256_MAC(apikey, obj.domain_time_stamp+";"+obj.domain_name+";"+obj.nonce+";"+drupal_method);

// this is your view name, be sure your authentication key allows access to views.get
obj.method = drupal_method;

for (n = 0; n < drupal_method_keys.length; n++)
{
	var drupal_method_key = drupal_method_keys[n];
	var drupal_method_val = drupal_method_vals[n];
	obj[drupal_method_key] = drupal_method_val;
}



//Ti.API.debug("sending to: " + serviceUrl + " JSON: " + JSON.stringify(obj));

// create the connection to our services module and send json data via POST
var xhr = Titanium.Network.createHTTPClient();
xhr.setTimeout(30000);

// once our data has returned the onload function is used
xhr.onload = callbackFunc;

if (errorFunc)
{
	xhr.onerror = errorFunc;
}
else
{
	xhr.onerror = function (e)
	{
		Ti.API.debug("drupal service call error: " + e.error);
		//Ti.API.debug(e);
	};
}
xhr.open("POST", serviceUrl);
xhr.send(obj);

}
