import IModule from "../../interfaces/IModule";
import { config } from "./setupConfig";

const Delete: IModule = {
  name: "Delete Roles",
  cmd: "delete-roles",
  execute: (props, args) => {
    const { author, channel, content, guild, member } = props;

    channel.startTyping();
    //checks how many role the server has to delete.
    let counter = 0;
    let totalRoles = 0;
    guild.roles.forEach(role => {
      config.roles.forEach(async roleName => {
        if (role.name === roleName) {
          totalRoles += 1;
          await role.delete().then(deleted => {
            counter += 1;
            if (counter !== totalRoles) {
              console.log(
                `Deleted role [${deleted.name}] [${counter}/${totalRoles}]`
              );
              return;
            }
            channel.stopTyping();
            console.log(
              `Deleted role [${deleted.name}] [${counter}/${totalRoles}]`
            );
            console.log("Done.");
            props.reply("I deleted all 'Boost' roles from the server");
          });
        }
      });
    });
  }
};
export default Delete;
