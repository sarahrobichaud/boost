import IModule from "../../interfaces/IModule";
import { serverQueues } from "../../index";

const Resume: IModule = {
  name: "Resume Module",
  cmd: "resume",
  execute: (props, args) => {
    const musicData = serverQueues.get(props.guild.id);
    musicData.dispatcher.resume();
  }
};
export default Resume;
