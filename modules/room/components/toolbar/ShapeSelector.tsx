import { useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { BiRectangle } from "react-icons/bi";
import { BsCircle } from "react-icons/bs";
import { CgShapeZigzag, CgPen } from "react-icons/cg";
import { useClickAway } from "react-use";

import { useOptions } from "@/common/recoil/options";

import { EntryAnimation } from "../../animations/Entry.animations";

const ShapeSelector = () => {
  const [options, setOptions] = useOptions();

  const ref = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);

  useClickAway(ref, () => setOpened(false));

  const handleShapeChange = (shape: Shape) => {
    setOptions((prev) => ({
      ...prev,
      shape,
    }));

    setOpened(false);
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <div className="absolute left-10 rounded-md bg-gray-800 p-2 text-white opacity-0">
        Choose Shape
      </div>
      <button
        className="btn-icon text-2xl"
        disabled={options.mode === "select"}
        onClick={() => setOpened((prev) => !prev)}
      >
        {options.shape === "circle" && <BsCircle />}
        {options.shape === "rect" && <BiRectangle />}
        {options.shape === "line" && <CgPen />}
      </button>

      <AnimatePresence>
        {opened && (
          <motion.div
            className="absolute left-14 z-10 flex gap-1 rounded-lg border bg-zinc-900 p-2 md:border-0"
            variants={EntryAnimation}
            initial="from"
            animate="to"
            exit="from"
          >
            <button
              className="btn-icon text-2xl"
              onClick={() => handleShapeChange("line")}
            >
              <CgPen />
            </button>

            <button
              className="btn-icon text-2xl"
              onClick={() => handleShapeChange("rect")}
            >
              <BiRectangle />
            </button>

            <button
              className="btn-icon text-2xl"
              onClick={() => handleShapeChange("circle")}
            >
              <BsCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShapeSelector;
