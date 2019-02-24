const EventEmitter = require("events")
const Components = require("./components")
const { InternalComponentStore } = require("./file_store")
const helpers = require("./helpers.js")
const _ = require("lodash")


// global state
const global = {}
const globalReservedTopLevelKeys = {}
const globalSetStateReservedKeys = {}
const globalChanged = new EventEmitter()

// exposed component functions
const exposedComponentFunctions = {}

// components listed by name
const initializedComponents = {}

// Make sure we know where we are at and can enforce calling functions in the correct order
let hasInitialized = false
let hasMounted = false

// set global defaults
const setGlobalDefaults = (object)=>{
    if (hasInitialized) throw new Error("You must set global defaults before calling passel.use(...)")
    if (hasMounted) throw new Error("You must set global defaults before mounting components")
    if (Array.isArray(object)) throw new Error("Global defaults requires an object. You passed an array")
    if (typeof object !== "object") throw new Error(`Global defaults requires an object. You passed an value with typeof: ${typeof object}`)

    Object.keys(object).forEach(key=>{
        globalSetStateReservedKeys[key] = true
        global[key] = object[key]
    })
}

// initialize new top level components
const use = (Comp, propsToInherit)=>{
    if (hasMounted) throw new Error("You must initialized components before calling passel.mountComponents()")

    const comp = new Comp({global, globalChanged, propsToInherit, initializedComponents, exposedComponentFunctions, globalReservedTopLevelKeys, globalSetStateReservedKeys})

    if (!comp.componentName) throw new Error(`Component names are required`)
    if (initializedComponents[comp.componentName]) throw new Error(`Component name '${comp.componentName}' is already used. Duplicate names not allowed`)

    // define the global and file system state path. All top level components use just their component name
    comp._component_path = [comp.componentName]
    comp._component_depth = 0
    comp._component_has_initialized = true

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
        if (globalSetStateReservedKeys[comp.componentName] !== undefined) throw new Error(`this.global.${comp.componentName} is already reserved for default global state. Component '${comp.componentName}' needs to change its componentName or this.setGlobal must be used manually rather than having passel do it automatically`)
        globalReservedTopLevelKeys[comp.componentName] = true
        // load initial global state
        comp.options.globalState.options.include.forEach(object=>{
            if (!global[comp.componentName]) global[comp.componentName] = {}
            global[comp.componentName][object.key] = comp.state[object.key]
        })
    }

    if (comp.options && comp.options.exposeFunctions){
        // expose component functions
        comp.options.exposeFunctions.options.include.forEach(object=>{

            let pathRef = helpers.resolveObjectPath(comp._component_path, exposedComponentFunctions)
            let temp = {}
            if (pathRef && pathRef[object.key]) throw new Error(`exposedComponentFunctions path ${comp._component_path.join(".") + "." + object.key} is already occupied. There is a naming conflict.`)
            else if (!pathRef) pathRef = helpers.createObjectPath(comp._component_path, temp)
            pathRef[object.key] = comp[object.key].bind(comp)
            _.merge(exposedComponentFunctions, temp)

        })
    }

    comp._initialized_component_path = [comp.componentName]

    initializedComponents[comp.componentName] = {
        component: comp,
        children: {}
    }

    comp.componentWillMount()
    hasInitialized = true
}

// mount components
const mountComponents = ()=>{
    if (!hasInitialized) throw new Error("There are no components to mount. Maybe you forgot to call passel.use(...)")
    let mount = (object)=>{
        Object.values(object).forEach((comp)=>{
            comp.component._component_has_mounted = true
            comp.component.componentDidMount()
            if (comp.children) mount(comp.children)
        })
    }

    mount(initializedComponents)
    hasMounted = true
}

module.exports = {
    Components,
    global,
    globalChanged,
    setGlobalDefaults,
    use,
    mountComponents,
    exposedComponentFunctions
}

