const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { Chat, Room, Buyer, Shop } = require('./models');
const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let rooms = [];
let users = { buyer: null, shop: null };

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('message', async (data) => {

    socket.emit('messageResponse', data);
   
    let rooms;
    if (data.senderRole === 'buyer') {
      users.buyer = data.sender;
      const [room, create] = await Room.findOrCreate({
        where: {
          BuyerId: data.sender,
          ShopId: data.receiver,
        },
        defaults: {
          BuyerId: data.sender,
          ShopId: data.receiver,
        },
      });
      rooms = room;
    } else {
      users.shop = data.sender;
      const [room, create] = await Room.findOrCreate({
        where: {
          BuyerId: data.receiver,
          ShopId: data.sender,
        },
        defaults: {
          BuyerId: data.receiver,
          ShopId: data.sender,
        },
      });
    
      rooms = room;
    }

    await Chat.create({
      senderId: data.sender,
      RoomId: rooms.id,
      chat: data.chat,
    });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typingResponse', data);
  });

  socket.on('newRooms', async (data) => {
    /**
     * cari room yang ada di database
     * jika ada, maka push ke array rooms
     * jika tidak ada, maka buat room baru
     * push ke array rooms
     * emit ke client
     */
    // console.log(data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    if(users.buyer !== ''){
      const result = await Room.findAll({
        where: {
          BuyerId: users.buyer,
        },
        include: [ Buyer, Shop],
      });
      rooms.push(result);
    } else {
      const result = await Room.findAll({
        where: {
          ShopId: users.shop,
        },
        include: [ Buyer, Shop],
      }); 
      rooms.push(result);
    }
    console.log(rooms, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    socket.emit('newRoomResponse', rooms);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.disconnect();
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

module.exports = http;
