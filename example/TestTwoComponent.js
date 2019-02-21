const { PasselComponent } = require("../index.js")

module.exports = class TestTwoComponent extends PasselComponent{
    constructor(props){
        super(props)

        this.componentName = "testTwo"
    }

    passelDidMount(){
        this.globalEvent.emit("message", "Component two is sending a message {...}")
    }
}