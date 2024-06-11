const FtpSrv = require('ftp-srv');

const rootFolder = "/ftp/"

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


    const fs = require('fs')
    if (!fs.existsSync(rootFolder)) {
        fs.mkdirSync(rootFolder)
    }
    const appsFolder = rootFolder + 'apps/'
    if (!fs.existsSync(appsFolder)) {
        fs.mkdirSync(appsFolder)
    }

    ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
        if (username === adminUsername && password === adminPassword) {
            resolve({root: rootFolder, permissions: {read: true, write: true, delete: true}});
        } else if (username === 'anonymous') {
            resolve({root: rootFolder, permissions: {read: true}});
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

/**
 * @typedef {Object} FileTree
 * @property {string} name
 * @property {string} relativePath
 * @property {"file" | "folder"} type
 * @property {string} date
 * @property {"photo"|"video"|"other"} [filetype]
 * @property {number} [size]
 * @property {FileTree[]} [children]
 */

/**
 * Get file tree
 * @param {string} folder - absolute path to folder
 * @param {string|null} [relFolder]
 * @return {FileTree[]}
 */
const getFileTree = (folder, relFolder = null) => {
    const fs = require('fs')
    const path = require('path')
    if (relFolder === null) {
        relFolder = folder
    }
    const files = fs.readdirSync(folder)
    /** @type {FileTree[]} */
    const fileTree = []
    files.forEach(file => {
        const filePath = path.join(folder, file)
        const relativePath = path.relative(relFolder, filePath)
        const stats = fs.statSync(filePath)
        const creationDate = stats.birthtime
        if (stats.isDirectory()) {
            fileTree.push({
                name: file,
                type: 'folder',
                children: getFileTree(filePath, relFolder),
                relativePath,
                creationDate
            })
        } else {
            const size = stats.size
            const ext = path.extname(file)
            let filetype = 'other'
            if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
                filetype = 'photo'
            } else if (ext === '.mp4' || ext === '.avi' || ext === '.mkv') {
                filetype = 'video'
            }
            fileTree.push({
                name: file,
                type: 'file',
                relativePath,
                size,
                filetype,
                creationDate
            })
        }
    })
    return fileTree
}

module.exports = {startFtpServer, getFileTree, rootFolder};
