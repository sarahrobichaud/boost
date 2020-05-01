"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const fs_1 = __importDefault(require("fs"));
exports.update = (newData, path) => __awaiter(void 0, void 0, void 0, function* () {
    const local = JSON.parse(fs_1.default.readFileSync(path, { encoding: "utf8" }));
    const data_id = newData.map((item) => item.id);
    const local_id = local.map(settings => settings["_id"]);
    const added = [];
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
    if (!lodash_1.isEmpty(toAdd)) {
        toAdd.forEach(id => added.push({ _id: id, prefix: process.env.PREFIX }));
    }
    if (!lodash_1.isEmpty(toDelete)) {
        toDelete.forEach(id => {
            const item = local.find(item => item["_id"] === id);
            local.splice(local.indexOf(item), 1);
        });
    }
    if (!lodash_1.isEmpty(toAdd) || !lodash_1.isEmpty(toDelete)) {
        const toWrite = [...local, ...added];
        console.log(`Added    [${toAdd.length} guilds]`);
        console.log(`Deleted  [${toDelete.length} guilds]`);
        fs_1.default.writeFileSync(path, JSON.stringify(toWrite, null, 2));
        console.log(`Updated guilds.json`);
    }
});
