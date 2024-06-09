const axios = require('axios');

let ip6;
import('ip6').then(module => {
    ip6 = module.default;
});

/**
 *
 * @type {Map<string, RegisterStore>}
 */
const computers = new Map();

function getUrl(computer) {
    return `${computer.secure ? 'https' : 'http'}://${computer.ip}:${computer.port}`;
}

/**
 *
 * @param {RegisterDTO} dto
 * @param {string} ip
 */
function registerComputer(dto, ip) {
    const {computerName, port, systemUUID, secure} = dto;
    if (ip === '::1') {
        ip = '127.0.0.1';
    }

    const lastUpdate = new Date();
    computers.set(systemUUID, {computerName, port, systemUUID, lastUpdate, ip, secure});
}

function getComputers() {
    return Array.from(computers.keys());
}

function getComputer(systemUUID) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    return computer;
}

async function getAppList(systemUUID) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/app-list`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error getting app list: ${e}`);
    }
}

async function launchApp(systemUUID, appId) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/app-launch`;
    try {
        const response = await axios.post(url, {appId});
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error launching app: ${e}`);
    }
}

async function closeApp(systemUUID, appId) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/app-close`;
    try {
        const response = await axios.post(url, {appId});
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error closing app: ${e}`);
    }
}

async function relayCommand(systemUUID, command, method, body) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/relay/${command}`;
    try {
        const response = await axios({
            method,
            url,
            data: body
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error relaying command: ${e}`);
    }
}

module.exports = {
    computers,
    getUrl,
    registerComputer,
    getComputers,
    getComputer,
    getAppList,
    launchApp,
    closeApp,
    relayCommand
};
