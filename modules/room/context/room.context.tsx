import { socket } from "@/common/lib/socket";
import usersAtom, { useUsersIds } from "@/common/recoil/users";
import { MotionValue, useMotionValue } from "framer-motion";
import { createContext, ReactChild, useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const RoomContext = createContext<{
  x: MotionValue<number>;
  y: MotionValue<number>;
}>(null!);

export const RoomContextProvider = ({ children }: { children: ReactChild }) => {
  const setUsers = useSetRecoilState(usersAtom);
  const usersIds = useUsersIds();

  useEffect(() => {
    socket.on("new_user", (newUser) => {
      setUsers((prevUsers) => ({
        ...prevUsers,
        [newUser]: [],
      }));
    });
    socket.on("user_disconnected", (userId) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        delete newUsers[userId];
        return newUsers;
      });
    });

    return () => {
      socket.off("new_user");
      socket.off("user_disconnected");
    };
  }, [setUsers, usersIds]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <RoomContext.Provider value={{ x, y }}> {children} </RoomContext.Provider>
  );
};
