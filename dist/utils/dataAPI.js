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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const update_1 = require("./api/update");
const register_1 = require("./api/register");
const src = process.cwd();
const guildsPath = `${src}/data/guilds.json`;
const usersPath = `${src}/data/users.json`;
exports.default = {
    guilds: {
        getSingle: (guildId) => {
            const guilds = fs_1.default.readFileSync("src/data/guilds.json");
            const content = String(guilds);
            const parsed = JSON.parse(content);
            return parsed.find((item) => item._id === guildId);
        },
        update: (guildData) => __awaiter(void 0, void 0, void 0, function* () {
            yield update_1.update(guildData, guildsPath);
        }),
        register: () => console.log("Register"),
        delete: () => console.log("Delete")
    },
    members: {
        get: () => console.log("GEt"),
        update: (guildData) => {
            const allMembers = new discord_js_1.Collection();
            guildData.forEach((guild) => {
                guild.members.forEach(member => {
                    allMembers.set(member.id, member);
                });
            });
            register_1.register(allMembers, usersPath);
        },
        register: () => console.log("register"),
        delete: () => console.log("delete")
    }
};
