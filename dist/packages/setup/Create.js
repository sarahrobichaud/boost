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
const setupConfig_1 = require("./setupConfig");
const Create = {
    name: "Create roles",
    cmd: "create-roles",
    execute: (props, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { author, guild, content, channel, member } = props;
        const ranks = setupConfig_1.config.roles;
        let counter = 0;
        const totalRoles = setupConfig_1.config.roles.length;
        channel.startTyping();
        ranks.forEach((rank) => __awaiter(void 0, void 0, void 0, function* () {
            yield guild
                .createRole({ name: rank, color: "RANDOM", mentionable: false }, "Boost inialization")
                .then(role => {
                counter += 1;
                if (counter !== totalRoles) {
                    console.log(`Created role [${role.name}] [${counter}/${totalRoles}]`);
                    return;
                }
                console.log(`Created role [${role.name}] [${counter}/${totalRoles}]`);
                console.log("Done.");
                props.reply("I created the roles for you, you can now run `setup set-roles`");
                channel.stopTyping();
            });
        }));
    })
};
exports.default = Create;
