//Import Modules
const { screen, app } = require('electron').remote
const axios = require('axios');

//Import Custom Modules
const settings = require(app.getPath('userData') + '/settings.json')
const colorConv = require('../modules/colorConv.js')
const lampController = require('../modules/lampController.js')

// Create Variables
var IP;
var lightlist;
var groups;

/*
    getPrimaryDisplay():
*/

setInterval(() => {
    document.getElementById('Pixel').innerHTML = JSON.stringify(screen.getCursorScreenPoint())
}, 1000);


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
                                    <button type="button" class="btn btn-dark" onclick="alert('${groups[element].name} - ${element}')">Select</button>
                                </div>
                            </div>
                        </div>
                    </div>          
                    `
                })
            })
    })