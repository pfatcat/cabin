const cors = require('cors');
const express = require('express');
const request = require('request');
let app = express();
app.use(cors());
app.options('*', cors());

const port = 3000;

app.get('/info', (req, res) => { 
    getData(res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function getData(res){
    getEnergyInfo(function(energyData){
        getWeatherInfo(function(weatherData){
            const cabin_data =
            {
                "energyData": energyData,
                "weatherData": weatherData
            }
            res.send(cabin_data);
        })
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


const getWeatherInfo = function(cb){
   const ambientWeatherurl=`https://api.ambientweather.net/v1/devices?apiKey=${config.ambientWeatherAPIKey}&applicationKey=${config.ambientWeatherAppKey}&limit=1`;

   get(ambientWeatherurl, function(error, response, body){
        cb(parseAmbientWeatherResponse(body));
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

    authUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${config.firebaseAPIKey}`;

    post(authUrl, creds, function(error, response, body){
        // authToken = body.idToken;
        config.firebaseAuthToken = body.idToken;
        callback();
    });
 };

 const parseAmbientWeatherResponse = function(awResponse){
    weatherData = JSON.parse(awResponse)
    oakleyRoad = 
         weatherData.filter(function(station){
             return station.macAddress == "48:3F:DA:54:B7:21";
         });
    return oakleyRoad[0].lastData;
 };


