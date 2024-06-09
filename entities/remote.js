const express = require('express');
const router = express.Router();
const axios = require('axios');

let ip6;
import('ip6').then(module => {
    ip6 = module.default;
});

/**
 * @typedef {Object } RegisterDTO
 * @property {string} computerName
 * @property {number} port
 * @property {string} systemUUID
 * @property {boolean} secure
 */

/**
 * @typedef {RegisterDTO} RegisterStore
 * @property {string} ip
 * @property {Date} lastUpdate
 */

/**
 *
 * @type {Map<string, RegisterStore>}
 */
const computers = new Map();

function getUrl(computer) {
    return `${computer.secure ? 'https' : 'http'}://${computer.ip}:${computer.port}`;
}

router.post('/register', (req, res) => {
    const {computerName, port, systemUUID, secure} = req.body;
    let ip = req.ip;
    if (ip === '::1') {
        ip = '127.0.0.1';
    }

    const lastUpdate = new Date();
    computers.set(systemUUID, {computerName, port, systemUUID, lastUpdate, ip, secure});
    res.send('Computer registered');
})

router.get('/computers', (req, res) => {
    const systemUUIDs = Array.from(computers.keys());
    res.json(systemUUIDs);
})

router.get('/computers/:id', (req, res) => {
    const computer = computers.get(req.params.id);
    if (!computer) {
        res.status(404).send('Computer not found');
        return;
    }
    res.json(computer);
})

router.get('/computers/:id/app-list', (req, res) => {
    const computer = computers.get(req.params.id);
    if (!computer) {
        res.status(404).send('Computer not found');
        return;
    }
    const url = `${getUrl(computer)}/api/app-list`;
    axios.get(url).then(response => {
        res.json(response.data);
    }).catch(e => {
        console.error(e);
        res.status(500).send(`Error getting app list: ${e}`);
    })
})

router.post('/computers/:id/app-launch', (req, res) => {
    const computer = computers.get(req.params.id);
    if (!computer) {
        res.status(404).send('Computer not found');
        return;
    }
    const appId = req.body.appId;
    const url = `${getUrl(computer)}/api/app-launch`;
    axios.post(url, {appId}).then(response => {
        res.json(response.data);
    }).catch(e => {
        console.error(e);
        res.status(500).send(`Error launching app: ${e}`);
    })
})

router.post('/computers/:id/app-close', (req, res) => {
    const computer = computers.get(req.params.id);
    if (!computer) {
        res.status(404).send('Computer not found');
        return;
    }
    const appId = req.body.appId;
    const url = `${getUrl(computer)}/api/app-close`;
    axios.post(url, {appId}).then(response => {
        res.json(response.data);
    }).catch(e => {
        console.error(e);
        res.status(500).send(`Error closing app: ${e}`);
    })
})

router.all('/computers/:id/relay/:command', (req, res) => {
    const computer = computers.get(req.params.id);
    const command = req.params.command;
    if (!computer) {
        res.status(404).send('Computer not found');
        return;
    }
    const method = req.method;
    const sendBody = req.body.body;
    const url = `${getUrl(computer)}/${command}`;

    axios({
        method,
        url,
        data: sendBody
    }).then(response => {
        console.log('Relayed', computer);
        res.json(response.data);
    }).catch(e => {
        console.error(e);
        res.status(500).send(`Error relaying: ${e}`);
    });
})


module.exports = router;
