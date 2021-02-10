const fs = require("fs");
const ROOT_PATH = fs.realpathSync(".");
const passel = require("../index");

const TestComponentOne = require("./components/TestComponentOne");
const TestComponentTwo = require("./components/TestComponentTwo");

// Start application
passel.setGlobalDefaults({
  globalCount: 0,
});



// Order of .use() matters! If components need access to each other, make sure the values you need are set in componentWillMount or Constructor, and are not accessed from other components until componentDidMount

passel.use(TestComponentOne);
passel.use(TestComponentTwo);

passel.mountComponents();

console.log(passel.global.TestComponentOne)

console.log(`${new Date()}: application started.`);