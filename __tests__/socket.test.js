const io = require("socket.io-client");
const { socketIO: server } = require("../app");
const { Room, Chat } = require("../models");

describe("Suite of unit tests", function() {
  server.attach(3010);
  let socket;

  beforeEach(function(done) {
    jest.restoreAllMocks()
    // Setup
    socket = io("http://localhost:3010");

    socket.on("connect", function() {
      console.log("worked...");
      done();
    });
    socket.on("disconnect", function() {
      console.log("disconnected...");
    });
  });

  afterEach(function(done) {
    // Cleanup
    if (socket.connected) {
      console.log("disconnecting...");
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log("no connection to break...");
    }
    done();
  });

  afterAll(function(done) {
    socket.disconnect();
    server.close();
    done();
  });

  describe("Chat tests", function() {
    test("should work", (done) => {
      socket.emit("message", {
        name: "Udin",
        message: "Hello world",
        senderRole: "buyer",
        
      });

      socket.on("messageResponse", (payload) => {
        try {
          expect(payload).toHaveProperty("name");
          expect(payload).toHaveProperty("message");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("Chat tests", function() {
    test("should work", (done) => {
      socket.emit("message", {
        name: "Udin",
        message: "Hello world",
        senderRole: "seller",
        
      });

      socket.on("messageResponse", (payload) => {
        try {
          console.log(payload)
          expect(payload).toHaveProperty("name");
          expect(payload).toHaveProperty("message");
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("Chat tests", function() {
    test("should send message", (done) => {
    const data =  {
      name: "Udin",
      message: "Hello world",
      senderRole: "seller",
      sender: 2,
      id: 7,
      chat: "Hello world",
      receiver: 9,
      
    }
      jest.spyOn(Room, "findOrCreate").mockResolvedValueOnce([{
        id: 2,
        ShopId: 2,
        BuyerId: 3
      }])
      jest.spyOn(Chat, "create").mockResolvedValueOnce({
        id: 12,
        senderId: 12,
        RoomId: 12,
        chat: "Hello world",
      })

      socket.emit("message", data);
      socket.on("messageResponse", (payload) => {
        try {
          console.log(payload)
          expect(payload).toEqual(data);
          expect(Room.findOrCreate).toHaveBeenCalled()
          expect(Chat.create).toHaveBeenCalled()
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("Chat tests", function() {
    test("should work", (done) => {
      const data =  {
        name: "Udin",
        message: "Hello world",
        senderRole: "buyer",
        sender: 3,
        id: 4,
        chat: "Hello world",
        receiver: 5,
        
      }
      jest.spyOn(Room, "findOrCreate").mockResolvedValueOnce([{
        id: 4,
        ShopId: 5,
        BuyerId: 6
      }])
      jest.spyOn(Chat, "create").mockResolvedValueOnce({
        id: 6,
        senderId: 7,
        RoomId: 9,
        chat: "Hello world",
      })
      socket.emit("message", data);
      
      socket.on("messageResponse", (payload) => {
        try {
          console.log(payload)
          expect(payload).toEqual(data);
          expect(Room.findOrCreate).toHaveBeenCalled()
          expect(Chat.create).toHaveBeenCalled()
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("New rooms tests", function() {
    test("should work", (done) => {
      const data = {
        id: 4,
        ShopId: 5,
        BuyerId: 6,
        chat: "Hello world",
        receiver: 5,
        sender: 6,
        senderRole: "buyer",
        role: "buyer",
      }
      socket.emit("newRooms", data);

      jest.spyOn(Room, "findAll").mockResolvedValueOnce([{
        id: 4,
        ShopId: 5,
        BuyerId: 4
      }])
      socket.on("newRoomsResponse", (payload) => {
        try {
          console.log(payload)
          expect(Room.findAll).toHaveBeenCalled()
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe("New rooms tests", function() {
    test("should work", (done) => {
      const data = {
        id: 5,
        name: "Udin",
        senderRole: "seller",
        sender: 2,
        chat: "Hello world",
        receiver: 9,
        role: "seller",
      }
      socket.emit("newRooms", data);

      jest.spyOn(Room, "findAll").mockResolvedValueOnce([{
        id: 12,
        ShopId: 21,
        BuyerId: 5
      }])
      socket.on("newRoomsResponse", (payload) => {
        try {
          console.log(payload)
          expect(Room.findAll).toHaveBeenCalled()
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  // describe("New rooms tests", function() {
  //   test("should work", (done) => {
  //     socket.emit("newRooms", {
  //       name: "Udin",
  //       message: "Hello world",
  //       senderRole: "seller",
  //     });

  //     socket.on("newRoomsResponse", (payload) => {
  //       try {
  //         expect(payload).toHaveProperty("name");
  //         expect(payload).toHaveProperty("message");
  //         done();
  //       } catch (err) {
  //         done(err);
  //       }
  //     });
  //   });
  // });
});