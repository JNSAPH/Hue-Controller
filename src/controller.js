//Import Modules and Stuff
const request = require('request');
const settings = require('../settings.json')
var IP;
var LightList;

// Get IP of Hue Bridge
request('https://discovery.meethue.com/', function (error, response, body) {
    IP = JSON.parse(body)[0].internalipaddress
    document.getElementById('uiIP').innerHTML = IP

    // List Lights
    request(`http://${IP}/api/${settings.username}/lights`, function (error, response, body) {
        LightList = JSON.parse(body)

        // Get Number of Lights and make it usefull
        var NumberOfLights = Object.keys(LightList)

        NumberOfLights.forEach(element => {
            // Create a Card for each Light
            document.getElementById('LightList').innerHTML +=
                `
            <div class="card">
                <div class="card-body">
                    <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${LightList[element].name}</p>
                    <p style="text-align: center" clasS="md-0">Lamp ID: ${element} | ${LightList[element].state.reachable == true ? "Online" : "Offline"}</p>
                    <div class="btn-group">
                        <button type="button" class="btn btn-success" onclick="LightSwitch(${element}, true)">On</button>
                        <button type="button" class="btn btn-danger" onclick="LightSwitch(${element}, false)">Off</button>
                    </div>
                </div>
            </div>
            `
        });
    });
});

function LightSwitch(lampid, on) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"on":${on}}`
    })
}

function LightState(lampid, bri, hue, sat) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"on":true, "sat": ${sat}, "bri": ${bri}, "hue": ${hue}}`
    })
}
