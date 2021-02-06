const express = require('express')
const request = require('request');
const app = express()
const port = 3000

app.get('/info', (req, res) => { 
    getData(res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function getData(res){
    getEnergyInfo(function(data){
        res.send(data);
    });
}

function get(url, callback){
    request(url, function (error, response, body) {
        callback(error, response, body);
    });
}

function post(url, body, callback){
    request({
        url: url,
        method: "POST",
        json: body
    }, 
    function (error, response, body) {
        callback(error, response, body);
    })
}

const config = require('config');

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

// function httpPostAsync(url, body, callback)
// {
//     let json = JSON.stringify(body);
    
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4)
//             callback(xmlHttp);
//     }

//     xmlHttp.open("POST", url, true); // true for asynchronous 
//     xmlHttp.send(json);
// }

const getWeatherInfo = function(){
   const url="https://api.ambientweather.net/v1/devices/mac-address?apiKey=api+key&applicationKey=app_key&limit=1";

   get(url, function(response){
        data = JSON.parse(response.responseText)[0];
        document.getElementById("spnIndoorTemp").textContent=data.tempinf;
        document.getElementById("spnOutdoorTemp").textContent=data.tempf;     
    });

};

const getEnergyInfo = function(cb){
   const url="https://cabin-3bebb.firebaseio.com/solar_stats/2021-02-06.json?auth=";
   let full_url = url + config.firebaseAuthToken;

    get(full_url, function(error, response, body){
        if(response.statusCode === 401){
             firebaseAuth(function(){
                full_url = url + config.firebaseAuthToken;
                get(full_url, function(error, response, body){
                    cb(parseFirebaseResponse(body));
                });
             });
        }
        else{
            cb(parseFirebaseResponse(body));
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
        email: config.firebaseUsername,
        password: config.firebasePassword,
        returnSecureToken: true
      };

    //authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=web_api";
    authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${config.firebaseAPIKey}`;

    post(authUrl, creds, function(error, response, body){
        // authToken = body.idToken;
        config.firebaseAuthToken = body.idToken;
        callback();
    });
 };


