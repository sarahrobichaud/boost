import { Message } from "discord.js";

interface IPackage {
  name: string;
  cmd: string;
  execute: (props: Message, args: string[]) => void;
}

export default IPackage;
