import { config } from "./setupConfig";
import IModule from "../../interfaces/IModule";
import { doesNotReject } from "assert";

const Set: IModule = {
  name: "Set roles",
  cmd: "set-roles",
  execute: async (props, args) => {
    const { guild, channel } = props;
    channel.startTyping();
    const totalMembers = guild.members.size;
    let guildHasRoles: boolean = true;
    let counter = 0;

    let firstRank;

    // Check if guild has the roles
    config.roles.forEach(cRole => {
      if (!guild.roles.map(role => role.name).includes(cRole)) {
        guildHasRoles = false;
      }
    });

    if (!guildHasRoles) return props.reply("Run `setup create-roles` first.");

    guild.members.forEach(async member => {
      await member
        .addRoles([guild.roles.find(role => role.name === config.roles[0])])
        .then(member => {
          counter += 1;
          if (counter !== totalMembers) {
            return console.log(
              `Ranked up ${member.displayName} to ${config.roles[0]} [${counter}/${totalMembers}]`
            );
          }
          console.log(
            `Ranked up ${member.displayName} to ${config.roles[0]} [${counter}/${totalMembers}]`
          );
          console.log("Done.");

          channel.stopTyping();
        });
    });

    console.log(guildHasRoles);
  }
};
export default Set;
