import { AiOutlineClose, AiOutlineSelect } from "react-icons/ai";

import { useModal } from "@/common/recoil/modal";
import { FaEraser, FaRedo, FaUndo } from "react-icons/fa";
import { CgPen } from "react-icons/cg";
import {
  BsBorder,
  BsFillImageFill,
  BsPaintBucket,
  BsPencilFill,
} from "react-icons/bs";
import { IoIosShareAlt } from "react-icons/io";
import { HiOutlineDownload } from "react-icons/hi";
import { ImExit } from "react-icons/im";

const InstructionModal = () => {
  const { closeModal } = useModal();
  return (
    <div className="relative flex flex-col items-center rounded-md bg-white p-10">
      <button onClick={closeModal} className="absolute right-5 top-5">
        <AiOutlineClose />
      </button>

      <div>Hint</div>
      <div className=" mt-5  grid w-[100%] grid-cols-2 items-center gap-2 text-lg ">
        <FaRedo />
        Redo
        <FaUndo />
        Undo
        <CgPen />
        Select Shape
        <BsPaintBucket />
        Choose Color
        <BsBorder />
        Change Line Width
        <BsPencilFill />
        Draw
        <FaEraser />
        Eraser
        <AiOutlineSelect />
        Select and Crop
        <BsFillImageFill />
        Upload Image
        <IoIosShareAlt />
        Share
        <HiOutlineDownload />
        Download
        <ImExit />
        Exit Room
      </div>
    </div>
  );
};

export default InstructionModal;
