const InternalStore = require("./InternalStore")
const jetpack = require("fs-jetpack")
const fs = require("fs")
const path = require("path")
ROOT_APP_PATH = fs.realpathSync('.')

module.exports = class InternalComponentStore extends InternalStore {
    constructor({componentName, absoluteFilePath, relativeFilePath}){
        super()

        let filePath = absoluteFilePath
        if (!filePath && relativeFilePath){
            filePath = path.join(ROOT_APP_PATH, relativeFilePath)
        }

        if (filePath){
            this.directory = jetpack.cwd(filePath)
        }

        this.directory = this.directory.cwd(`${componentName}/`)
    }

    getState(){
        return this.get("state")
    }

    setState(state, atomic){
        this.set("state", state, atomic)
    }

}