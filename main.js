function getCabinInfo(){


    httpGetAsync("http://localhost:3000/info/", function(data){
        const cabinData = JSON.parse(data.responseText);
        console.log(cabinData)
        document.getElementById("spnBatteryBankVoltage").textContent=cabinData.energyData.battery_voltage; 
        document.getElementById("spnArrayVoltage").textContent=cabinData.energyData.array_voltage;
        document.getElementById("spnIndoorTemp").textContent=cabinData.weatherData.tempinf; 
        document.getElementById("spnOutdoorTemp").textContent=cabinData.weatherData.tempf;
    })
}

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