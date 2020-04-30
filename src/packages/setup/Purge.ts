import IModule from "../../interfaces/IModule";
import { config } from "./setupConfig";
import { Message } from "discord.js";

const Purge: IModule = {
  name: "Purge Roles",
  cmd: "purge",
  execute: async (props, args) => {
    console.log("PURGE!!!");

    const { channel, author, content, guild } = props;
    channel.startTyping();

    let counter = 0;
    const totalMembers = guild.members.size;
    const rolesToRemove = guild.roles.filter(
      role =>
        !role.hasPermission(["ADMINISTRATOR"]) &&
        config.roles.includes(role.name)
    );

    rolesToRemove.forEach(role => console.log(role.name));
    console.log(`Total members: ${guild.members.size}`);
    guild.members.forEach(async member => {
      await member.removeRoles(rolesToRemove).then(member => {
        counter += 1;
        if (counter != totalMembers) {
          return console.log(`${counter} / ${totalMembers}`);
        }
        console.log(`${counter} / ${totalMembers}`);
        console.log(`Done.`);

        channel.stopTyping();
        props.reply("All 'Boost' roles have been deleted");
      });
    });
  }
};
export default Purge;
