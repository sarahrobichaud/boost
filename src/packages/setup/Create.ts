// @format
import IModule from "../../interfaces/IModule";
import { config } from "./setupConfig";
const Create: IModule = {
  name: "Create roles",
  cmd: "create-roles",
  execute: async (props, args) => {
    const { author, guild, content, channel, member } = props;
    const ranks = config.roles;

    let counter = 0;
    const totalRoles = config.roles.length;

    channel.startTyping();
    ranks.forEach(async rank => {
      await guild
        .createRole(
          { name: rank, color: "RANDOM", mentionable: false },
          "Boost inialization"
        )
        .then(role => {
          counter += 1;
          if (counter !== totalRoles) {
            console.log(
              `Created role [${role.name}] [${counter}/${totalRoles}]`
            );
            return;
          }
          console.log(`Created role [${role.name}] [${counter}/${totalRoles}]`);
          console.log("Done.");
          props.reply(
            "I created the roles for you, you can now run `setup set-roles`"
          );
          channel.stopTyping();
        });
    });
  }
};
export default Create;
