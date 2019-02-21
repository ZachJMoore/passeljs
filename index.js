const EventEmitter = require("events")
const Components = require("./components")
const { InternalComponentStore } = require("./file_store")


// global state
const global = {}
const globalChanged = new EventEmitter()

// globalEvents
const globalEvent = new EventEmitter()

// components listed by name
const initializedComponents = {}

// initialize new components
const use = (Comp)=>{
    const comp = new Comp({global, globalChanged, globalEvent})

    if (!comp.componentName) throw new Error(`Component names are required`)
    if (initializedComponents[comp.componentName]) throw new Error(`Component name '${comp.componentName}' is already used. Duplicate names not allowed`)

    if (comp.options && comp.options.fsState){

        // construct component store
        const internalComponentFileStore = new InternalComponentStore(comp.componentName)
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
            if (!global[comp.componentName]) global[comp.componentName] = {}
            global[comp.componentName][object.key] = comp.state[object.key]
        })
    }

    comp.componentWillMount()

    initializedComponents[comp.componentName] = comp
    return comp
}

// mount components
const begin = ()=>{
    Object.values(initializedComponents).forEach((comp)=>{
        comp.componentDidMount()
    })
}

module.exports = {
    Components,
    global,
    globalChanged,
    initializedComponents,
    use,
    begin
}

