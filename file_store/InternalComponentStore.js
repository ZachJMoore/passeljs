const InternalStore = require("./InternalStore")

module.exports = class InternalComponentStore extends InternalStore{
    constructor(pathname){
        super()

        this.directory = this.directory.cwd(`${pathname}/`)
    }

    getState(){
        return this.get("state")
    }
    setState(state){
        this.set("state", state)
    }
}