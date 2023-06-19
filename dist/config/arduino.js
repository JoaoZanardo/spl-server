"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.port = void 0;
const serialport_1 = require("serialport");
const parser_readline_1 = require("@serialport/parser-readline");
exports.port = new serialport_1.SerialPort({ path: 'COM4', baudRate: 9600, });
exports.parser = new parser_readline_1.ReadlineParser();
exports.port.pipe(exports.parser);
