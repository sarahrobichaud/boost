import IModule from "../../interfaces/IModule";
import { serverQueues } from "../../index";

const Stop: IModule = {
  name: "Stop Module",
  cmd: "stop",
  execute: (props, args) => {
    const musicData = serverQueues.get(props.guild.id);
    musicData.queue = [];
    musicData.dispatcher.end();
  }
};
export default Stop;
