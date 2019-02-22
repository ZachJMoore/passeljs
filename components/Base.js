// Base component for all others to extend

const EventEmitter = require("events")
const helpers = require("../helpers.js")
const { InternalComponentStore } = require("../file_store")
const _ = require("lodash")

class BaseComponent{
    constructor(props){

        // Make sure we know which components are which
        this._component_type = "Base"
        this._component_children = {}

        this._initialized_components = props.initializedComponents

        this._component_path = []
        this._component_depth = 0

        // initialize event emitters
        this.stateChanged = new EventEmitter()

        // add global state and emitter
        this.global = props.global
        this.globalChanged = props.globalChanged

        // Set placeholder fsState max update limit variable
        this._fsState_recurrent_update_limit_interval = null

        // if we are a child, make sure we have access to parent state changes
        if (props.parent){
            this.parentState = props.parent.state
            this.parentStateChanged = props.parent.stateChanged
        }

        // inherit props
        if (props.propsToInherit){
            this.props = props.propsToInherit
        }
    }

    componentWillMount(){

    }

    componentDidMount(){

    }

    setState(value, cb){

        if (!value) return

        if (!this.state) throw new Error("State must be set before calling setState")

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

                        let globalPath = helpers.resolveObjectPath(this._component_path, this.global)
                        let temp = {}
                        if (!globalPath) globalPath = helpers.createObjectPath(this._component_path, temp)
                        globalPath[object.key] = this.state[object.key]
                        _.merge(this.global, temp)

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

        if (updateFileSystem) {
            let pfsState = this._internal_component_file_store.getState()

            if (
                this._fsState_recurrent_update_limit_interval === null
                && helpers.isObject(pfsState)
                && !helpers.compareObject(fsState, pfsState)
               ){

                // ensure we don't update file system more than than once in the update limit
                if (this.options.fsState.recurrentUpdateLimit === null){

                } else {

                    if (typeof this.options.fsState.recurrentUpdateLimit === "number"){

                        this._fsState_recurrent_update_limit_interval = setTimeout(()=>{
                            this._fsState_recurrent_update_limit_interval = null
                        }, this.options.fsState.recurrentUpdateLimit)

                    } else {

                        this._fsState_recurrent_update_limit_interval = setTimeout(()=>{
                            this._fsState_recurrent_update_limit_interval = null
                        }, 60*10000)

                    }

                }

                // update file system
                this._internal_component_file_store.setState(fsState)
            }
        }

        if (cb) cb()
    }

    ensureFsState(value, cb){
        if (!value) return

        if (!this.state) throw new Error("State must be set before calling setState")

        if (!this.options || !this.options.fsState) return

        if (typeof value === "function"){
            let value = value(this.state)
        }

        const fsState = this._internal_component_file_store.getState() || {}
        let isDifferent = false

        Object.keys(value).forEach((key)=>{
            if (value[key] !== fsState[key]){ //if the value is different

                // set component state
                isDifferent = true
                fsState = value[key]

            }
        })

        if ( isDifferent && helpers.isObject(pfsState) && !helpers.compareObject(fsState, pfsState) ){
            this._internal_component_file_store.setState(fsState)
        }

        if (cb) cb()
    }

    use(Comp, propsToInherit){

        let comp = new Comp({
            parent: {
                state: this.state,
                stateChanged: this.stateChanged
            },
            global: this.global,
            globalChanged: this.globalChanged,
            propsToInherit,
            initializedComponents: this._initialized_components
        })

        if (!comp.componentName) throw new Error(`Component names are required`)
        if (this._component_children[comp.componentName]){
            throw new Error(`Component path ${this._component_path.join(".")}.${comp.componentName} is already in use. Children must use unique names`)
        }

        comp._component_path = this._component_path.slice()
        comp._component_path.push(comp.componentName)
        comp._component_depth = this._component_depth + 1

        if (comp.options && comp.options.fsState){

            // construct component store
            const internalComponentFileStore = new InternalComponentStore(comp._component_path.join("/"))
            comp._internal_component_file_store = internalComponentFileStore

            // Load initial fsStore state into component or generate from default state
            const fsState = internalComponentFileStore.getState()
            if (fsState) comp.state = {...comp.state, ...fsState}
            else {
                let data = {}
                comp.options.fsState.options.include.forEach(object=>{
                    data[object.key] = comp.state[object.key]
                })
                internalComponentFileStore.setState(data)
            }
        }

        if (comp.options && comp.options.globalState){
            // load initial global state
            comp.options.globalState.options.include.forEach(object=>{

                let globalPath = helpers.resolveObjectPath(comp._component_path, this.global)
                let temp = {}
                if (!globalPath) globalPath = helpers.createObjectPath(comp._component_path, temp)
                globalPath[object.key] = comp.state[object.key]
                _.merge(this.global, temp)

            })
        }


        let icPath = helpers.resolveObjectPath(this._initialized_component_path, this._initialized_components)
        icPath.children[comp.componentName] = {
            component: comp,
            children: {}
        }
        this._component_children[comp.componentName] = comp
        comp._initialized_component_path = this._initialized_component_path.slice()
        comp._initialized_component_path.push("children", comp.componentName)


        comp.componentWillMount()

        return comp
    }

}

module.exports = BaseComponent