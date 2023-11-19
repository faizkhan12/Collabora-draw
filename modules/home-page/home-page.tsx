import { socket } from "@/common/lib/socket";

import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

const HomePage = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      router.push(roomIdFromServer);
    });

    socket.on("joined", (roomIdFromServer, failed) => {
      if (!failed) router.push(roomIdFromServer);
      else console.log("Failed to join room");
    });
    return () => {
      socket.off("created");
      socket.off("joined");
    };
  }, [router]);

  const handleCreateRoom = () => {
    socket.emit("create_room");
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join_room", roomId);
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-24 text-extrabold leading-tight">Collabora.Draw</h1>
      <h3 className="text-3xl">Real Time Whiteboard</h3>
      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-3xl self-start font-bold leading-tight">
          Create New Room
        </h3>
        <button
          className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
          type="submit"
          onClick={handleCreateRoom}
        >
          Create
        </button>
      </div>
      <form
        className="mt-8 flex flex-col items-center gap-2"
        onSubmit={handleJoinRoom}
      >
        <label htmlFor="room-id" className="self-start font-bold">
          Enter room id
        </label>
        <input
          type="text"
          className="rounded-xl border p-4 py-1"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          className="rounded-xl bg-black p-5 py-1 text-white transition-all hover:scale-105 active:scale-100"
          type="submit"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default HomePage;
