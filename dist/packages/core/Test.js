"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Test = {
    name: "Test",
    cmd: "test",
    desc: "A test module.",
    execute: props => {
        console.log("Hello from the test module.");
    }
};
exports.default = Test;
