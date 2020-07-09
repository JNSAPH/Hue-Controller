//Import Modules and create Variables
const request = require('request');
const settings = require('../settings.json')
var IP;

// Get IP of Hue Bridge
request('https://discovery.meethue.com/', function (error, response, body) {
    IP = JSON.parse(body)[0].internalipaddress
    document.getElementById('uiIP').innerHTML = IP

    // Get Bridge Config
    request(`http://${IP}/api/${settings.username}/config`, function (error, response, body) {
        list = JSON.parse(body)
        document.getElementById('bridgename').innerHTML = list.name
        document.getElementById('bridgeid').innerHTML = list.bridgeid
        document.getElementById('bridgemac').innerHTML = list.mac
        document.getElementById('bridgelocatime').innerHTML = list.locatime 
        document.getElementById('bridgeapiversion').innerHTML = list.apiversion
        document.getElementById('bridgeversion').innerHTML = list.swversion
    })

    // Get Rooms
})