const express = require('express');
const router = express.Router();
const service = require('./user.service');
const {Roles} = require("./user.model");
const {checkRole, checkUserCompany} = require("../../_helpers/checkers");
const {BasicCrud} = require("../../_helpers/crud");

const crud = new BasicCrud(service)

// routes
router.post('/authenticate', authenticate);
router.post('/create', checkRole(Roles.Owner), crud.create);
router.get('/', checkRole(Roles.Owner), crud.getAll);
router.get('/myCompany', checkRole(Roles.Owner), getByCompany);
router.get('/current', getCurrent);
router.get('/:id', checkRole(Roles.Owner), checkUserCompany, crud.getById);
router.put('/:id', checkRole(Roles.Owner), checkUserCompany, crud.update);
router.delete('/:id', checkRole(Roles.Owner), checkUserCompany, crud._delete);

module.exports = router;

function authenticate(req, res, next) {
    service.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: 'Username or password is incorrect'}))
        .catch(err => next(err));
}

function getByCompany(req, res, next) {
    service.getById(req.user.sub)
        .then(callerUser => {
            service.getAllByCompany(callerUser.company)
                .then(users => res.json(users))
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    service.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
