const EventEmitter = require("events")
const BaseComponent = require("./components/BaseComponent.js")
const { internalStore } = require("./file_store")

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
        // Load initial fsStore state into component or generate from default state
        const fsState = internalStore.get(comp.componentName)
        if (fsState) comp.state = {...comp.state, ...fsState}
        else {
            let data = {}
            comp.options.fsState.options.include.forEach(object=>{
                data[object.key] = comp.state[object.key]
            })
            internalStore.set(comp.componentName, data)
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

