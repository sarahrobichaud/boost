import IModule from "../../interfaces/IModule";
import { Attachment } from "discord.js";
const Vapegod = {
  name: "Vapegod",
  cmd: "vapegod",
  execute: async (props, args) => {
    const { channel } = props;
    channel.startTyping();
    const gif = new Attachment("src/lib/gif/vapegod.gif");
    await channel
      .send({
        file: gif
      })
      .then(msg => channel.stopTyping());
  }
};
export default Vapegod;
