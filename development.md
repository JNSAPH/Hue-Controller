<p align="center">
      <img src="assets/Logos/logo.png" width="80">
  <h1 align="center">
    Development Information
  </h1>
</p>

<h3 align="center">
  Electron App to Controll Zigbee Lights using your Philips Hue Bridge
</h3>

## Debug Information
Get IP of the Hue Bridge using:
https://discovery.meethue.com/

API Routes
- `[POST] /api/` Get Developer Key (Requires Press on Bridge)
- `[GET]  /api/%username/lights` JSON response with all the lights in your system and their names
- `[GET] /api/%username/lights/%int` Information about a specific light. The light with id 1.
- `[PUT] /api/%username/lights/%int/state` `{"on":%bool}` Turn Light on / off 
- `[PUT] /api/%username/lights/%int/state` `{"on":%bool, "sat":%int, "bri":%int, "hue":%int}` Turn Light on / off 

sat: 0-254
bri: 0-254
hue: 0-10000