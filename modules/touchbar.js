//Import Electron Modules
const { app, BrowserWindow, TouchBar } = require('electron')
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar

const prPackage = require('../package.json')

const label = new TouchBarLabel({
    label: "V" + prPackage.version,
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
