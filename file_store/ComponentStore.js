const InternalStore = require("./InternalStore")

module.exports = class ComponentStore extends InternalStore{
    constructor(pathname){
        super()

        this.directory = this.directory.cwd(pathname)
    }
}