//@format
import IModule from '../../interfaces/IModule';
import ytSearch, {
  YouTubeSearchOptions,
  YouTubeSearchResults,
} from 'youtube-search';

import * as _Play from './helpers/musicHelpers';
import {RichEmbed, Message, MessageReaction, User} from 'discord.js';
import {serverQueues} from '../../index';

const options: YouTubeSearchOptions = {
  maxResults: 5,
  key: process.env.YOUTUBE_API_KEY,
};

const Play: IModule = {
  name: 'Play music',
  cmd: 'play',
  execute: async (props, args) => {
    const dev = false;

    //Destructuring
    const {channel, guild} = props;

    //Check if a queue exist for the server, if not create one and assign it.
    if (!serverQueues.get(guild.id)) {
      serverQueues.set(guild.id, {dispatcher: null, queue: []});
    }
    let musicData = serverQueues.get(guild.id);
    console.log(`Music data:`, musicData);

    // Parse query
    const trimmed = args.slice(2);
    const query = trimmed.join(' ');

    if (!query) {
      return props.reply("looks like you didn't search for anything!");
    }

    //Prep results's embed.
    const resultsEmbed = new RichEmbed()
      .setTitle(`Results for "${query}"`)
      .setColor('#e91e63')
      .setAuthor('Youtube', props.client.user.avatarURL);

    //Song example to use for development.
    const devExample = {
      id: 'tVCUAXOBF7w',
      link: 'https://youtu.be/-BpSJlh4cL4',
      kind: 'youtube#video',
      publishedAt: '2020-01-02T07:58:36.000Z',
      channelId: 'UCRt5ckI8kNVMFr-jyj1IIVg',
      channelTitle: 'Channel Name',
      title: 'Development mode. Development mode. Development mode.',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      thumbnails: {
        default: {
          url: 'https://i.ytimg.com/vi/tVCUAXOBF7w/default.jpg',
          width: 120,
          height: 90,
        },
        medium: {
          url: 'https://i.ytimg.com/vi/tVCUAXOBF7w/mqdefault.jpg',
          width: 320,
          height: 180,
        },
        high: {
          url: 'https://i.ytimg.com/vi/tVCUAXOBF7w/hqdefault.jpg',
          width: 480,
          height: 360,
        },
      },
    };

    // To avoid spamming the youtube api.
    if (dev) {
      //Get stream from ytdl
      musicData.queue.push(devExample);

      //Get voice channel
      const vc = guild.member(props).voiceChannel;

      if (!vc) {
        return props.reply('You first need to join voice channel.');
      }

      //Join channel
      if (musicData.queue.length === 1) {
        _Play.processSong(vc, props);
      } else {
        _Play.sendQueueInfo(props, musicData.queue);
      }

      return;
    }
    // Search youtube with query.
    ytSearch(query, options, async (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      //For each results(5), format a field in resultsEmbed.
      _Play.formatEmbed(resultsEmbed, results);

      const resultsMsg = await channel.send(resultsEmbed);
      if (resultsMsg instanceof Message) {
        const filter = (reaction: MessageReaction, user: User) => {
          if (
            reaction.emoji.name === '1️⃣' ||
            reaction.emoji.name === '2️⃣' ||
            reaction.emoji.name === '3️⃣' ||
            reaction.emoji.name === '4️⃣' ||
            reaction.emoji.name === '5️⃣'
          ) {
            if (user.id === props.author.id) {
              return true;
            }
          }
        };

        _Play.initInput(resultsMsg);

        //Collects the first reaction made by the request's author
        let selected: YouTubeSearchResults;
        const collector = resultsMsg.createReactionCollector(filter, {
          time: 15000,
          max: 1,
        });

        // On collect
        collector.on('collect', r => {
          //Figure out the selected options by checking the emoji.
          let index: number;
          switch (r.emoji.name) {
            case '1️⃣':
              index = 0;
              break;
            case '2️⃣':
              index = 1;
              break;
            case '3️⃣':
              index = 2;
              break;
            case '4️⃣':
              index = 3;
              break;
            case '5️⃣':
              index = 4;
              break;
          }

          //Then assign it to a variable
          resultsMsg.delete();
          selected = results[index];
        });

        // On end
        // Emitted after the time runs out (20000ms) or max is reached
        collector.on('end', async collected => {
          console.log(`Collected ${collected.size} out of 1`);

          //If user didn't choose
          if (collected.size < 1) {
            //Alert him
            const alert = await channel.send('Time ran out!');
            if (alert instanceof Message) {
              resultsMsg.delete();
              alert.delete(2000);
            }
            return;
          }
          musicData.queue.push(selected);

          //Get voice channel
          const vc = guild.member(props).voiceChannel;

          if (!vc) {
            return props.reply('You first need to join voice channel.');
          }

          //Join channel
          console.log(musicData.queue.length);
          if (musicData.queue.length === 1) {
            _Play.processSong(vc, props);
          } else {
            _Play.sendQueueInfo(props, musicData.queue);
          }
        });
      }
    });
  },
};
export default Play;
