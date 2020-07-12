//Import Modules and create Variables
const axios = require('axios');
const settings = require('../settings.json')
var groups;
var IP;

axios.get('https://discovery.meethue.com/')
    .then((response) => {
        IP = response.data[0].internalipaddress
        document.getElementById('uiIP').innerHTML = IP

        axios.get(`http://${IP}/api/${settings.username}/groups`)
            .then((response) => {
                groups = response.data

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