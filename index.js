const EventEmitter = require("events")
const BaseComponent = require("./components/BaseComponent.js")
const { ComponentStore } = require("./file_store")


// global state
const global = {}
const globalChanged = new EventEmitter()

// globalEvents
const globalEvent = new EventEmitter()

// components listed by name
const components = {}

// initialize new components
const use = (Comp)=>{
    const comp = new Comp({global, globalChanged, globalEvent})

    if (!comp.componentName) throw new Error(`Component names are required`)
    if (components[comp.componentName]) throw new Error(`Component name '${comp.componentName}' is already used. Duplicate names not allowed`)

    if (comp.options && comp.options.fsState){

        // construct component store
        const componentFileStore = new ComponentStore(comp.componentName)
        comp.componentFileStore = componentFileStore

        // Load initial fsStore state into component or generate from default state
        const fsState = componentFileStore.get("reservedState")
        if (fsState) comp.state = {...comp.state, ...fsState}
        else {
            let data = {}
            comp.options.fsState.options.include.forEach(object=>{
                data[object.key] = comp.state[object.key]
            })
            componentFileStore.set("reservedState", data)
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

    components[comp.componentName] = comp
}

// mount components
const begin = ()=>{
    Object.values(components).forEach((comp)=>{
        comp.componentDidMount()
    })
}

module.exports = {
    Component: BaseComponent,
    global,
    globalChanged,
    use,
    begin
}

