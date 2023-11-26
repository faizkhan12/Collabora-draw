import { AiOutlineClose } from "react-icons/ai";

import { useModal } from "@/common/recoil/modal";

const NotFoundModal = ({ id }: { id: string }) => {
  const { closeModal } = useModal();
  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10 ">
      <button onClick={closeModal} className="absolute right-5 top-5">
        <AiOutlineClose />
      </button>
      {id.length === 0 ? (
        <h2 className="text-lg font-bold">Please enter your Room Id</h2>
      ) : (
        <h2 className="text-lg font-bold">
          Room with id &quot;{id}&quot; does not exist or is full!
        </h2>
      )}
      <div>OR</div>
      <h3>Try to join room later.</h3>
    </div>
  );
};

export default NotFoundModal;
