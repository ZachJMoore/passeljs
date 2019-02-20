const { PasselComponent } = require("../index.js")

class TestComponent extends PasselComponent{

    constructor(props){
        super(props)

        // Required name for assigning files and global state
        this.componentName = "TestComponent"

        this.state = {
            temperature: 80,
            windSpeed: 5,
        }


        this.options = {
            // store local component state values in file system. State will be loaded in on first boot. Useful for persisting last state in case of shutdown
            fsState: { 
                options: {
                    include: [
                        {key: "temperature"},
                        {key: "windSpeed"}
                    ]
                }
            },
            // makes local component state values available to all other components through this.global
            globalState: {
                options: {
                    include: [
                        {
                            key: "temperature",
                            emit: true, // wether to emit a globalChange event or not. Useful if no components need to immediately react (i.e component intervals)
                        },
                        {
                            key: "windSpeed",
                            emit: false
                        }
                    ]
                }
            }
        }
    }

    passelWillMount(){ // This is called once things have been initialized and state is assigned but before all components have gotten ready to mount
        console.log(this.state)
    }

    passelDidMount(){ // All components are ready to go.


        this.stateChanged.on("temperature", console.log) //local stage change callback
        this.globalChanged.on("TestComponent.temperature", console.log) //global state change callback. These are prefixed with the componentName to avoid naming conflicts.

        // example state updating. Could be used for IoT devices to keep track of sensors
        const interval = setInterval(()=>{
            this.setState({temperature: this.state.temperature + 2})
        }, 2000)

        setTimeout(()=>{
            clearInterval(interval)
        }, 10000)

    }
}

module.exports = TestComponent