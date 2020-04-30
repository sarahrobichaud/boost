//@format
import he from 'he';
import ytdl from 'ytdl-core';
import {YouTubeSearchResults} from 'youtube-search';
import {Message, MessageReaction, RichEmbed, VoiceChannel} from 'discord.js';

import {trim} from '../../../utils/trim';
import {serverQueues} from '../../..';

//Starts song
export const processSong = (vc: VoiceChannel, message: Message) => {
  const {guild} = message;

  //Get musicData of the server making the request.
  const musicData = serverQueues.get(guild.id);

  //Get bot user to later set its nickname.
  const bot = message.guild.members.get(message.client.user.id);

  const play = vc => {
    //Check if voice channel is joinable.
    if (vc.joinable) {
      //Sends an embed containing info about the song.
      sendSongInfo(message, musicData.queue);
      //Join voice channel.
      vc.join()
        .then(connection => {
          console.log(`Playing: ${musicData.queue[0].title}`);

          // Get stream from ytdl
          const stream = ytdl(musicData.queue[0].link, {
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
            } else {
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

export const formatEmbed = (
  embed: RichEmbed,
  results: YouTubeSearchResults[],
) => {
  results.forEach((item, index) => {
    const icon = (index: number) => {
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
    embed.addField(
      `${icon(index)} ${he.decode(item.title)}`,
      `By ${item.channelTitle}`,
    );
  });
};

// Sends a rich embed containing details about the song playing
export const sendSongInfo = async (
  message: Message,
  queue: Array<YouTubeSearchResults>,
) => {
  const {guild, channel, client} = message;
  const botGuildMember = guild.members.get(client.user.id);
  const song = queue[0];

  const decodedTitle = he.decode(song.title);
  botGuildMember.setNickname(
    `🎵 ${client.user.username} ${
      queue.length > 1 ? `[${queue.length - 1} queued]` : ''
    }`,
  );

  const infoEmbed = new RichEmbed()
    .setColor('#e91e64')
    .setTitle(trim(decodedTitle, 45))
    .setAuthor('Now playing', client.user.avatarURL)
    .setDescription(song.description)
    .setThumbnail(song.thumbnails.high.url)
    .addField('External links', `[Youtube](${song.link})`, true);

  if (queue.length > 1) {
    infoEmbed.addField('Next song', trim(song.title, 35), true);
  }

  await channel.send(infoEmbed);
};

//Use to send information about the queue.
export const sendQueueInfo = (
  message: Message,
  queue: Array<YouTubeSearchResults>,
): void => {
  const {guild, client, channel} = message;

  const queueEmbed = new RichEmbed()
    .setAuthor('Queue', client.user.avatarURL)
    .setTitle('Up next');
  const botGuildMember = guild.members.get(client.user.id);
  botGuildMember.setNickname(
    `🎵 ${client.user.username} 
      [${queue.length - 1} queued]`,
  );

  const _temp = [...queue].slice(1);
  _temp.forEach((song, index) =>
    queueEmbed.addField(
      `${index + 1}. ${trim(he.decode(song.title), 40)}`,
      `By ${song.channelTitle}`,
    ),
  );

  channel.send(queueEmbed);
};

//Makes the bot react to the search results so input is provided to the user.
// TODO: Add option to pass reactions as param.
export const initInput = (msg: Message) => {
  msg
    .react('1️⃣')
    .then(({message}: MessageReaction) => message.react('2️⃣'))
    .then(({message}: MessageReaction) => message.react('3️⃣'))
    .then(({message}: MessageReaction) => message.react('4️⃣'))
    .then(({message}: MessageReaction) => message.react('5️⃣'));
};
