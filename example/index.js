const passel = require("../index.js")
const TestComponent = require("./TestComponent.js")
const TestTwoComponent = require("./TestTwoComponent.js")

passel.use(TestComponent)
passel.use(TestTwoComponent)

passel.begin()