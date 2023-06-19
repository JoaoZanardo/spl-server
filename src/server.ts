import { app } from "./config/app";
import { Server } from 'socket.io';
import { parser, port } from "./config/arduino";

const server = app.listen(8080, () => {
  console.log('Server running on port 8080');
});

//casa -> 192.168.0.148
const baseUrlIPV4 = 'http://192.168.0.148';

const io = new Server(server, {
  cors: {
    origin: `${baseUrlIPV4}:5173`,
    methods: ["GET", "POST"]
  }
});

parser.on('data', data => {
  if (!String(data).startsWith('{')) console.log({ data });
  if (!String(data).startsWith('{')) return;
  io.emit('data', JSON.parse(data));
});

io.on('connection', async (socket) => {
  console.log('a user connected');

  socket.on('vacancyClicked', (id: string) => {
    socket.broadcast.emit('changeVacancyColor', id);
  });

  socket.once('qrCodeScanned', async () => {
    socket.broadcast.emit('disableQrCodeView');
    port.write('open', error => {
        if (error) {
          console.log({ error });
        } else {
          console.log('Opened sucessfully');
        }
    });

    setTimeout(() => {
      port.write('close', error => {
        if (error) {
          console.log({ error });
        } else {
          console.log('Closed sucessfully');
        }
    });
    }, 5000)
  });
});
