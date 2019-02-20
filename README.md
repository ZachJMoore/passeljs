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
    const { PasselComponent } = require("passeljs")

    class TestComponent extends PasselComponent{

    constructor(props){
        super(props)

        this.componentName = "TestComponent" //required

        this.state = {
            temperature: 80,
            windSpeed: 5,
        }

    }

    passelDidMount(){ // All components are ready to go.

        // State can be access directly through this.state or this.global if no reactivity is needed.
        this.stateChanged.on("temperature", console.log) //local
        this.globalChanged.on("TestComponent.temperature", console.log) //global.

        const interval = setInterval(()=>{
            this.setState({temperature: this.state.temperature + 2})
        }, 2000)

        setTimeout(()=>{
            clearInterval(interval)
        }, 10000)

    }
}

module.exports = TestComponent
```

#### Configuration

Options:
```javascript
this.options = {
    // defines what values from state will be saved to the filesystem
    fsState: {
        options: {
            include: [
                {key: "temperature"},
                {key: "windSpeed"}
            ]
        }
    },
    // defines which values to expose to the global object and if they should emit globalChanged
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
    passelWillMount(){
        // State is initialized for this component, but not all components are ready
    }

    passelDidMount(){
        // All components are ready. Do all of your logic here.
    }
```