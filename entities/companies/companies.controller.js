const express = require('express');
const router = express.Router();
const service = require('./company.service');
const {checkRole, checkCompanyCompany} = require("../../_helpers/checkers");

const {BasicCrud} = require("../../_helpers/crud");
const {Roles} = require("../users/user.model");

const crud = new BasicCrud(service)

_ = service.ensureAdmin()
/**
  * @swagger
  * tags:
  *   name: Companies
  *   description: Companies management
  */
/**
* @swagger
* /create:
*  post:
*    tags: 
*      - Companies
*    description: Create Companies
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
*      - Companies
*    description: Get all Companies
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
*      - Companies
*    description: Get Companies
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.get('/:id', checkCompanyCompany, crud.getById);
/**
* @swagger
* /:id:
*  put:
*    tags: 
*      - Companies
*    description: Add Companies
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
*      - Companies
*    description: Delete Companies
*    variables: 
*    responses:
*      '200':
*        description: A successful response
*      '400':
*        description: Username or password is incorrect
*/
router.delete('/:id', checkRole(Roles.Admin), crud._delete);

module.exports = router;
