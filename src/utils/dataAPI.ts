import fs, { writeFileSync } from "fs";
import path from "path";

import { Guild, Collection, GuildMember } from "discord.js";

import { update } from "./api/update";
import { register } from "./api/register";
import ISettings from "../interfaces/ISettings";

const src = process.cwd();
const guildsPath = `${src}/data/guilds.json`;
const usersPath = `${src}/data/users.json`;

export default {
  guilds: {
    getSingle: (guildId: string): Object => {
      const guilds = fs.readFileSync("src/data/guilds.json");
      const content = String(guilds);
      const parsed = JSON.parse(content);
      return parsed.find((item: ISettings) => item._id === guildId);
    },
    update: async (guildData: Collection<string, Guild>) => {
      await update(guildData, guildsPath);
    },
    register: () => console.log("Register"),
    delete: () => console.log("Delete")
  },
  members: {
    get: () => console.log("GEt"),
    update: (guildData: Collection<string, Guild>) => {
      const allMembers: Collection<string, GuildMember> = new Collection();

      guildData.forEach((guild: Guild) => {
        guild.members.forEach(member => {
          allMembers.set(member.id, member);
        });
      });

      register(allMembers, usersPath);
    },
    register: () => console.log("register"),
    delete: () => console.log("delete")
  }
};
