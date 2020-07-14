// Decleare Variables
let IP;
let LightList

axios.get('https://discovery.meethue.com/')
.then((response) => {
    IP = response.data[0].internalipaddress
    document.getElementById('uiIP').innerHTML = IP
})

exports.IP = IP

exports.Refresh = () => {
    axios(`http://${IP}/api/${settings.username}/lights`)
        .then(function (response) {
            LightList = response.data
        })
}

// Lamp switches
exports.LightSwitch = (lampid, state) => {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": state }
    });

    // Change Brightness Switch to either 0 or Lamps Brightness 
    if (state == true) {
        document.getElementById('Lamp' + lampid).value = LightList[lampid].state.bri
    } else {
        document.getElementById('Lamp' + lampid).value = 0
        this.Refresh();
    }

    console.log(LightList)
    console.log(`Switching Lamp ${lampid} ${state}`)
}

// Change Lamp Color
/*
    Requires colorConv Module!
    There is an Error inhere somewhere. I can't find it at the moment but i'm sure i'll find it someday!
*/
exports.LightStateHue = (lampid, hex) => {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": true, "xy": JSON.parse(colorConv.hexToRgb(hex)) }
    })

    this.Refresh();
    document.getElementById('Lamp' + lampid).value = LightList[lampid].state.bri
    console.log(`Changed Lamp ${lampid} to ${hex} Hex`)
}

// Change Lamp Brightness
exports.LightStateBri = (lampid, bri) => {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": true, "bri": JSON.parse(bri) }
    })

    this.Refresh();
    console.log(`Changed Lamp ${lampid} to ${bri} Brightness`)
}

// Master Switch for all Lamps inside a Group
exports.MasterSwitch = (roomid, state) => {
    let LightList = groups[roomid].lights

    LightList.forEach(element => {
        axios({
            method: 'put',
            url: `http://${IP}/api/${settings.username}/lights/${element}/state`,
            data: { "on": state }
        });

        this.Refresh();
        console.log(`Switching Lamps ${element} ${state}`)
    });
}