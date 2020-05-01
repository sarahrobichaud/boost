"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Stop = {
    name: "Stop Module",
    cmd: "stop",
    execute: (props, args) => {
        const musicData = index_1.serverQueues.get(props.guild.id);
        musicData.queue = [];
        musicData.dispatcher.end();
    }
};
exports.default = Stop;
