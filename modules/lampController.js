// Decleare Variables
const settings = require(app.getPath('userData') + '/settings.json')
var IP = settings.IP;
var LightList;

exports.Refresh = () => {
    axios(`http://${IP}/api/${settings.username}/lights`)
        .then(function (reponseIP) {
            LightList = reponseIP.data
        })
}

this.Refresh()

// Lamp switches
exports.LightSwitch = (lampid, state) => {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": state }
    });

    // Change Brightness Switch to either 0 or Lamps Brightness 
    this.Refresh()
    let brightness = LightList[lampid].state.bri

    if (state == true) {
        document.getElementById('Lamp' + lampid).value = brightness
        //document.getElementById('Lamp' + lampid).value = LightList[lampid].state.bri
    } else {
        document.getElementById('Lamp' + lampid).value = 0
    }

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
    LightList = groups[roomid].lights

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

exports.LightStateHueQ = (lampid, hex) => {
    axios({
        method: 'put',
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        data: { "on": true, "xy": JSON.parse(colorConv.hexToRgb(hex)), "bri": colorConv.brightness(hex) }
    })
}