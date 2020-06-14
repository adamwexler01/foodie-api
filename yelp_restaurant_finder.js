const http = require("http")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const yelpAPI = "https://api.yelp.com/v3/businesses/"
const yelpAPISearch = yelpAPI + "search"
const token = process.env.TOKEN

http.createServer().on('request', async (request, response) => {
   gettingRestaurants(yelpAPISearch, request)
         .then(randomlySelectRestaurant)
				 .then(sendResultToClient)
				 .then(result => {
				 		response.writeHead(result.statusCode, result.headers);
   					response.write(result.body);
   					response.end();
				 	})
				 .catch(errorHandler);

}).listen(process.env.PORT || 8081);

var gettingRestaurants = function(data, request) {
  return new Promise(function (resolve, reject) {
    var lat = request.headers.latitude
    var long = request.headers.longitude
    var categoriesSplit = request.headers.categories.split(',')
    const set = new Set(categoriesSplit)
    categoriesSplit = [...set]
    var categories = ""
    categoriesSplit.forEach(function(element) {
      if(element.valueOf() == "asian".valueOf()){
        element = "panasian"
      }
      categories += element + ","
    });

    categories = categories.slice(0, -1)
    var radiusMiles = request.headers.radius.split(' ')
    var radiusMeters = Math.trunc(radiusMiles[0] / 0.00062137)
    //var open_at = request.headers.open_at
    data += "?term=restaurants&latitude=" + lat + "&longitude=" + long + "&radius=" + radiusMeters + "&categories=" + categories
    var limit = 50
    data += "&limit=" + limit
    var open_now = true
    data += "&open_now=" + open_now
    var xhr = new XMLHttpRequest();
    xhr.timeout = 2000;
    xhr.ontimeout = function () {
      reject('timeout');
    }
    xhr.open('get', data, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onreadystatechange = function(e) {
      console.log("url: " + data + "readyState:before: " + xhr.readyState);
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.status);
        }
      }
    }
    xhr.send();
  })
}

var randomlySelectRestaurant = function(data){
  return new Promise(function(resolve, reject){
    var parsedData = JSON.parse(data)
    console.log("Length: " + parsedData.businesses.length)
    var random = Math.random() * parsedData.businesses.length;
    var finalValue = Math.round(random)
    console.log("Random: " + finalValue);
    if(parsedData.businesses[finalValue] != undefined){
      console.log("Object: " + JSON.stringify(parsedData.businesses[finalValue]))
      resolve(JSON.stringify(parsedData.businesses[finalValue]))
    } else {
      reject(parsedData.businesses[finalValue])
    }
  })
}

var sendResultToClient = function(data){
  return {
    statusCode: 200,
    headers: {
        "content-type": "application/json"
    },
    body: data,
	}
}

function errorHandler(error) {
  console.log("handleError: " + error);
}