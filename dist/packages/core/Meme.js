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
const discord_js_1 = require("discord.js");
const random_puppy_1 = __importDefault(require("random-puppy"));
const Meme = {
    name: "Random image from r/dankmemes",
    cmd: "meme",
    execute: (props, args) => {
        const { channel, author } = props;
        //Create Rich embed
        const memeEmbed = new discord_js_1.RichEmbed()
            .setColor("#8b096a")
            .setFooter(`Requested by ${author.username}`, author.avatarURL)
            .setTimestamp()
            .setAuthor(`Dank Boost`, props.client.user.avatarURL);
        //Mimic typing
        channel.startTyping();
        //Get random image
        random_puppy_1.default("dankmemes")
            .then((url) => __awaiter(void 0, void 0, void 0, function* () {
            if (!url) {
                throw new Error("No images found!");
            }
            memeEmbed.setImage(url); // Set image of embed
            yield channel
                .send(memeEmbed)
                .then(() => {
                channel.stopTyping(true);
                props.delete();
            })
                .catch(err => {
                console.log(err);
                channel.stopTyping(true);
                channel.send("Something went wrong!");
            });
        }))
            .catch(err => {
            console.log(err);
            channel.send("Something went wrong! Try searching for something else");
        });
    }
};
exports.default = Meme;
