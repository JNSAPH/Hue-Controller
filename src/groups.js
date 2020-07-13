//Import Modules and create Variables
const axios = require('axios');
const settings = require('../settings.json')
const colorConv = require('../modules/colorConv.js')
var lightlist;
var groups;
var IP;

axios.get('https://discovery.meethue.com/')
    .then((response) => {
        IP = response.data[0].internalipaddress
        document.getElementById('uiIP').innerHTML = IP
        axios(`http://${IP}/api/${settings.username}/lights`)
        .then(function (response) {
            lightlist = response.data
        })

        axios.get(`http://${IP}/api/${settings.username}/groups`)
            .then((response) => {
                groups = response.data

                Object.keys(groups).forEach(element => {
                    document.getElementById('GroupList').innerHTML +=
                        `
                        <div class="col">
                            <div class="card lcard">
                            <div class="card-body">
                                <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${groups[element].name}</p>
                                <p style="text-align: center" clasS="md-0">ID: ${element} | ${groups[element].type == "Entertainment" ? "Entertainment Area" : "Room"}</p>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-success" onclick="MasterSwitch(${element}, true)">On</button>
                                    <button type="button" class="btn btn-danger" onclick="MasterSwitch(${element}, false)">Off</button>
                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal${element}">More</button>
                                </div>
                            </div>
                        </div>
                    </div>          
                    `

                    document.getElementById('modals').innerHTML +=
                        `
                        <div class="modal fade" id="modal${element}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">${groups[element].type} | ${groups[element].name}</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><img alt="Close" src="../assets/Icons/close.svg"></span>
                              </button>
                            </div>
                            <div class="modal-body">
                                ${LampList(element)}
                            </div>
                          </div>
                        </div>
                      </div>
                    `

                })
            })
    })

Refresh();

// Lightcards
function LampList(roomid) {
    let LightList = groups[roomid].lights
    let List = ""; // Will be undefined unless = "" => Find fix?

    LightList.forEach(element => {
        // Add Lightcard for every Lamp
        List +=
            `
            <div class="card">
                <div class="card-body lcard ${lightlist[element].state.reachable == false ? "offline" : ""}">
                    <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${lightlist[element].name}</p>
                    <p style="text-align: center" clasS="md-0">Lamp ID: ${element} | ${lightlist[element].state.reachable == true ? "Online" : "Offline"}</p>
                <div class="btn-group">
                    <button type="button" class="btn btn-success" onclick="LightSwitch(${element}, true)">On</button>
                    <button type="button" class="btn btn-danger" onclick="LightSwitch(${element}, false)">Off</button>
                </div>
                <div class="form-group">
                    <input class="form-control-range" type="range" max="254" value="${lightlist[element].state.on == true ? lightlist[element].state.bri : 0}" onchange="LightStateBri(${element}, this.value)" id="Lamp${element}">
                    <br>
                    <input type="color" value="${colorConv.xyBriToRgb(lightlist[element].state.xy[0], lightlist[element].state.xy[1], lightlist[element].state.bri)}" id="head" name="head" onchange="LightStateHue(${element}, this.value)">
                </div>
                </div>
            </div>
        `
    })
    return List;
}

/*
    Move these into a Module
    I just want to get this working and go to sleep
    I have school tomorrow ,_,
*/

function MasterSwitch(roomid, state) {
    let LightList = groups[roomid].lights

    LightList.forEach(element => {
        axios({
            method: 'put',
            url: `http://${IP}/api/${settings.username}/lights/${element}/state`,
            data: { "on": state }
        });

        console.log(`Switching Lamps ${element} ${state}`)
    });
}

function LightSwitch(lampid, state) {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": state }
    });

    // Change Brightness Switch to either 0 or Lamps Brightness 
    if (state == true) {
        document.getElementById('Lamp' + lampid).value = lightlist[lampid].state.bri
    } else {
        document.getElementById('Lamp' + lampid).value = 0
        Refresh();
    }

    console.log(`Switching Lamp ${lampid} ${state}`)
}

function LightStateHue(lampid, hex) {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": true, "xy": JSON.parse(colorConv.hexToRgb(hex)) }
    })

    document.getElementById('Lamp' + lampid).value = lightlist[lampid].state.bri
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
            lightlist = response.data
        })
}