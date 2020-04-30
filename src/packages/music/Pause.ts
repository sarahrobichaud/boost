import IModule from "../../interfaces/IModule";
import { serverQueues } from "../../index";

const Pause: IModule = {
  name: "Pause Module",
  cmd: "pause",
  execute: (props, args) => {
    const musicData = serverQueues.get(props.guild.id);
    musicData.dispatcher.pause();
  }
};
export default Pause;
