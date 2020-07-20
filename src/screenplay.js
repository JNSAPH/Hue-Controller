//Import Modules
const { screen, app } = require('electron').remote
const axios = require('axios');
var robot = require("robotjs");

//Import Custom Modules
const settings = require(app.getPath('userData') + '/settings.json')
const colorConv = require('../modules/colorConv.js')
const lampController = require('../modules/lampController.js')

// Create Variables
var IP = settings.IP;
var lightlist;
var groups;
var ColorSet;

document.getElementById('uiIP').innerHTML = IP
document.getElementById('primaryDisplayID').innerHTML = screen.getPrimaryDisplay().id
document.getElementById('primaryDisplayStats').innerHTML = `${screen.getPrimaryDisplay().size.width} x ${screen.getPrimaryDisplay().size.height}`

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

function roomSelector(groupid) {
    // Console Log ScreenPlay (for Debug purposes)
    console.log("Screenplay activated for GroupID: " + groupid)

    // Clear Intervall, just incase User decides to Switch Rooms.
    clearInterval(ColorSet)

    // Get Variables to Calculate where the Pixel Data should come from.
    let lights = groups[groupid].lights
    let x = screen.getPrimaryDisplay().size.width / 2
    let y = screen.getPrimaryDisplay().size.height / 2

    // Set Hue for each Light.
    ColorSet = setInterval(() => {
        var hex = "#" + robot.getPixelColor(x, y);
        lights.forEach(element => {
            lampController.LightStateHueQ(parseInt(element), hex)
        })
    }, settings.screenplaydelay);
}

function selectPixel(groupid) {
    clearInterval(ColorSet)

    // Get Variables to Calculate where the Pixel Data should come from.
    let lights = groups[groupid].lights
    let x = screen.getCursorScreenPoint().x
    let y = screen.getCursorScreenPoint().y

    // Set Hue for each Light.
    ColorSet = setInterval(() => {
        var hex = "#" + robot.getPixelColor(x, y);
        lights.forEach(element => {
            lampController.LightStateHueQ(parseInt(element), hex)
        })
    }, settings.screenplaydelay);
}

console.log('%c Currently you can only change your Caputre Point using the Console.\n Do this by typing in selectPixel(%int) and as %int the Group ID you want affected.', 'background: #222; color: #bada55')