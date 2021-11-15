const {Roles} = require("../entities/users/user.model");
const userService = require("../entities/users/user.service");

function checkRole(userRole) {
    const getRoleIndex = role => Object.values(Roles).indexOf(role);
    return (req, res, next) => {
        userService.getById(req.user.sub)
            .then(user => {
                if (user && getRoleIndex(user.role) >= getRoleIndex(userRole)) {
                    return next();
                }
                return res.status(403).send(`Only for role [${userRole}] and higher`);
            })
            .catch(err => next(err));
    }
}

function checkCompany(req, res, next) {
    userService.getById(req.user.sub)
        .then(callerUser => {
            if (callerUser && callerUser.role === Roles.Admin) {
                return next();
            }
            userService.getById(req.params.id)
                .then(targetUser => {
                    if (callerUser && targetUser.company === callerUser.company)
                        return next()
                    return res.status(403).send("Cannot edit users from different company");
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

module.exports = {checkRole, checkCompany};
