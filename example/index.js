const fs = require("fs");
const ROOT_PATH = fs.realpathSync(".");
const passel = require("../index");

const TestComponentOne = require("./components/TestComponentOne");
const TestComponentTwo = require("./components/TestComponentTwo");

// globalState never gets saved to filesystem, mainly is meant for sharing/exposing values (socketio server, express app, etc). The state of every component asking to expose to global also gets added to the global object
passel.setGlobalDefaults({
  globalCount: 0,
});

passel.globalChanged.on("globalCount", globalCount=>console.log({globalCount}))
passel.globalChanged.on("_state", _state=>console.log({_state}))
passel.globalChanged.on("_change_list", _change_list=>console.log({_change_list}))

// Order of .use() matters! If components need access to each other, make sure the values you need are set in componentWillMount or Constructor, and are not accessed from other components until componentDidMount

passel.use(TestComponentOne);
passel.use(TestComponentTwo);

passel.mountComponents();

setInterval(()=>{
  passel.setGlobal({globalCount: passel.global.globalCount + 1})
}, 2*1000)

console.log(passel.global.TestComponentOne)

console.log(`${new Date()}: application started.`);