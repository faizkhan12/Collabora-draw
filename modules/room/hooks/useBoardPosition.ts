import { useContext } from "react";
import { RoomContext } from "../context/room.context";

const useBoardPosition = () => {
  const { x, y } = useContext(RoomContext);

  return { x, y };
};

export default useBoardPosition;
