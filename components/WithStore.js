const BaseComponent = require("./Base.js")
const BaseStore = require("../file_store/Base.js")

module.exports = class WithStore extends BaseComponent{
    constructor(props){
        super(props)

        // Make sure we know which components are which
        this._component_type = "WithStore"
    }

    getFileStore(){

        if (!this._component_path) throw new Error(`${this.componentName} component does not have a component path assigned`)
        if (this._component_path.length === 0) throw new Error(`${this.componentName} component has no path. Perhaps you called .getFileStore in the wrong lifecycle.`)

        const self = this
        class FileStore extends BaseStore{
            constructor(props){
                super(props)
                this.directory = this.directory.cwd(`public/${self._component_path.join("/")}/`)
            }
        }

        return FileStore
    }
}