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
const Purge = {
    name: "Purge Roles",
    cmd: "purge",
    execute: (props, args) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("PURGE!!!");
        const { channel, author, content, guild } = props;
        channel.startTyping();
        let counter = 0;
        const totalMembers = guild.members.size;
        const rolesToRemove = guild.roles.filter(role => !role.hasPermission(["ADMINISTRATOR"]) &&
            setupConfig_1.config.roles.includes(role.name));
        rolesToRemove.forEach(role => console.log(role.name));
        console.log(`Total members: ${guild.members.size}`);
        guild.members.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
            yield member.removeRoles(rolesToRemove).then(member => {
                counter += 1;
                if (counter != totalMembers) {
                    return console.log(`${counter} / ${totalMembers}`);
                }
                console.log(`${counter} / ${totalMembers}`);
                console.log(`Done.`);
                channel.stopTyping();
                props.reply("All 'Boost' roles have been deleted");
            });
        }));
    })
};
exports.default = Purge;
