//Import Modules
const { app } = require('electron').remote
const axios = require('axios');

//Import Custom Modules
const colorConv = require('../modules/colorConv.js')
const lampController = require('../modules/lampController.js')
const settings = require(app.getPath('userData') + '/settings.json')

// Create Variables
var IP = settings.IP;
var LightList;

document.getElementById('uiIP').innerHTML = IP

axios.get(`http://${IP}/api/${settings.username}/lights`)
    .then((response) => {
        LightList = response.data

        Object.keys(LightList).forEach(element => {
            document.getElementById('LightList').innerHTML +=
                `
            <div class="card lcard">
                <div class="card-body ${LightList[element].state.reachable == false ? "offline" : null}">
                    <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${LightList[element].name}</p>
                    <p style="text-align: center" class="md-0">Lamp ID: ${element} | ${LightList[element].state.reachable == true ? "Online" : "Offline"}</p>
                    <div class="btn-group">
                        <button type="button" class="btn btn-success" onclick="lampController.LightSwitch(${element}, true)">On</button>
                        <button type="button" class="btn btn-danger" onclick="lampController.LightSwitch(${element}, false)">Off</button>
                    </div>
                    <div class="form-group">
                        <input id="Lamp${element}" class="form-control-range" type="range" max="254" value="${LightList[element].state.on == true ? LightList[element].state.bri : 0}" onchange="lampController.LightStateBri(${element}, this.value)">
                        <input type="color" value="${colorConv.xyBriToRgb(LightList[element].state.xy[0], LightList[element].state.xy[1], LightList[element].state.bri)}" id="head" name="head" onchange="lampController.LightStateHue(${element}, this.value)">
                    </div>
                </div>
            </div>
            `
        });
    })


