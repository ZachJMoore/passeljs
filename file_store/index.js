const Base = require("./Base")

class InternalStore extends Base{

    constructor(props){
        super(props)

        this.directory = this.directory.cwd("internal")
    }
}

let internalStore = new InternalStore()

module.exports = {
    Base,
    internalStore,
    InternalStore
}