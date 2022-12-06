const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { Chat, Room, Buyer, Shop } = require("./models");
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let user = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  user.push(socket.id);
  socket.on("message", async (data) => { 
    socket.emit("messageResponse", data);
    user.forEach((el) => {
      if (el.id == data.receiver && el.role != data.role) {
        socket.to(el.socketId).emit("messageResponse", data);
      }
    });

    let rooms;
    if (data.senderRole === "buyer") {
      const [room, create] = await Room.findOrCreate({ // cuma bisa ngecek rindOrCreate nya kepanggil atau gak
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

    await Chat.create({ // sama, cuma bisa ngecek create nya kepanggil atau gak pakai toHaveBeenCalled
      senderId: data.sender,
      RoomId: rooms.id,
      chat: data.chat,
    });
  });

  socket.on("userConnect", (data) => {
    user.push(data);
  });

  socket.on("newRooms", async (data) => {
    /**
     * cari room yang ada di database
     * jika ada, maka push ke array rooms
     * jika tidak ada, maka buat room baru
     * push ke array rooms
     * emit ke client
     */
    // console.log(data, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    let rooms = [];

    if (data.role == "buyer") {
      const result = await Room.findAll({ // sama, cuma bisa ngecek findAll nya kepanggil atau gak
        where: {
          BuyerId: data.id,
        },
        include: [Buyer, Shop],
      });
      result.forEach((el) => {
        const tmp = rooms.find((x) => x.id == el.id);
        if (!tmp) {
          rooms.push(el);
        }
      });
    } else {
      const result = await Room.findAll({ // sama, cuma bisa ngecek findAll nya kepanggil atau gak
        where: {
          ShopId: data.id,
        },
        include: [Buyer, Shop],
      });
      result.forEach((el) => {
        const tmp = rooms.find((x) => x.id == el.id);
        if (!tmp) {
          rooms.push(el);
        }
        // rooms.forEach(x => {
        //   if(x.id != el.id){
        //     rooms.push(el);
        //   }
        // })
      });
    }
    console.log(rooms.length, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    socket.emit("newRoomResponse", rooms);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    socket.disconnect();
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler);

module.exports = {http, socketIO};
