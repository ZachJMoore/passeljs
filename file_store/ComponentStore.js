const InternalStore = require("./InternalStore")

module.exports = class ComponentStore extends InternalStore{
    constructor(pathname){
        super()

        this.directory = this.directory.cwd(`${pathname}/`)
    }

    getState(){
        return this.get("reserved/state")
    }
    setState(state){
        this.set("reserved/state", state)
    }
}