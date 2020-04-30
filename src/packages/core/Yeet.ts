import IModule from "../../interfaces/IModule";
import { Channel } from "discord.js";

const Yeet: IModule = {
  name: "Yeet",
  cmd: "yeet",
  execute: (props, args) => {
    props.channel.send("yeet");
  }
};
export default Yeet;
