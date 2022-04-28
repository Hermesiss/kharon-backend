const express = require('express');
const router = express.Router();
const service = require('./user.service');
const {Roles} = require("./user.model");
const {checkRole, checkUserCompany} = require("../../_helpers/checkers");
const {BasicCrud} = require("../../_helpers/crud");
const {ErrorType} = require("../../_helpers/error-handler");

const crud = new BasicCrud(service)

// routes
/**
  * @swagger
  * tags:
  *   name: User
  *   description: User management
  */
/**
 * @swagger
 * /authenticate:
 *  post:
 *    tags: 
 *      - User
 *    description: Use for authenticate
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.post('/authenticate', authenticate);
/**
 * @swagger
 * /create:
 *  post:
 *    tags: 
 *      - User
 *    description: Create User 
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.post('/create', checkRole(Roles.Owner), crud.create);
/**
 * @swagger
 *  /:
 *  get:
 *    tags: 
 *      - User
 *    description: Get all Users
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.get('/', checkRole(Roles.Owner), crud.getAll);
/**
 * @swagger
 * /myCompany:
 *  get:
 *    tags: 
 *      - User
 *    description: Get own user by company
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.get('/myCompany', checkRole(Roles.Owner), getByCompany);
/**
 * @swagger
 * /current:
 *  get:
 *    tags: 
 *      - User
 *    description: Get current user
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.get('/current', getCurrent);
/**
 * @swagger
 * /:id:
 *  get:
 *    tags: 
 *      - User
 *    description: get user by id
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.get('/:id', checkRole(Roles.Owner), checkUserCompany, crud.getById);
/**
 * @swagger
 * /:id:
 *  put:
 *    tags: 
 *      - User
 *    description: put user
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.put('/:id', checkRole(Roles.Owner), checkUserCompany, crud.update);
/**
 * @swagger
 * /:id:
 *  delete:
 *    tags: 
 *      - User
 *    description: delete user
 *    variables: 
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Username or password is incorrect
 */
router.delete('/:id', checkRole(Roles.Owner), checkUserCompany, crud._delete);

module.exports = router;

function authenticate(req, res, next) {
    service.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({
            message: 'Username or password is incorrect',
            type: ErrorType.WrongCredentials
        }))
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
