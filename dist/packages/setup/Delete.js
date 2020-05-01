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
const Delete = {
    name: "Delete Roles",
    cmd: "delete-roles",
    execute: (props, args) => {
        const { author, channel, content, guild, member } = props;
        channel.startTyping();
        //checks how many role the server has to delete.
        let counter = 0;
        let totalRoles = 0;
        guild.roles.forEach(role => {
            setupConfig_1.config.roles.forEach((roleName) => __awaiter(void 0, void 0, void 0, function* () {
                if (role.name === roleName) {
                    totalRoles += 1;
                    yield role.delete().then(deleted => {
                        counter += 1;
                        if (counter !== totalRoles) {
                            console.log(`Deleted role [${deleted.name}] [${counter}/${totalRoles}]`);
                            return;
                        }
                        channel.stopTyping();
                        console.log(`Deleted role [${deleted.name}] [${counter}/${totalRoles}]`);
                        console.log("Done.");
                        props.reply("I deleted all 'Boost' roles from the server");
                    });
                }
            }));
        });
    }
};
exports.default = Delete;
