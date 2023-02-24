const express = require('express');
const app = express();
const generateID = () => Math.random().toString(36).substring(2, 10);
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const http = require('http').Server(app);
const cors = require('cors');
app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: '<http://localhost:4000>',
  },
});

socketIO.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);

  const users = [];
  for (let [id, socket] of socketIO.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }

  socket.emit('users', users);

  console.log(users, 'server');
  socket.on('chat message', msg => {
    console.log(msg);
  });

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
});

socketIO.use((socket, next) => {
  const username = socket.handshake.auth.username;
  console.log(socket.handshake);

  if (!username) {
    return next(new Error('invalid username'));
  }
  socket.username = username;
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
