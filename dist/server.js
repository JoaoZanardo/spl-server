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
const app_1 = require("./config/app");
const socket_io_1 = require("socket.io");
const arduino_1 = require("./config/arduino");
const server = app_1.app.listen(8080, () => {
    console.log('Server running on port 8080');
});
//casa -> 192.168.0.148
const baseUrlIPV4 = 'http://192.168.0.148';
const io = new socket_io_1.Server(server, {
    cors: {
        origin: `${baseUrlIPV4}:5173`,
        methods: ["GET", "POST"]
    }
});
arduino_1.parser.on('data', data => {
    if (!String(data).startsWith('{'))
        console.log({ data });
    if (!String(data).startsWith('{'))
        return;
    io.emit('data', JSON.parse(data));
});
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('a user connected');
    socket.on('vacancyClicked', (id) => {
        socket.broadcast.emit('changeVacancyColor', id);
    });
    socket.once('qrCodeScanned', () => __awaiter(void 0, void 0, void 0, function* () {
        socket.broadcast.emit('disableQrCodeView');
        arduino_1.port.write('open', error => {
            if (error) {
                console.log({ error });
            }
            else {
                console.log('Opened sucessfully');
            }
        });
        setTimeout(() => {
            arduino_1.port.write('close', error => {
                if (error) {
                    console.log({ error });
                }
                else {
                    console.log('Closed sucessfully');
                }
            });
        }, 5000);
    }));
}));
