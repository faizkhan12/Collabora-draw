import React from "react";
import { RoomContextProvider } from "../context/room.context";
import Canvas from "./canvas";
import MousePosition from "./mouse-position";
import MouseRenderer from "./mouse-renderer";
import ToolBar from "./tool-bar";

const Room = () => {
  return (
    <RoomContextProvider>
      <div className="relative h-full w-full overflow-hidden">
        <Canvas />
        <MousePosition />
        <MouseRenderer />
        <ToolBar />
      </div>
    </RoomContextProvider>
  );
};

export default Room;
