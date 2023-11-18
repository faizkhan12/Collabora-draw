import { createServer } from "http";
import express from "express";
import next, { NextApiHandler } from "next";
import { Server } from "socket.io";
import {} from "@/common/types/global";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  // Socket.IO
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
  app.get("/health", async (req, res) => {
    res.send("Server Healthy");
  });

  io.on("connection", (socket) => {
    console.log("Client Connected");
    socket.join("global");
    const allUsers = io.sockets.adapter.rooms.get("global");
    if (allUsers) io.to("global").emit("users_in_room", [...allUsers]);

    socket.on("draw", (moves, options) => {
      console.log("Drawing");
      socket.broadcast.emit("user_draw", moves, options, socket.id);
    });

    socket.on("undo", () => {
      console.log("Undo");
      socket.broadcast.emit("user_undo", socket.id);
    });
    socket.on("mouse_move", (x, y) => {
      console.log("Mouse Moved");
      socket.broadcast.emit("mouse_moved", x, y, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected");
    });
  });

  app.all("*", (req: any, res: any) => nextHandler(req, res));
  server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
});
