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
Object.defineProperty(exports, "__esModule", { value: true });
const Wipe = {
    name: "Wipe",
    cmd: "wipe",
    desc: "Deletes multiple message, takes number of messages as first argument",
    execute: (props, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { author, content, channel } = props;
        channel.startTyping();
        let fetched;
        let counter = 0;
        do {
            fetched = yield channel.fetchMessages({ limit: parseInt(args[1]) + 1 });
            counter = counter + fetched.size;
            channel.bulkDelete(fetched);
        } while (fetched >= 2);
        if (counter > 1) {
            const alert = yield channel.send(`🗑️ Deleted ${counter - 1} ${counter - 1 > 1 ? "messages" : "message"}`);
            console.log(`${author.username} deleted ${counter - 1} messages inside #${channel["name"]}`);
            if (alert instanceof Array) {
                alert.forEach(msg => msg.delete(2000));
            }
            else {
                alert.delete(2000);
            }
            channel.stopTyping(true);
        }
        channel.stopTyping(true);
    })
};
exports.default = Wipe;
