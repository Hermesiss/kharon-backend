const express = require('express');
const router = express.Router();
const axios = require('axios');
const service = require("./remote.service");

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

router.post('/register', (req, res) => {
    try {
        service.registerComputer(req.body, req.ip);
        res.send('Computer registered');
    } catch (e) {
        console.error(e);
        res.status(500).send(`Error registering computer: ${e}`);
    }
})

router.get('/computers', (req, res) => {
    const systemUUIDs = service.getComputers();
    res.json(systemUUIDs);
})

router.get('/computers/:id', (req, res) => {
    try {
        const computer = service.getComputer(req.params.id);
        res.json(computer);
    } catch (e) {
        console.error(e);
        res.status(500).send(`Error getting computer: ${e}`);
    }
})

router.get('/computers/:id/app-list', async (req, res) => {
    try {
        const apps = await service.getAppList(req.params.id);
        res.json(apps);
    } catch (e) {
        console.error(e);
        res.status(500).send(`${e}`);
    }
})

router.post('/computers/:id/app-launch', async (req, res) => {
        try {
            await service.launchApp(req.params.id, req.body.appId);
            res.json("App started successfully");
        } catch (e) {
            console.error(e);
            res.status(500).send(`Error launching app: ${e}`);
        }
    }
)

router.post('/computers/:id/app-close', async (req, res) => {
    try {
        await service.closeApp(req.params.id, req.body.appId);
        res.json("App closed successfully");
    } catch (e) {
        console.error(e);
        res.status(500).send(`Error closing app: ${e}`);
    }
})

router.all('/computers/:id/relay/:command', async (req, res) => {
    try {
        const response = await service.relayCommand(req.params.id, req.params.command, req.method, req.body);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(`Error relaying command: ${e}`);
    }
})


module.exports = router;
