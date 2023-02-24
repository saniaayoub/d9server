const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');

const io = socketio(server);
app.get('/', function (req, res) {
  res.write(`<h1>Hello socket</h1> ${PORT}`);
  res.end;
});
io.on('connection', client => {
  console.log(`⚡: ${client.id} user just connected!`);
  client.on('send message', (data) => {
    console.log(data);
    io.emit('receive message', data);
    // client.broadcast.to(message.recieverId).emit( 'message',`${obj}`);
  });
  client.on( 'new_notification', function(data) {
    console.log(data.message);
    io.sockets.emit( 'show_notification', { 
      message: data 
    });
  });

  client.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});


const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const app = express();
// const generateID = () => Math.random().toString(36).substring(2, 10);
// const PORT = process.env.PORT || 3000;
// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// const http = require('http').Server(app);
// const cors = require('cors');
// app.use(cors());

// const socketIO = require('socket.io')(http, {
//   cors: {
//     origin: '<http://localhost:4000>',
//   },
// });

// socketIO.on('connection', socket => {
//   console.log(`⚡: ${socket.id} user just connected!`);

//   const users = [];
//   for (let [id, socket] of socketIO.of('/').sockets) {
//     users.push({
//       userID: id,
//       username: socket.username,
//     });
//   }

//   socket.emit('users', users);

//   console.log(users, 'server');
//   socket.on('chat message', msg => {
//     console.log(msg);
//   });

//   socket.on('disconnect', () => {
//     socket.disconnect();
//     console.log('🔥: A user disconnected');
//   });
// });

// socketIO.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   console.log(socket.handshake);

//   if (!username) {
//     return next(new Error('invalid username'));
//   }
//   socket.username = username;
//   next();
// });

// app.get('/', (req, res) => {
//   res.json({
//     message: 'Hello world',
//   });
// });
// http.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });
