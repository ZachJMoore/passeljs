const fs = require("fs")
const jetpack = require("fs-jetpack")
ROOT_APP_PATH = fs.realpathSync('.')

class Base {


    constructor(){

        this.directory = jetpack.cwd(ROOT_APP_PATH + "/app/storage/")

    }

    set(fileName, data, atomic = false){
        this.directory.write(`${fileName}.json`, data, {
            atomic
        })
    }

    get(fileName){
        let data = this.directory.read(`${fileName}.json`, "json")
        if (!data) data = null
        return data
    }

}

module.exports = Base