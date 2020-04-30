import { Guild, GuildMember, Collection } from "discord.js";
import { isEmpty, isEqual } from "lodash";
import fs from "fs";

export const update = async (
  newData: Collection<string, Guild>,
  path: string
) => {
  const local: Array<string> = JSON.parse(
    fs.readFileSync(path, { encoding: "utf8" })
  );
  const data_id = newData.map((item: Guild) => item.id);
  const local_id = local.map(settings => settings["_id"]);
  const added: Array<object> = [];

  const toAdd = [];
  const toDelete = [];

  data_id.map(i => {
    if (!local_id.includes(i)) {
      toAdd.push(i);
    }
  });
  local_id.map(i => {
    if (!data_id.includes(i)) {
      toDelete.push(i);
    }
  });
  if (!isEmpty(toAdd)) {
    toAdd.forEach(id => added.push({ _id: id, prefix: process.env.PREFIX }));
  }
  if (!isEmpty(toDelete)) {
    toDelete.forEach(id => {
      const item = local.find(item => item["_id"] === id);
      local.splice(local.indexOf(item), 1);
    });
  }
  if (!isEmpty(toAdd) || !isEmpty(toDelete)) {
    const toWrite = [...local, ...added];

    console.log(`Added    [${toAdd.length} guilds]`);
    console.log(`Deleted  [${toDelete.length} guilds]`);
    fs.writeFileSync(path, JSON.stringify(toWrite, null, 2));
    console.log(`Updated guilds.json`);
  }
};
