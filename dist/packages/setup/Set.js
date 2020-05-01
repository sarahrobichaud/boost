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
const Set = {
    name: "Set roles",
    cmd: "set-roles",
    execute: (props, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild, channel } = props;
        channel.startTyping();
        const totalMembers = guild.members.size;
        let guildHasRoles = true;
        let counter = 0;
        let firstRank;
        // Check if guild has the roles
        setupConfig_1.config.roles.forEach(cRole => {
            if (!guild.roles.map(role => role.name).includes(cRole)) {
                guildHasRoles = false;
            }
        });
        if (!guildHasRoles)
            return props.reply("Run `setup create-roles` first.");
        guild.members.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
            yield member
                .addRoles([guild.roles.find(role => role.name === setupConfig_1.config.roles[0])])
                .then(member => {
                counter += 1;
                if (counter !== totalMembers) {
                    return console.log(`Ranked up ${member.displayName} to ${setupConfig_1.config.roles[0]} [${counter}/${totalMembers}]`);
                }
                console.log(`Ranked up ${member.displayName} to ${setupConfig_1.config.roles[0]} [${counter}/${totalMembers}]`);
                console.log("Done.");
                channel.stopTyping();
            });
        }));
        console.log(guildHasRoles);
    })
};
exports.default = Set;
