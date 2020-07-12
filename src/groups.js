//Import Modules and create Variables
const axios = require('axios');
const settings = require('../settings.json')
var lightlist;
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
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                            List of all Lights inside this Group, including Brightness and Color Switcher will be here soon.
                            </div>
                          </div>
                        </div>
                      </div>
                    `

                })
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