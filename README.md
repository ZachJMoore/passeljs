# Passel JS
: a large number or amount

Passel is an IoT framework built on top of NodeJs. Inspired by React, although the implementation is different, Passel has built in global, local, and filesystem state management.

#### Example Usage:

For a working example, take a look at the example folder or run yarn dev in the root directory.

index.js
```javascript
    const passel = require("passeljs")
    const TestComponent = require("./TestComponent.js")

    passel.use(TestComponent)

    passel.begin()
```

<br/>

TestComponent.js
```javascript
    const { Components } = require("passeljs")

    module.exports = class TestComponent extends Components.Base{

    constructor(props){
        super(props)

        this.componentName = "TestComponent" //required

        this.state = {
            temperature: 80,
            windSpeed: 5,
        }

    }

    componentDidMount(){ // All components are ready to go.

        // State can be access directly through this.state or this.global if no reactivity is needed.
        this.stateChanged.on("temperature", console.log) //called locally when the value of this.state.temperature changes
        this.globalChanged.on("TestComponent.temperature", console.log) //called globally when TestComponent changes the value of this.state.temperature

        const interval = setInterval(()=>{
            this.setState({temperature: this.state.temperature + 2})
        }, 2000)

        setTimeout(()=>{
            clearInterval(interval)
        }, 10000)

    }
}
```

#### Configuration

Options:
```javascript
this.options = {
    // defines what values from state will be saved to the filesystem and restored upon boot
    // All files are saved in app/storage/internal/[componentName]
    fsState: {
        options: {
            include: [
                {key: "temperature"},
                {key: "windSpeed"}
            ]
        }
    },
    // defines which values to expose to the global object and if they should emit globalChanged events
    globalState: {
        options: {
            include: [
                {
                    key: "temperature",
                    emit: true,
                },
                {
                    key: "windSpeed",
                    emit: false
                }
            ]
        }
    }
}
```

LifeCycle Events:
```javascript
    componentWillMount(){
        // Local State is initialized for this component, but not all components are ready
        // Not all of global state will be up to date yet.
        // It is not advised to setState here.
    }

    componentDidMount(){
        // All components are ready, global and local state are initialized. Do all of your logic here.
    }
```

#### Components

```javascript
    const { Components } = require("passeljs")

    // All components extend Components.Base and can access all the same functions.

    // Has access to all of the above
    class Basic extends Components.Base{
    }

    // Adds a function to received a FileStore class. Built on top of fsjetpack.
    // Useful for components that need to persist data but not always have it in memory/state
    // All files are saved in app/storage/public/[componentName]
    class Backup extends Components.WithStore{
        constructor(props){
            super(props)
    
            this.componentName = "Backup"
    
            class FileStore extends this.getFileStore(){
                constructor(props){
                    super(props)
                }
    
                writeTest(fileName, data){
                    this.directory.write(`${fileName}.json`, data, {
                        atomic: true
                        })
                    }
                }
    
                this.fileStore = new FileStore()
            }
        }

        componentDidMount(){
            this.fileStore.writeTest("testData", {
                text: "This is a WithStore component"
            })
        }
    }
```