const express = require('express');
const router = express.Router();
const service = require('./app.service');
const {checkRole, checkAppCompany} = require("../../_helpers/checkers");

const {BasicCrud} = require("../../_helpers/crud");
const {Roles} = require("../users/user.model");

const crud = new BasicCrud(service)

/**
  * @swagger
  * tags:
  *   name: Apps
  *   description: Apps management
  */
/**
* @swagger
* /create:
*  post:
*    tags: 
*      - Apps
*    description: Create Apps
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.post('/create', checkRole(Roles.Admin), crud.create);
/**
* @swagger
* /:
*  get:
*    tags: 
*      - Apps
*    description: Get all Apps
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.get('/', checkRole(Roles.Admin), crud.getAll);
/**
* @swagger
* /:id:
*  get:
*    tags: 
*      - Apps
*    description: Check App
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.get('/:id', checkAppCompany, crud.getById);
/**
* @swagger
* /:id:
*  put:
*    tags: 
*      - Apps
*    description: Add App
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.put('/:id', checkRole(Roles.Admin), crud.update);
/**
* @swagger
* /:id:
*  delete:
*    tags: 
*      - Apps
*    description: Delete App
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.delete('/:id', checkRole(Roles.Admin), crud._delete);
/**
* @swagger
* /:id/version:
*  post:
*    tags: 
*      - Apps
*    description: Add App version
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.post('/:id/version', checkRole(Roles.Admin), addVersion);
/**
* @swagger
* /:id/version:
*  put:
*    tags: 
*      - Apps
*    description: Update App version
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.put('/:id/version', checkRole(Roles.Admin), updateVersion);
/**
* @swagger
* /:id/version/:version:
*  delete:
*    tags: 
*      - Apps
*    description: Delete App version
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.delete('/:id/version/:version', checkRole(Roles.Admin), deleteVersion);

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
    service.deleteVersion(req.params.id, req.params)
        .then(() => res.json({}))
        .catch(err => next(err));
}
