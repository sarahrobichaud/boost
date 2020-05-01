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
const discord_js_1 = require("discord.js");
const lodash_1 = require("lodash");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const src = path_1.default.parse(__dirname).dir;
const packagePath = "/packages";
const register = (pathName, packageName) => {
    const modules = new discord_js_1.Collection();
    let counter = 0;
    //Load modules
    const files = fs_1.default.readdirSync(`${src}${pathName}`);
    const filtered = files.filter(file => !file.endsWith("Config.ts"));
    console.log(`${filtered.length} module${filtered.length > 1 ? "s" : ""} found @${packageName} 🔍`);
    filtered.forEach((file) => {
        if (!file.endsWith(".ts") && !file.endsWith(".js"))
            return;
        let props = require(`${src}${pathName}/${file}`);
        if (props.default) {
            counter += 1;
            let cmdName = props.default.cmd;
            modules.set(cmdName.toLowerCase(), props.default);
            console.log(`⚙️ Loading module [${file}]`);
        }
        if (lodash_1.isEmpty(props)) {
            console.log(`⚠ Skipped ${file} [Reason: No default export]`);
        }
    });
    console.log(`✅  Done (Loaded ${counter}/${filtered.length} modules)`);
    console.log("-------------------------");
    return modules;
};
exports.core = () => __awaiter(void 0, void 0, void 0, function* () {
    return register(`${packagePath}/core`, "core");
});
exports.setup = () => __awaiter(void 0, void 0, void 0, function* () {
    return register(`${packagePath}/setup`, "setup");
});
exports.music = () => __awaiter(void 0, void 0, void 0, function* () {
    return register(`${packagePath}/music`, "music");
});
