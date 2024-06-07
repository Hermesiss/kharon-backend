const {Roles} = require("../entities/users/user.model");
const userService = require("../entities/users/user.service");
const appService = require("../entities/apps/app.service");
const companyService = require("../entities/companies/company.service");
const hostingService = require("../entities/hostings/hosting.service");

/**
 * In current user can call this API
 * @param {UserRoles} userRole - Minimum user role
 * @return {(function(*, *, *): void)|*}
 */
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

function checkUserCompany(req, res, next) {
    userService.getById(req.user.sub)
        .then(callerUser => {
            if (callerUser && callerUser.role === Roles.Admin) {
                return next();
            }
            userService.getById(req.params.id)
                .then(targetUser => {
                    if (callerUser && targetUser.company.toString() === callerUser.company.toString())
                        return next()
                    return res.status(403).send("Cannot access users from different company");
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

function checkAppCompany(req, res, next) {
    userService.getById(req.user.sub)
        .then(callerUser => {
            if (callerUser && callerUser.role === Roles.Admin) {
                return next();
            }
            appService.getById(req.params.id)
                .then(targetApp => {
                    console.log(targetApp.company === callerUser.company, targetApp.company , callerUser.company)
                    if (callerUser && targetApp.company.toString() === callerUser.company.toString())
                        return next()
                    return res.status(403).send("Cannot access apps from different company");
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

function checkHostingCompany(req, res, next) {
    userService.getById(req.user.sub)
        .then(callerUser => {
            if (callerUser && callerUser.role === Roles.Admin) {
                return next();
            }
            hostingService.getById(req.params.id)
                .then(targetHosting => {
                    if (callerUser && targetHosting.company.toString() === callerUser.company.toString())
                        return next()
                    return res.status(403).send("Cannot access hostings from different company");
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

function checkCompanyCompany(req, res, next) {
    userService.getById(req.user.sub)
        .then(callerUser => {
            if (callerUser && callerUser.role === Roles.Admin) {
                return next();
            }
            companyService.getById(req.params.id)
                .then(targetCompany => {
                    if (callerUser && targetCompany.id === callerUser.company.toString())
                        return next()
                    return res.status(403).send("Cannot access different company");
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}

module.exports = {checkRole, checkUserCompany, checkAppCompany, checkCompanyCompany, checkHostingCompany};
