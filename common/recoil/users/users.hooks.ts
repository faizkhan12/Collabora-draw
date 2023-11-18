import { useRecoilValue } from "recoil";
import { usersAtom, userIds } from "./users.atom";

export const useUsers = () => {
  const users = useRecoilValue(usersAtom);
  return users;
};

export const useUsersIds = () => {
  const users = useRecoilValue(userIds);
  return users;
};
