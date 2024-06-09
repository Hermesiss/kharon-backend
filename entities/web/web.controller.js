const express = require('express');
const router = express.Router();
const remoteService = require('../remote/remote.service');
const appService = require('../apps/app.service');

router.get('/', (_, res) => {
    const computerUUIDs = remoteService.getComputers();
    const computers = computerUUIDs.map(computerUUID => remoteService.getComputer(computerUUID));
    res.render('index', {computers});
})

router.get('/web/:id', async (req, res) => {
    try {
        const computer = remoteService.getComputer(req.params.id);
        const appConfigs = await remoteService.getAppList(req.params.id);
        let apps = []
        for (const appConfig of appConfigs) {
            const app = await appService.getByCode(appConfig.appCode);
            if (app) {
                apps.push(app);
            }
        }

        console.log(apps);
        res.render('computer', {computer, apps});
    } catch (e) {
        console.error(e);
        res.status(500).send(`Error getting computer: ${e}`);
    }
})

module.exports = router;
