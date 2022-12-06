const io = require("socket.io-client");
const { socketIO: server } = require("../app");

describe("Suite of unit tests", function() {
  server.attach(3010);
  let socket;

  beforeEach(function(done) {
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
      socket.emit("message:send", {
        name: "Udin",
        message: "Hello world",
      });

      socket.on("message:send", (payload) => {
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
});