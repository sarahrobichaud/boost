"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Vapegod = {
    name: "Vapegod",
    cmd: "vapegod",
    execute: (props, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { channel } = props;
        channel.startTyping();
        const gif = new discord_js_1.Attachment("lib/gif/vapegod.gif");
        yield channel
            .send({
            file: gif
        })
            .then(msg => channel.stopTyping());
    })
};
exports.default = Vapegod;
