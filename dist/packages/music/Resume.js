"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Resume = {
    name: "Resume Module",
    cmd: "resume",
    execute: (props, args) => {
        const musicData = index_1.serverQueues.get(props.guild.id);
        musicData.dispatcher.resume();
    }
};
exports.default = Resume;
