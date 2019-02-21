const BaseComponent = require("./Base.js")
const BaseStore = require("../file_store/Base.js")

module.exports = class WithStore extends BaseComponent{
    constructor(props){
        super(props)

        // Make sure we know which components are which
        this._component_type = "WithStore"
    }

    getFileStore(){

        if (!this.componentName) throw new Error(`Component names are required`)

        const self = this
        class FileStore extends BaseStore{
            constructor(props){
                super(props)
                this.directory = this.directory.cwd(`public/${self.componentName}/`)
            }
        }

        return FileStore
    }
}