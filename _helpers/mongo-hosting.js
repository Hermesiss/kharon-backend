const startMongo = async () => {
    const dbDir = process.env.MONGO_DB_PATH || path.join(__dirname, 'db')
    const mongoExe = process.env.MONGO_EXE_PATH || 'mongod'
    const mongoPort = process.env.MONGO_PORT || '27017'

    const fs = require('fs')
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, {recursive: true})
    }

    const exec = require('child_process').exec
    const cmd = `${mongoExe} --dbpath ${dbDir} --port ${mongoPort}`
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.error(`stderr: ${stderr}`)
    } )
}

module.exports = startMongo;
