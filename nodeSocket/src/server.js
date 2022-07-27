import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";
// server
const app = express();

app.set("view engine", "pug");

app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // url -> go to home

// 3000 port makes http&ws
const httpServer = http.createServer(app); // http
const io = SocketIO(httpServer);

// const sockets = []; // fake db
// const wss = new WebSocket.Server({ server }); // webSocket
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "unKnown";
//   console.log("Connected to Browser✅");
//   socket.on("close", () => {
//     console.log("Disconnected to Browser❌");
//   });
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}:${message.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = message.payload;
//         break;
//     }
//   });
// }); // send to frontend

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
