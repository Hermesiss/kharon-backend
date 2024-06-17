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

/**
 *
 * @param {RegisterStore} computer
 * @param {string | number | null} port
 * @return {string}
 */
function getUrl(computer, port = null) {
    if (!port) {
        port = computer.port;
    }
    return `${computer.secure ? 'https' : 'http'}://${computer.ip}:${port}`;
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

/**
 * @typedef {object} AppList
 * @property {string} appCode
 * @property {string} installed
 * @property {string} version
 */

/**
 *
 * @param systemUUID
 * @return {Promise<AppList[]>}
 */
async function getAppList(systemUUID) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/app-list`;
    try {
        const response = await axios.get(url);
        return response.data.configs;
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

async function launchWebsite(systemUUID, website) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/website-launch`;
    try {
        const response = await axios.post(url, {website});
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error launching website: ${e}`);
    }
}

async function closeWebsite(systemUUID, website) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/website-close`;
    try {
        const response = await axios.post(url, {website});
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error closing website: ${e}`);
    }
}

async function closeAllApps(systemUUID) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer)}/api/close-all`;
    try {
        const response = await axios.post(url);
        return response.data;
    } catch (e) {
        console.error(e);
        throw new Error(`Error closing all apps: ${e}`);
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

/**
 *
 * @param {string} systemUUID - The system UUID
 * @param {string} command - The command to relay, like 'api/shutdown'
 * @param {string} method - The HTTP method to use, like 'GET' or 'POST'
 * @param {string | null} [port] - Use this to override the port of the computer (optional)
 * @param {object} [body] - The body to send with the request (optional)
 * @return {Promise<any>}
 */
async function relayCommand(systemUUID, command, method, port = null, body = null) {
    const computer = computers.get(systemUUID);
    if (!computer) {
        throw new Error('Computer not found');
    }
    const url = `${getUrl(computer, port)}/${command}`;
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
    relayCommand,
    launchWebsite,
    closeWebsite,
    closeAllApps
};
