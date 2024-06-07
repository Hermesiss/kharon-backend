const FtpSrv = require('ftp-srv');
const {dirname} = require("node:path");

const startFtpServer = () => {
    const port = 21;
    const passivePorts = '10000-11100';
    const passiveUrl = 'ftp://127.0.0.1';
    const ftpServer = new FtpSrv({
        url: `ftp://0.0.0.0:${port}`,
        anonymous: true,
        pasv_url: passiveUrl,
        pasv_range: passivePorts
    });

    const adminUsername = process.env.FTP_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.FTP_ADMIN_PASSWORD || 'admin123';

    const folder = "/ftp/"
    const fs = require('fs')
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    const appsFolder = folder + 'apps/'
    if (!fs.existsSync(appsFolder)) {
        fs.mkdirSync(appsFolder)
    }

    ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
        if (username === adminUsername && password === adminPassword) {
            resolve({root: folder, permissions: {read: true, write: true, delete: true}});
        } else if (username === 'anonymous') {
            resolve({root: folder, permissions: {read: true}});
        } else {
            reject(new Error('Invalid username or password'));
        }
    });

    ftpServer.listen()
        .then(() => {
            console.log(`FTP server is running on port ${port}`);
        })
        .catch(err => {
            console.error(`Failed to start FTP server: ${err.message}`);
        });
}

module.exports = startFtpServer;
