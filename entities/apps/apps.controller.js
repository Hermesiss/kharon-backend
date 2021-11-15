const express = require('express');
const router = express.Router();
const service = require('./app.service');
const {checkRole} = require("../../_helpers/checkers");

const {BasicCrud} = require("../../_helpers/crud");
const {Roles} = require("../users/user.model");

const crud = new BasicCrud(service)

router.post('/create', checkRole(Roles.Owner), crud.create);
router.get('/', checkRole(Roles.Admin), crud.getAll);
router.get('/:id', checkRole(Roles.Owner), crud.getById);
router.put('/:id', checkRole(Roles.Owner), crud.update);
router.delete('/:id', checkRole(Roles.Owner), crud._delete);

router.post('/:id/version', checkRole(Roles.Owner), addVersion);
router.put('/:id/version', checkRole(Roles.Owner), updateVersion);
router.delete('/:id/version', checkRole(Roles.Owner), deleteVersion);

module.exports = router;

function addVersion(req, res, next) {
    service.addVersion(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function updateVersion(req, res, next) {
    service.updateVersion(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteVersion(req, res, next) {
    service.deleteVersion(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
