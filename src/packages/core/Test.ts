import IModule from "../../interfaces/IModule";
import { MessageChannel } from "worker_threads";

const Test: IModule = {
  name: "Test",
  cmd: "test",
  desc: "A test module.",
  execute: props => {
    console.log("Hello from the test module.");
  }
};

export default Test;
