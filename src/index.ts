// @format
// boostbot
// https://github.com/tomyrobichaud
// 2020

//DotEnv
import dotenv from 'dotenv';

//Discord.js
import {Client, Collection, Message} from 'discord.js';

//API
import dataAPI from './utils/dataAPI';

//Helpers / Utilities / Interfaces
import {run} from './helpers/run';
import {IMusicData} from './interfaces/IMusicData';
import * as LoadPackage from './utils/PackageLoader';
import IModule from './interfaces/IModule';

//Initiate the client.
console.log(process.env.NODE_ENV);

dotenv.config({path: `config/config.env`});

const client: Client = new Client();

interface ICommands {
  setup: Collection<string, IModule>;
  core: Collection<string, IModule>;
  music: Collection<string, IModule>;
}

const commands: ICommands = {
  setup: new Collection(),
  core: new Collection(),
  music: new Collection(),
};

interface IModuleArgs {
  core: null;
  setup: string;
  music: string;
}

const moduleArgs: IModuleArgs = {
  core: null,
  setup: 'setup',
  music: 'y',
};

export const serverQueues: Collection<string, IMusicData> = new Collection();

//Set delay in ms between every updates.
const updateMS = 1000;

//Initialization...
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`-----------------------------------`);

  //Load modules.
  commands.setup = await LoadPackage.setup();
  commands.core = await LoadPackage.core();
  commands.music = await LoadPackage.music();

  //Update Loop. (default: 1000ms)
  let _tempTotal: number;
  setInterval(() => {
    const totalGuilds = client.guilds.size;

    client.user.setActivity(
      `${client.guilds.size} server${client.guilds.size > 1 ? 's' : ''}`,
      {
        type: 'WATCHING',
      },
    );

    //updates.
    dataAPI.guilds.update(client.guilds);
    dataAPI.members.update(client.guilds);

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
});

// On Message
client.on('message', async (message: Message) => {
  interface IProps {
    message: Message;
    args: Array<string>;
  }
  //Force update
  await dataAPI.guilds.update(client.guilds);

  // Get custom settings from local storage.
  const settings = dataAPI.guilds.getSingle(message.guild.id);

  //Set custom prefix if available.
  const prefix: string = settings ? settings['prefix'] : process.env.PREFIX;

  //Destructuring
  const {content, channel} = message;

  //Ignore random messages.
  if (message.author.bot) return;
  if (!content.startsWith(prefix)) return;

  //Log command ([<guildName>](<author>)#<channelName>: <messageContent>).
  console.log(
    `[${message.guild.name}](${message.author.username})#${channel['name']}: ${content}`,
  );

  //Parse arguments.
  const args: string[] = content.split(' ');
  const firstArg: string = args[0].replace(prefix, '').toLowerCase();
  const props: IProps = {message, args};

  //Check admin permissions.
  const isAdmin = message.member.hasPermission('ADMINISTRATOR', true, true);

  //Handles core modules
  if (commands.core.has(firstArg)) {
    return run(commands.core.get(firstArg), props);
  }

  //Handles non-core modules
  let selectedPackage: Collection<string, IModule>;
  //Filter
  switch (firstArg) {
    //Setup Module
    case moduleArgs.setup:
      //Validate format and verify permissions.
      if (!isAdmin || !args[1]) {
        if (!args[1]) {
          return message.reply(
            `Invalid format \`\`\` ${prefix}setup <command>\`\`\``,
          );
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
        return message.reply(
          `Invalid format \`\`\` ${prefix}y play <search> \`\`\` \`\`\` ${prefix}y pause\`\`\` \`\`\` ${prefix}y stop\`\`\` \`\`\` ${prefix}y skip \`\`\` \`\`\` ${prefix}y queue\`\`\``,
        );
      }

      selectedPackage = commands.music;
  }
  if (selectedPackage) {
    const command = args[1].toLowerCase();
    run(selectedPackage.get(command), props);
  }
});

//Authenticate client
client.login(process.env.TOKEN);
