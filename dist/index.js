"use strict";
// @format
// boostbot
// https://github.com/tomyrobichaud
// 2020
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//DotEnv
const dotenv_1 = __importDefault(require("dotenv"));
//Discord.js
const discord_js_1 = require("discord.js");
//API
//import dataAPI from './utils/dataAPI';
//Helpers / Utilities / Interfaces
const run_1 = require("./helpers/run");
const LoadPackage = __importStar(require("./utils/PackageLoader"));
//Initiate the client.
console.log(process.env.NODE_ENV);
dotenv_1.default.config();
const client = new discord_js_1.Client();
const commands = {
    setup: new discord_js_1.Collection(),
    core: new discord_js_1.Collection(),
    music: new discord_js_1.Collection(),
};
const moduleArgs = {
    core: null,
    setup: 'setup',
    music: 'y',
};
exports.serverQueues = new discord_js_1.Collection();
//Set delay in ms between every updates.
const updateMS = 1000;
//Initialization...
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`-----------------------------------`);
    //Load modules.
    commands.setup = yield LoadPackage.setup();
    commands.core = yield LoadPackage.core();
    commands.music = yield LoadPackage.music();
    //Update Loop. (default: 1000ms)
    let _tempTotal;
    setInterval(() => {
        const totalGuilds = client.guilds.size;
        client.user.setActivity(`${client.guilds.size} server${client.guilds.size > 1 ? 's' : ''}`, {
            type: 'WATCHING',
        });
        //updates.
        //dataAPI.guilds.update(client.guilds);
        //dataAPI.members.update(client.guilds);
        //Log if guild total changes.
        if (totalGuilds != _tempTotal) {
            _tempTotal = client.guilds.size;
            console.log(`[${client.guilds.size} guilds]`);
        }
    }, updateMS); //Default: 1000ms
    console.log(`Update rate: ${updateMS}ms`);
    // Handle missing modules (temp)
    if (!commands.setup || !commands.core || !commands.music) {
        throw new Error('Something went wrong!');
    }
}));
// On Message
client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    //Force update
    //await dataAPI.guilds.update(client.guilds);
    // Get custom settings from local storage.
    //const settings = dataAPI.guilds.getSingle(message.guild.id);
    const settings = null;
    //Set custom prefix if available.
    const prefix = settings ? settings['prefix'] : process.env.PREFIX;
    //Destructuring
    const { content, channel } = message;
    //Ignore random messages.
    if (message.author.bot)
        return;
    if (!content.startsWith(prefix))
        return;
    //Log command ([<guildName>](<author>)#<channelName>: <messageContent>).
    console.log(`[${message.guild.name}](${message.author.username})#${channel['name']}: ${content}`);
    //Parse arguments.
    const args = content.split(' ');
    const firstArg = args[0].replace(prefix, '').toLowerCase();
    const props = { message, args };
    //Check admin permissions.
    const isAdmin = message.member.hasPermission('ADMINISTRATOR', true, true);
    //Handles core modules
    if (commands.core.has(firstArg)) {
        return run_1.run(commands.core.get(firstArg), props);
    }
    //Handles non-core modules
    let selectedPackage;
    //Filter
    switch (firstArg) {
        //Setup Module
        case moduleArgs.setup:
            //Validate format and verify permissions.
            if (!isAdmin || !args[1]) {
                if (!args[1]) {
                    return message.reply(`Invalid format \`\`\` ${prefix}setup <command>\`\`\``);
                }
                message.reply("You don't have permissions to run setup commands!");
                return;
            }
            //Launch module from setup collection.
            selectedPackage = commands.setup;
        //Music Module
        case moduleArgs.music:
            //Launch module from music collection.
            if (!args[1]) {
                return message.reply(`Invalid format \`\`\` ${prefix}y play <search> \`\`\` \`\`\` ${prefix}y pause\`\`\` \`\`\` ${prefix}y stop\`\`\` \`\`\` ${prefix}y skip \`\`\` \`\`\` ${prefix}y queue\`\`\``);
            }
            selectedPackage = commands.music;
    }
    if (selectedPackage) {
        const command = args[1].toLowerCase();
        run_1.run(selectedPackage.get(command), props);
    }
}));
//Authenticate client
client.login(process.env.TOKEN);
