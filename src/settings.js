//Import Modules and create Variables
const axios = require('axios');
const { app } = require('electron').remote

//Import Custom Modules
const settings = require(app.getPath('userData') + '/settings.json')

// Create Variables
var IP;

// Get IP of Hue Bridge

document.getElementById('filepath').innerHTML = app.getPath('userData') + '/settings.json'


axios.get('https://discovery.meethue.com/')
    .then((response) => {
        IP = response.data[0].internalipaddress
        document.getElementById('uiIP').innerHTML = IP

        axios.get(`http://${IP}/api/${settings.username}/config`)
            .then((response) => {
                var list = response.data

                document.getElementById('bridgename').innerHTML = list.name
                document.getElementById('bridgeid').innerHTML = list.bridgeid
                document.getElementById('bridgemac').innerHTML = list.mac
                document.getElementById('bridgelocatime').innerHTML = list.locatime
                document.getElementById('bridgeapiversion').innerHTML = list.apiversion
                document.getElementById('bridgeversion').innerHTML = list.swversion
            })
    })