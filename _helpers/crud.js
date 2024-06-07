class CrudController {
    constructor(service) {
        this.service = service;
    }

    getAll = (req, res, next) => {
        this.service.getAll()
            .then(users => res.json(users))
            .catch(err => next(err));
    };

    create = (req, res, next) => {
        this.service.create(req.body)
            .then((obj) => res.json(obj))
            .catch(err => next(err));
    };

    getById = (req, res, next) => {
        this.service.getById(req.params.id)
            .then(user => user ? res.json(user) : res.sendStatus(404))
            .catch(err => next(err));
    };

    update = (req, res, next) => {
        this.service.update(req.params.id, req.body)
            .then((obj) => res.json(obj))
            .catch(err => next(err));
    };

    _delete = (req, res, next) => {
        this.service.delete(req.params.id)
            .then((obj) => res.json(obj))
            .catch(err => next(err));
    };
}

module.exports = {BasicCrud: CrudController};


