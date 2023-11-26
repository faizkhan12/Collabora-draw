import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";

import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [startWhiteBoard, setStartWhiteBoard] = useState(false);

  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: any) => {
    e.preventDefault();
    if (e.target[0].value.length === 0) {
      openModal(<NotFoundModal id={roomId} />);
    }
    if (roomId) socket.emit("join_room", roomId, username);
  };

  return (
    <div className="mx-auto flex w-[90%] flex-col items-center justify-center py-24 text-center sm:w-[60%]">
      <h1 className="text-3xl font-extrabold leading-tight text-[#293745] sm:text-extra">
        Collabora.Draw
      </h1>
      <h3 className="text-xl sm:text-2xl">
        Real-time workspace for collaboration
      </h3>
      <p className="text-sm sm:text-lg">
        Experience the power of simultaneous collaboration as you draw,
        annotate, and brainstorm in real-time. Collabora breaks down the
        barriers of physical space, enabling teams, students, and creators to
        interact seamlessly.
      </p>
      <button
        style={{
          display: `${startWhiteBoard ? "none" : "block"}`,
        }}
        onClick={() => setStartWhiteBoard(true)}
        className="btn mt-10"
        type="submit"
      >
        Start a Whiteboard
      </button>

      <div
        style={{
          display: `${startWhiteBoard ? "flex" : "none"}`,
        }}
        className=" flex-col items-center"
      >
        <input
          className="input mt-10"
          id="room-id"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value.slice(0, 15))}
        />

        <div className="my-8 h-px w-96" />

        <div className="flex flex-col items-center gap-2">
          <button className="btn" onClick={handleCreateRoom}>
            Create new room
          </button>
        </div>

        <div className="my-8 flex w-96 items-center gap-2">
          <div className="h-px w-full bg-zinc-200" />
          <p className="text-zinc-400">or</p>
          <div className="h-px w-full bg-zinc-200" />
        </div>

        <form onSubmit={handleJoinRoom}>
          <label htmlFor="room-id" className=" font-bold leading-tight">
            Enter room id you want to join
          </label>
          <input
            min={1}
            className="input mt-2"
            id="room-id"
            placeholder="Room id..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className="btn mt-5" type="submit">
            Join new room
          </button>
        </form>
      </div>
      <img
        // style={{
        //   display: `${startWhiteBoard ? "none" : "block"}`,
        // }}
        className="mt-10"
        src="/landing-hero.png"
      />
    </div>
  );
};

export default Home;
