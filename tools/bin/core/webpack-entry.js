"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebpackEntry {
    set(name, value) {
        this.entry[name] = value;
    }
    get() {
        return this.entry;
    }
}
exports.WebpackEntry = WebpackEntry;
exports.webpackEntry = new WebpackEntry();
//# sourceMappingURL=webpack-entry.js.map