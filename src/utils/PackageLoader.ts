import { Collection } from "discord.js";
import { isEmpty } from "lodash";

import IModule from "../interfaces/IModule";

import fs from "fs";
import path from "path";

const src = path.parse(__dirname).dir;
const packagePath = "/packages";

const register = (pathName: string, packageName: string) => {
  const modules: Collection<string, IModule> = new Collection();
  let counter = 0;

  //Load modules
  const files = fs.readdirSync(`${src}${pathName}`);
  const filtered = files.filter(file => !file.endsWith("Config.ts"));
  console.log(
    `${filtered.length} module${
      filtered.length > 1 ? "s" : ""
    } found @${packageName} 🔍`
  );

  filtered.forEach((file: string) => {
    if (!file.endsWith(".ts")) return;
    let props = require(`${src}${pathName}/${file}`);
    if (props.default) {
      counter += 1;
      let cmdName = props.default.cmd;
      modules.set(cmdName.toLowerCase(), props.default);
      console.log(`⚙️ Loading module [${file}]`);
    }
    if (isEmpty(props)) {
      console.log(`⚠ Skipped ${file} [Reason: No default export]`);
    }
  });
  console.log(`✅  Done (Loaded ${counter}/${filtered.length} modules)`);
  console.log("-------------------------");

  return modules;
};

export const core = async () => {
  return register(`${packagePath}/core`, "core");
};
export const setup = async () => {
  return register(`${packagePath}/setup`, "setup");
};
export const music = async () => {
  return register(`${packagePath}/music`, "music");
};
