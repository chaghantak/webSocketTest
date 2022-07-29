import http from "http";
// import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
// server
const app = express();

app.set("view engine", "pug");

app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // url -> go to home

// 3000 port makes http&ws
const httpServer = http.createServer(app); // http
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
}

function roomLength(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName).size;
}

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (room, done) => {
    socket.join(room.payload);
    done();
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("nickname", (nickname, room, done) => {
    socket["nickname"] = nickname.payload;
    socket
      .to(room)
      .emit("welcome", `${socket.nickname}님이 참가했다`, roomLength(room));
    done();
  });

  socket.on("message", (msg, room, done) => {
    socket.to(room).emit("message", `${socket.nickname}:${msg.payload}`);
    done();
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket
        .to(room)
        .emit("exit", `${socket.nickname}님이 나갔다`, roomLength(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("click", () => {
    wsServer.sockets.emit("click", publicRooms());
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
