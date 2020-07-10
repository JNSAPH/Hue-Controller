//Import Modules and create Variables
const request = require('request');
const settings = require('../settings.json')
var IP;
var LightList;

// Get IP of Hue Bridge
request('https://discovery.meethue.com/', function (error, response, body) {
    IP = JSON.parse(body)[0].internalipaddress
    document.getElementById('uiIP').innerHTML = IP

    // Get all Lamps connected to the Bridge
    request(`http://${IP}/api/${settings.username}/lights`, function (error, response, body) {
        LightList = JSON.parse(body)

        // Create a Card for every Lamp inside the System
        /*
            - Research if there is a better way to do this
            - Gray-out Cards if Lamp is Offline, Unreachable or Unsupported - DONE
        */
        Object.keys(LightList).forEach(element => {
            document.getElementById('LightList').innerHTML +=
                `
            <div class="card lcard">
                <div class="card-body ${LightList[element].state.reachable == false ? "offline" : ""}">
                    <p style="font-size: 20px; font-weight: bold; text-align: center" class="md-0">${LightList[element].name}</p>
                    <p style="text-align: center" clasS="md-0">Lamp ID: ${element} | ${LightList[element].state.reachable == true ? "Online" : "Offline"}</p>
                    <div class="btn-group">
                        <button type="button" class="btn btn-success" onclick="LightSwitch(${element}, true)">On</button>
                        <button type="button" class="btn btn-danger" onclick="LightSwitch(${element}, false)">Off</button>
                    </div>
                    <div class="form-group">
                        <input class="form-control-range" type="range" max="254" value="${LightList[element].state.bri}" onchange="LightStateBri(${element}, this.value)">
                        <br>
                        <input type="color" value="${xyBriToRgb(LightList[element].state.xy[0], LightList[element].state.xy[1], LightList[element].state.bri)}" id="head" name="head" onchange="LightStateHue(${element}, this.value)">
                    </div>
                </div>
            </div>
            `
        });
    });
});

// Lamp switches
/*
    - Default On / Off Switch
    - Convert Hex to RGB, RGB to XY and Change Color
    - Change Brightness
*/
function LightSwitch(lampid, state) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"on":${state}}`
    })
    console.log(`Switching Lamp ${lampid} ${state}`)
}

function LightStateHue(lampid, hex) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"on": true, "xy": ${hexToRgb(hex)}}`
    })

    console.log(`Changed Lamp ${lampid} to ${hex} Hex`)
}

function LightStateBri(lampid, bri) {
    request.put({
        url: `http://${IP}/api/${settings.username}/lights/${lampid}/state`,
        body: `{"on": true, "bri": ${bri}}`
    })

    console.log(`Changed Lamp ${lampid} to ${bri} Brightness`)
}

// Convert Colors
/*
First three are to Convert HEX to XY Values
*/
function enhanceColor(normalized) {
    if (normalized > 0.04045) {
        return Math.pow((normalized + .055) / (1 + .055), 2.4);
    }

    return normalized / 12.92;
}

function rgbToXY(r, g, b) {
    const rFinal = enhanceColor(r / 255),
        gFinal = enhanceColor(g / 255),
        bFinal = enhanceColor(b / 255);

    const x = rFinal * 0.649926 + gFinal * 0.103455 + bFinal * 0.197109,
        y = rFinal * 0.234327 + gFinal * 0.743075 + bFinal * 0.022598,
        z = rFinal * 0.000000 + gFinal * 0.053077 + bFinal * 1.035763;

    const sum = x + y + z;

    if (sum == 0) {
        return { x: 0, y: 0 };
    }
    return `[${x / sum}, ${y / sum}]`
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return rgbToXY(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16))
}

/*
Convert XY to HEX
*/

function xyBriToRgb(x, y, bri)
{
    z = 1.0 - x - y;

    Y = bri / 255.0; // Brightness of lamp
    X = (Y / y) * x;
    Z = (Y / y) * z;
    r = X * 1.612 - Y * 0.203 - Z * 0.302;
    g = -X * 0.509 + Y * 1.412 + Z * 0.066;
    b = X * 0.026 - Y * 0.072 + Z * 0.962;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    maxValue = Math.max(r,g,b);
    r /= maxValue;
    g /= maxValue;
    b /= maxValue;
    r = r * 255;   if (r < 0) { r = 255 };
    g = g * 255;   if (g < 0) { g = 255 };
    b = b * 255;   if (b < 0) { b = 255 };

    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);

    if (r.length < 2)
        r="0"+r;        
    if (g.length < 2)
        g="0"+g;        
    if (b.length < 2)
        b="0"+r;        
    rgb = "#"+r+g+b;

    return rgb;             
}