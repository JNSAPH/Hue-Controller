//Import Modules and create Variables
const request = require('request');
const settings = require('../settings.json')
var groups;
var IP;

// Get IP of Hue Bridge
request('https://discovery.meethue.com/', function (error, response, body) {
    IP = JSON.parse(body)[0].internalipaddress
    document.getElementById('uiIP').innerHTML = IP

    // Get Groups
    /*
        - Make it Possible to Change Hue, Brightness, etc. from this Panel
    */
    request(`http://${IP}/api/${settings.username}/groups`, function (error, response, body) {
        groups = JSON.parse(body)
        Object.keys(groups).forEach(element => {
            document.getElementById('LightList').innerHTML +=
                `
                <div class="col">
                    <div class="card lcard">
                    <div class="card-body">
                        <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${groups[element].name}</p>
                        <p style="text-align: center" clasS="md-0">ID: ${element} | ${groups[element].type == "Entertainment" ? "Entertainment Area" : "Room"}</p>
                        <div class="btn-group">
                            <button type="button" class="btn btn-success" onclick="LightSwitch(${element}, true)">On</button>
                            <button type="button" class="btn btn-danger" onclick="LightSwitch(${element}, false)">Off</button>
                        </div>

                    </div>
                </div>
            </div>          
            `
        });

    })
})


function LightSwitch(roomid, state) {
    LightList = groups[roomid].lights
    LightList.forEach(element => {
        request.put({
            url: `http://${IP}/api/${settings.username}/lights/${element}/state`,
            body: `{"on":${state}}`
        })

        console.log(`Switching Lamps ${element} ${state}`)        
    });


}