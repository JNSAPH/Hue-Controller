//Import Modules
const axios = require('axios');
const { app,dialog } = require('electron').remote
var fs = require('fs');

//Create Variables
var IP;

axios.get('https://discovery.meethue.com/')
    .then((responseip) => {
        IP = responseip.data[0].internalipaddress
        document.getElementById('uiIP').innerHTML = IP

        if (IP !== null) {
            // Bridge found
            setInterval(() => {
                axios({
                    method: 'post',
                    url: `http://${IP}/api/`,
                    data: { "devicetype": "my_hue_app#iphone peter" }
                }).then((response) => {
                    console.log(response.data)
                    if (response.data[0].success.username == undefined) {
                        console.log("Waiting for Link")

                    } else {
                        const obj = {
                            username: response.data[0].success.username,
                            IP: IP
                        }
                        fs.appendFile(app.getPath('userData') + '/settings.json', JSON.stringify(obj), function (err) {
                            if (err) throw err;
                            console.log('Created Settings File!');
                            app.relaunch()
                            app.exit()
                        });

                    }
                })

            }, 5000);

        } else {
            // No Bridge found
            const options = {
                type: 'error',
                defaultId: 2,
                title: 'Error!',
                message: "You don't seem to have a Bridge",
                detail: "Sorry, i couldn't find a Bridge connected to the same Network you're currently in. Please check and try again.\nIf you can't fix this Problem please openup a Issue on GitHub",
            };

            dialog.showMessageBox(null, options, (resp, checkboxChecked) => {
                console.log(resp);
                console.log(checkboxChecked);
            });
        }

    })