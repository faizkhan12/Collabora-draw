import UserMouse from "./user-mouse";
import { useUsersIds } from "@/common/recoil/users";

const MouseRenderer = () => {
  const userIds = useUsersIds();
  return (
    <>
      {userIds.map((userId) => {
        return <UserMouse key={userId} userId={userId} />;
      })}
    </>
  );
};

export default MouseRenderer;
