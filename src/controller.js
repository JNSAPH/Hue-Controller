//Import Modules and create Variables
const request = require('request');
const settings = require('../settings.json')
var IP;
var LightList;

// Get IP of Hue Bridge
request('https://discovery.meethue.com/', function (error, response, body) {
    IP = JSON.parse(body)[0].internalipaddress
    document.getElementById('uiIP').innerHTML = IP

    // Get all Lamps connected to the Bridge
    request(`http://${IP}/api/${settings.username}/lights`, function (error, response, body) {
        LightList = JSON.parse(body)

        // Create a Card for every Lamp inside the System
        /*
            - Research if there is a better way to do this
            - Gray-out Cards if Lamp is Offline, Unreachable or Unsupported
        */
        Object.keys(LightList).forEach(element => {
            document.getElementById('LightList').innerHTML +=
            `
            <div class="card">
                <div class="card-body" data-toggle="modal" data-target="#${element}Modal">
                    <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${LightList[element].name}</p>
                    <p style="text-align: center" clasS="md-0">Lamp ID: ${element} | ${LightList[element].state.reachable == true ? "Online" : "Offline"}</p>
                    <div class="btn-group">
                        <button type="button" class="btn btn-success" onclick="LightSwitch(${element}, true)">On</button>
                        <button type="button" class="btn btn-danger" onclick="LightSwitch(${element}, false)">Off</button>
                    </div>

                    <div class="input-group">
                        <input type="text" placeholder="Color (0-65535)" class="form-control" onchange="LightStateHue(${element}, this.value)">
                        <input type="text" placeholder="Brightness (0-254)" class="form-control" onchange="LightStateBri(${element}, this.value)">
                    </div>
                </div>
            </div>
            `
        });
    });
});

// Lamp switches
function LightSwitch(lampid, state) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"on":${state}}`
    })
    console.log(`Switching Lamp ${lampid} ${on}`)
}

function LightStateHue(lampid, hue) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"hue": ${hue}}`
    })

    console.log(`Changed Lamp ${lampid} to ${hue} Hue`)
}

function LightStateBri(lampid, bri) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"bri": ${bri}}`
    })

    console.log(`Changed Lamp ${lampid} to ${hue} Brightness`)
}