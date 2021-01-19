firebaseAuthToken = "bogus_token";

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

   httpGetAsync(url, function(response){
        data = JSON.parse(response.responseText)[0];
        document.getElementById("spnIndoorTemp").textContent=data.tempinf;
        document.getElementById("spnOutdoorTemp").textContent=data.tempf;     
    });

};

const getEnergyInfo = function(){
   const url="https://cabin-3bebb.firebaseio.com/solar_stats/2021-01-18.json?auth=";
   let full_url = url + firebaseAuthToken;

    httpGetAsync(full_url, function(response){
        if(response.status === 401){
             firebaseAuth(function(firebaseAuthToken){
                full_url = url + firebaseAuthToken;
                httpGetAsync(full_url, function(wat2){
                    parseFirebaseResponse(wat2);
                });
             });
        }
        else{
            parseFirebaseResponse(response);
        }  
     });
 
 };

 const parseFirebaseResponse = function(fbResponse){
    data = JSON.parse(fbResponse.response);
    most_recent = data[Object.keys(data)[Object.keys(data).length - 1]];
    document.getElementById("spnBatteryBankVoltage").textContent=most_recent.battery_voltage; 
    document.getElementById("spnArrayVoltage").textContent=most_recent.array_voltage;
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


