//Import Modules and create Variables
const axios = require('axios');
var fs = require('fs');
const { app, dialog } = require('electron').remote

//Import Custom Modules
const settings = require(app.getPath('userData') + '/settings.json')

// Create Variables
var IP = settings.IP;

// Get IP of Hue Bridge
document.getElementById('filepath').innerHTML = app.getPath('userData') + '/settings.json'
document.getElementById('screenplaydelay').value = settings.screenplaydelay
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

function changeRefresh(refresh) {
    if(refresh == "" || refresh <= 0){
        const options = {
            type: 'error',
            defaultId: 2,
            title: 'Error!',
            message: "Refresh Value cannot be less or equal to 0",
        };

        return dialog.showMessageBox(null, options, (resp, checkboxChecked) => {
        });
    }

    let newSettings = settings
    newSettings.screenplaydelay = refresh
    fs.writeFile(app.getPath('userData') + '/settings.json', JSON.stringify(newSettings), function (err) {
        if (err) throw err;
    });

    document.getElementById('screenplaydelayHelp').innerHTML = "Value changed to " + refresh
    setTimeout(() => {
        document.getElementById('screenplaydelayHelp').innerHTML = ""
    }, 3000);
}