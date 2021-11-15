const express = require('express');
const router = express.Router();
const service = require('./company.service');
const {checkRole} = require("../../_helpers/checkers");

const {BasicCrud} = require("../../_helpers/crud");
const {Roles} = require("../users/user.model");

const crud = new BasicCrud(service)

router.post('/create', checkRole(Roles.Owner), crud.create);
router.get('/', checkRole(Roles.Admin), crud.getAll);
router.get('/:id', checkRole(Roles.Owner), crud.getById);
router.put('/:id', checkRole(Roles.Owner), crud.update);
router.delete('/:id', checkRole(Roles.Owner), crud._delete);

module.exports = router;
