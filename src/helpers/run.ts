import { Message } from "discord.js";
import IPackage from "../interfaces/IPackage";

export const run = (
  module: IPackage,
  props: { message: Message; args: string[] }
) => {
  console.log("-------------------------");
  const { message, args } = props;
  if (!module) {
    message.reply(`${args[0]} is not a command`);
  } else {
    console.log(`Running ${args[0]} module`.toUpperCase());
    module.execute(message, args);
  }
};
