//Import Modules and create Variables
const axios = require('axios');
const colorConv = require('../modules/colorConv.js')
const settings = require('../settings.json')

var IP;
var LightList;

axios.get('https://discovery.meethue.com/') //Get IP of Hue Bridge (Will later be replaced)
    .then((response) => {
        IP = response.data[0].internalipaddress
        document.getElementById('uiIP').innerHTML = IP

        axios.get(`http://${IP}/api/${settings.username}/lights`)
            .then((response) => {
                LightList = response.data

                Object.keys(LightList).forEach(element => {
                    document.getElementById('LightList').innerHTML +=
                        `
                    <div class="card lcard">
                        <div class="card-body ${LightList[element].state.reachable == false ? "offline" : ""}">
                            <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${LightList[element].name}</p>
                            <p style="text-align: center" clasS="md-0">Lamp ID: ${element} | ${LightList[element].state.reachable == true ? "Online" : "Offline"}</p>
                            <div class="btn-group">
                                <button type="button" class="btn btn-success" onclick="LightSwitch(${element}, true)">On</button>
                                <button type="button" class="btn btn-danger" onclick="LightSwitch(${element}, false)">Off</button>
                            </div>
                            <div class="form-group">
                                <input class="form-control-range" type="range" max="254" value="${LightList[element].state.on == true ? LightList[element].state.bri : 0}" onchange="LightStateBri(${element}, this.value)" id="Lamp${element}">
                                <br>
                                <input type="color" value="${colorConv.xyBriToRgb(LightList[element].state.xy[0], LightList[element].state.xy[1], LightList[element].state.bri)}" id="head" name="head" onchange="LightStateHue(${element}, this.value)">
                            </div>
                        </div>
                    </div>
                    `
                });
            })
    })


// Lamp switches
function LightSwitch(lampid, state) {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": state }
    });

    // Change Brightness Switch to either 0 or Lamps Brightness 
    if (state == true) {
        document.getElementById('Lamp' + lampid).value = LightList[lampid].state.bri
    } else {
        document.getElementById('Lamp' + lampid).value = 0
        Refresh();
    }

    console.log(LightList)
    console.log(`Switching Lamp ${lampid} ${state}`)
}

function LightStateHue(lampid, hex) {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": true, "xy": JSON.parse(colorConv.hexToRgb(hex)) }
    })

    document.getElementById('Lamp' + lampid).value = LightList[lampid].state.bri
    console.log(`Changed Lamp ${lampid} to ${hex} Hex`)
}

function LightStateBri(lampid, bri) {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": true, "bri": JSON.parse(bri) }
    }).then(function (response) { console.log(response.data) })

    console.log(`Changed Lamp ${lampid} to ${bri} Brightness`)
}

function Refresh() {
    axios(`http://${IP}/api/${settings.username}/lights`)
        .then(function (response) {
            LightList = response.data
        })
}