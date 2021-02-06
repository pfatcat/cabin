const express = require('express')
const request = require('request');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  getEnergyInfo(res)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function get(url, callback){
    request(url, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        callback(body);
    });
}


const config = require('config');
firebaseAuthToken = config.firebaseAuthToken;
console.dir(firebaseAuthToken);

function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpPostAsync(url, body, callback)
{
    let json = JSON.stringify(body);
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }

    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.send(json);
}

const getWeatherInfo = function(){
   const url="https://api.ambientweather.net/v1/devices/mac-address?apiKey=api+key&applicationKey=app_key&limit=1";

   get(url, function(response){
        data = JSON.parse(response.responseText)[0];
        document.getElementById("spnIndoorTemp").textContent=data.tempinf;
        document.getElementById("spnOutdoorTemp").textContent=data.tempf;     
    });

};

const getEnergyInfo = function(res){
   const url="https://cabin-3bebb.firebaseio.com/solar_stats/2021-02-06.json?auth=";
   let full_url = url + firebaseAuthToken;

    get(full_url, function(response){
        if(response.status === 401){
             firebaseAuth(function(firebaseAuthToken){
                full_url = url + firebaseAuthToken;
                httpGetAsync(full_url, function(wat2){
                    parseFirebaseResponse(wat2);
                });
             });
        }
        else{
            res.send(parseFirebaseResponse(response));
        }  
     });
 
 };

 const parseFirebaseResponse = function(fbResponse){
    data = JSON.parse(fbResponse);
    most_recent = data[Object.keys(data)[Object.keys(data).length - 1]];
    return most_recent;
 };

 const firebaseAuth = function(callback){
    const creds = {
        email: "user",
        password: "pass",
        returnSecureToken: true
      };

    authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=web_api";

    httpPostAsync(authUrl, creds, function(wat){
        callback(JSON.parse(wat.response).idToken);
    });
 };


