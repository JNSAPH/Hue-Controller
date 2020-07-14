const axios = require('axios');

axios.get('https://discovery.meethue.com/')
    .then((response) => {
        IP = response.data[0].internalipaddress
        document.getElementById('uiIP').innerHTML = IP

        if(!IP == null){
            // Bridge found
        } else {
            // No Bridge found
        }

    })