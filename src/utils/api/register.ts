import fs from "fs";
import { GuildMember, Collection } from "discord.js";
import { isEqual, isEmpty } from "lodash";

export const register = (
  newData: Collection<string, GuildMember>,
  path: string
) => {
  const local: Array<string> = JSON.parse(
    fs.readFileSync(path, { encoding: "utf8" })
  );

  const data_id = newData.map((item: GuildMember) => item.id);
  const local_id = local.map(settings => settings["_id"]);
  const added: Array<object> = [];

  if (!isEqual(local_id, data_id)) {
    const toAdd = [];

    data_id.map(i => {
      if (!local_id.includes(i)) {
        toAdd.push(i);
      }
    });
    if (!isEmpty(toAdd)) {
      toAdd.forEach(id => added.push({ _id: id, money: 50000, xp: 0 }));
      const toWrite = [...local, ...added];
      fs.writeFile(path, JSON.stringify(toWrite, null, 2), () => {
        console.log(`Registered [${toAdd.length} users]`);
      });
    }
  }
};
