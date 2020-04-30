import IModule from "../../interfaces/IModule";
import { Message } from "discord.js";
const Wipe: IModule = {
  name: "Wipe",
  cmd: "wipe",
  desc: "Deletes multiple message, takes number of messages as first argument",
  execute: async (props, args) => {
    const { author, content, channel } = props;

    channel.startTyping();
    let fetched;
    let counter = 0;

    do {
      fetched = await channel.fetchMessages({ limit: parseInt(args[1]) + 1 });
      counter = counter + fetched.size;
      channel.bulkDelete(fetched);
    } while (fetched >= 2);

    if (counter > 1) {
      const alert = await channel.send(
        `🗑️ Deleted ${counter - 1} ${counter - 1 > 1 ? "messages" : "message"}`
      );
      console.log(
        `${author.username} deleted ${counter - 1} messages inside #${
          channel["name"]
        }`
      );
      if (alert instanceof Array) {
        alert.forEach(msg => msg.delete(2000));
      } else {
        alert.delete(2000);
      }
      channel.stopTyping(true);
    }
    channel.stopTyping(true);
  }
};
export default Wipe;
