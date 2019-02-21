const EventEmitter = require("events")
const { internalStore } = require("../file_store")

class Component{
    constructor(props){
        // initialize event emitters and global state
        this.stateChanged = new EventEmitter()
        this.global = props.global
        this.globalChanged = props.globalChanged
    }

    passelWillMount(){

    }

    passelDidMount(){

    }

    setState(value){

        if (!value) return

        if (!this.state) this.state = {}

        if (typeof value === "function"){
            let value = value(this.state)
        }

        let updateGlobal
        let updateFileSystem

        if (this.options){
            updateGlobal = this.options.globalState !== undefined
            updateFileSystem = this.options.fsState !== undefined
        } else {
            updateGlobal = false
            updateFileSystem = false
        }
        const fsState = {}
        if (updateFileSystem){
            this.options.fsState.options.include.forEach((object)=>{
                fsState[object.key] = this.state[object.key]
            })
        }

        Object.keys(value).forEach((key)=>{
            if (value[key] !== this.state[key]){ //if the value is different

                // set component state
                this.state[key] = value[key]
                this.stateChanged.emit(key, value[key])

                if (!this.options) return

                // check whether to include component state in global. Set global state if so.
                if (updateGlobal) this.options.globalState.options.include.forEach((object)=>{
                    if (object.key === key){

                        //ensure there is somewhere to right
                        if (!this.global[this.componentName]) this.global[this.componentName] = {}

                        //set global and emit value
                        this.global[this.componentName][key] = value[key]
                        if (object.emit) this.globalChanged.emit(`${this.componentName}.${key}`, value[key])

                    }
                })

                // check whether to include component state on file system. Write to disk if so.
                if (updateFileSystem) this.options.fsState.options.include.forEach((object)=>{

                    //batch and write one file later.
                    if (object.key === key){
                        fsState[key] = value[key]
                    }
                })

            }
        })

        if (updateFileSystem) internalStore.set(this.componentName, fsState)

    }

}

module.exports = Component