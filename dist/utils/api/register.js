"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
exports.register = (newData, path) => {
    const local = JSON.parse(fs_1.default.readFileSync(path, { encoding: "utf8" }));
    const data_id = newData.map((item) => item.id);
    const local_id = local.map(settings => settings["_id"]);
    const added = [];
    if (!lodash_1.isEqual(local_id, data_id)) {
        const toAdd = [];
        data_id.map(i => {
            if (!local_id.includes(i)) {
                toAdd.push(i);
            }
        });
        if (!lodash_1.isEmpty(toAdd)) {
            toAdd.forEach(id => added.push({ _id: id, money: 50000, xp: 0 }));
            const toWrite = [...local, ...added];
            fs_1.default.writeFile(path, JSON.stringify(toWrite, null, 2), () => {
                console.log(`Registered [${toAdd.length} users]`);
            });
        }
    }
};
