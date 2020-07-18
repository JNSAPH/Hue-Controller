//Import Modules
const { screen, app } = require('electron').remote
const axios = require('axios');
var robot = require("robotjs");

//Import Custom Modules
const settings = require(app.getPath('userData') + '/settings.json')
const colorConv = require('../modules/colorConv.js')
const lampController = require('../modules/lampController.js')

// Create Variables
var IP;
var ColorSet;

/*
    getPrimaryDisplay():
*/

/*
setInterval(() => {
    var hex = robot.getPixelColor(screen.getCursorScreenPoint().x, screen.getCursorScreenPoint().y);
    lampController.LightStateHue(5, "#"+hex)
    console.log(hex)
}, 500);
*/

document.getElementById('primaryDisplayID').innerHTML = screen.getPrimaryDisplay().id
document.getElementById('primaryDisplayStats').innerHTML = `${screen.getPrimaryDisplay().size.width} x ${screen.getPrimaryDisplay().size.height}`

axios.get('https://discovery.meethue.com/')
    .then((reponseIP) => {
        IP = reponseIP.data[0].internalipaddress
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
                                    <button type="button" class="btn btn-dark" onclick="roomSelector(${element})">Select</button>
                                </div>
                            </div>
                        </div>
                    </div>          
                    `
                })
            })
    })

function roomSelector(groupid){
    // Clear Intervall, just incase User decides to Switch Rooms.
    clearInterval(ColorSet)

    // Get Variables to Calculate where the Pixel Data should come from.
    let lights = groups[groupid].lights
    let x = screen.getPrimaryDisplay().size.width / 2
    let y = screen.getPrimaryDisplay().size.height / 2
    
    // Set Hue for each Light.
    ColorSet = setInterval(() => {
        lights.forEach(element => {
            var hex = robot.getPixelColor(x, y);
            console.log(groupid + " | " + element + " | " + hex)
            console.log(lights)
            //lampController.LightStateHue(element, "#"+hex)
        })
    }, 1500);
}
