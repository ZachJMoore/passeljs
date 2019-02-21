const Base = require("./Base")

module.exports = class InternalStore extends Base{

    constructor(props){
        super(props)

        this.directory = this.directory.cwd("internal")
    }
}