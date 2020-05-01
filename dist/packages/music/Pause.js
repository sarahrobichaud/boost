"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const Pause = {
    name: "Pause Module",
    cmd: "pause",
    execute: (props, args) => {
        const musicData = index_1.serverQueues.get(props.guild.id);
        musicData.dispatcher.pause();
    }
};
exports.default = Pause;
