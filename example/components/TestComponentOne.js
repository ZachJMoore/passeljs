const { Components } = require("../../index.js");
const fs = require("fs")
const path = require("path")
ROOT_APP_PATH = fs.realpathSync('.')

const TestComponentChild = require("./TestComponentChild")

class TestComponentOne extends Components.Base {
  constructor(props) {
    super(props);

    this.state = {
        count: 0
    }

    this.options = {
        fsState: {
            relativeFilePath: "_storage_relative",
            // absoluteFilePath: path.join(ROOT_APP_PATH, "_storage_absolute"),
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
    this.use(TestComponentChild)
  }

  componentDidMount() {

    setInterval(()=>{
        this.setState({count: this.state.count + 1})
        console.log({count: this.state.count})
    }, 2*1000)

  }
}

module.exports = TestComponentOne;
