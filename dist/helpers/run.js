"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = (module, props) => {
    console.log("-------------------------");
    const { message, args } = props;
    if (!module) {
        message.reply(`${args[0]} is not a command`);
    }
    else {
        console.log(`Running ${args[0]} module`.toUpperCase());
        module.execute(message, args);
    }
};
