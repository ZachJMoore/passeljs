const { Components } = require("../../index.js");
const fs = require("fs")
const path = require("path")
ROOT_APP_PATH = fs.realpathSync('.')

class TestComponentChildChild extends Components.Base {
    constructor(props) {
      super(props);
  
      this.state = {
          count: 0
      }
  
      this.options = {
          fsState: {
            //   relativeFilePath: "_storage_relative", // will inherit from parent if not set
            //   absoluteFilePath: path.join(ROOT_APP_PATH, "_storage_absolute"), // will inherit from parent if not set
              recurrentUpdateLimit: null,
              options: {
                  include: [
                      {
                          key: "count"
                      }
                  ]
              }
          },
          globalState: {
              options: {
                  include: [
                      {
                          key: "count",
                          emit: true
                      }
                  ]
              }
          }
        };
    }
  
    componentWillMount(){
        
    }
  
    componentDidMount() {
  
      setInterval(()=>{
          this.setState({count: this.state.count + 1})
          console.log({count: this.state.count})
      }, 2*1000)
  
    }
  }


class TestComponentChild extends Components.Base {
    constructor(props) {
      super(props);
  
      this.state = {
          count: 0
      }
  
      this.options = {
          fsState: {
            //   relativeFilePath: "_storage_relative", // will inherit from parent if not set
            //   absoluteFilePath: path.join(ROOT_APP_PATH, "_storage_absolute"), // will inherit from parent if not set
              recurrentUpdateLimit: null,
              options: {
                  include: [
                      {
                          key: "count"
                      }
                  ]
              }
          },
          globalState: {
              options: {
                  include: [
                      {
                          key: "count",
                          emit: true
                      }
                  ]
              }
          }
        };
    }
  
    componentWillMount(){
        this.use(TestComponentChildChild)
    }
  
    componentDidMount() {
  
      setInterval(()=>{
          this.setState({count: this.state.count + 1})
          console.log({count: this.state.count})
      }, 2*1000)
  
    }
  }

module.exports = TestComponentChild