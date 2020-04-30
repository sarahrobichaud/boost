import { Message } from "discord.js";
interface IModule {
  name: string;
  cmd: string;
  desc?: string;
  execute: (props: Message, args: string[]) => void;
}

export default IModule;
