"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Yeet = {
    name: "Yeet",
    cmd: "yeet",
    execute: (props, args) => {
        props.channel.send("yeet");
    }
};
exports.default = Yeet;
