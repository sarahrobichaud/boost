"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = (str, limit) => {
    if (str.length > limit) {
        return `${str.slice(0, limit - 3)}...`;
    }
    return str;
};
