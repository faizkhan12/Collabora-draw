import SocketMouse from "./socket-mouse";
import { useUsersIds } from "@/common/recoil/users";

const MouseRenderer = () => {
  const userIds = useUsersIds();
  return (
    <>
      {userIds.map((userId) => {
        return <SocketMouse key={userId} userId={userId} />;
      })}
    </>
  );
};

export default MouseRenderer;
