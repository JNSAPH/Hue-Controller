//Import Electron Modules
const { app, BrowserWindow, TouchBar } = require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const package = require('../package-lock.json')

const label = new TouchBarLabel({
    label: "V" + package.version,
    textColor: "#FF5454"
})


const button = new TouchBarButton({
    label: `Master Switch`,
    accessibilityLabel: 'Counter',
    backgroundColor: '#6ab04c',
    click: () => {
        
    }
});

function masterSwitch(){

}

const touchBar = new TouchBar({
    items: [
        label
    ],
});


module.exports = touchBar