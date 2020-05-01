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
//@format
const he_1 = __importDefault(require("he"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const discord_js_1 = require("discord.js");
const trim_1 = require("../../../utils/trim");
const __1 = require("../../..");
//Starts song
exports.processSong = (vc, message) => {
    const { guild } = message;
    //Get musicData of the server making the request.
    const musicData = __1.serverQueues.get(guild.id);
    //Get bot user to later set its nickname.
    const bot = message.guild.members.get(message.client.user.id);
    const play = vc => {
        //Check if voice channel is joinable.
        if (vc.joinable) {
            //Sends an embed containing info about the song.
            exports.sendSongInfo(message, musicData.queue);
            //Join voice channel.
            vc.join()
                .then(connection => {
                console.log(`Playing: ${musicData.queue[0].title}`);
                // Get stream from ytdl
                const stream = ytdl_core_1.default(musicData.queue[0].link, {
                    filter: 'audioonly',
                    highWaterMark: 1 << 20,
                });
                //Create stream dispatcher and assign it to musicData
                const dispatcher = connection.playStream(stream, {
                    seek: 0,
                    volume: 0.5,
                });
                musicData.dispatcher = dispatcher;
                //For development
                // setTimeout(() => dispatcher.end(), 10000);
                //Setup listener for an 'end' event.
                dispatcher.on('end', reason => {
                    //Log reason for development.
                    console.log(`Reason: ${reason}`);
                    console.log('----------');
                    //Remove the song that ended from the queue.
                    musicData.queue.shift();
                    //If the queue is empty, reset nickname and disconnect.
                    if (musicData.queue.length < 1) {
                        bot.setNickname(message.client.user.username);
                        message.channel.send('Nothing left to play, now leaving!');
                        connection.disconnect();
                    }
                    else {
                        //If not empty, re-execute play function.
                        play(vc);
                    }
                });
            })
                .catch(err => console.error(err));
        }
    };
    //Play song
    play(vc);
};
exports.formatEmbed = (embed, results) => {
    results.forEach((item, index) => {
        const icon = (index) => {
            switch (index + 1) {
                case 1:
                    return ':one:';
                    break;
                case 2:
                    return ':two:';
                    break;
                case 3:
                    return ':three:';
                    break;
                case 4:
                    return ':four:';
                    break;
                case 5:
                    return ':five:';
                    break;
                default:
                    '';
            }
        };
        embed.addField(`${icon(index)} ${he_1.default.decode(item.title)}`, `By ${item.channelTitle}`);
    });
};
// Sends a rich embed containing details about the song playing
exports.sendSongInfo = (message, queue) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild, channel, client } = message;
    const botGuildMember = guild.members.get(client.user.id);
    const song = queue[0];
    const decodedTitle = he_1.default.decode(song.title);
    botGuildMember.setNickname(`🎵 ${client.user.username} ${queue.length > 1 ? `[${queue.length - 1} queued]` : ''}`);
    const infoEmbed = new discord_js_1.RichEmbed()
        .setColor('#e91e64')
        .setTitle(trim_1.trim(decodedTitle, 45))
        .setAuthor('Now playing', client.user.avatarURL)
        .setDescription(song.description)
        .setThumbnail(song.thumbnails.high.url)
        .addField('External links', `[Youtube](${song.link})`, true);
    if (queue.length > 1) {
        infoEmbed.addField('Next song', trim_1.trim(song.title, 35), true);
    }
    yield channel.send(infoEmbed);
});
//Use to send information about the queue.
exports.sendQueueInfo = (message, queue) => {
    const { guild, client, channel } = message;
    const queueEmbed = new discord_js_1.RichEmbed()
        .setAuthor('Queue', client.user.avatarURL)
        .setTitle('Up next');
    const botGuildMember = guild.members.get(client.user.id);
    botGuildMember.setNickname(`🎵 ${client.user.username} 
      [${queue.length - 1} queued]`);
    const _temp = [...queue].slice(1);
    _temp.forEach((song, index) => queueEmbed.addField(`${index + 1}. ${trim_1.trim(he_1.default.decode(song.title), 40)}`, `By ${song.channelTitle}`));
    channel.send(queueEmbed);
};
//Makes the bot react to the search results so input is provided to the user.
// TODO: Add option to pass reactions as param.
exports.initInput = (msg) => {
    msg
        .react('1️⃣')
        .then(({ message }) => message.react('2️⃣'))
        .then(({ message }) => message.react('3️⃣'))
        .then(({ message }) => message.react('4️⃣'))
        .then(({ message }) => message.react('5️⃣'));
};
