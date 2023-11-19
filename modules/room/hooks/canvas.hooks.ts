import { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { socket } from "@/common/lib/socket";
import { useOptions } from "@/common/recoil/options";
import { drawOnUndo } from "../helpers/canvas.helpers";
import usersAtom, { useUsers } from "@/common/recoil/users";
import useBoardPosition from "./useBoardPosition";
import { getPos } from "@/common/lib/get-pos";

const savedMoves: [number, number][][] = [];
let moves: [number, number][] = [];

export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean,
  handleEnd: () => void
) => {
  const users = useUsers();
  console.log(users);
  const options = useOptions();
  const [drawing, setDrawing] = useState(false);
  const boardPosition = useBoardPosition();
  const movedX = boardPosition.x;
  const movedY = boardPosition.y;

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  }, []);

  // handle undo
  const handleUndo = useCallback(() => {
    if (ctx) {
      savedMoves.pop();
      socket.emit("undo");
      drawOnUndo(ctx, savedMoves, users);
      handleEnd();
    }
  }, [ctx, handleEnd, users]);

  useEffect(() => {
    // for undo when user press ctrl + z
    const handleUndoKey = (e: KeyboardEvent) => {
      if (e.key === "z" && e.ctrlKey) {
        handleUndo();
      }
    };
    document.addEventListener("keydown", handleUndoKey);

    return () => {
      document.removeEventListener("keydown", handleUndoKey);
    };
  }, [handleUndo]);

  // handling start of the drawing
  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;
    setDrawing(true);
    ctx.beginPath();
    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();
  };

  // handle end of the drawing
  const handleEndDrawing = () => {
    if (!ctx || blocked) return;
    setDrawing(false);
    ctx.closePath();
    savedMoves.push(moves);
    socket.emit("draw", moves, options);
    moves = [];
    handleEnd();
  };

  // handle the drawing
  const handleDrawing = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) {
      return;
    }
    ctx.lineTo(getPos(x, movedX), getPos(y, movedY));
    ctx.stroke();
    moves.push([getPos(x, movedX), getPos(y, movedY)]);
  };
  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDrawing,
    handleUndo,
    drawing,
  };
};

export const useSocketDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  handleEnd: () => void
) => {
  const setUsers = useSetRecoilState(usersAtom);

  useEffect(() => {
    socket.on("user_draw", (newMoves, options, userId) => {
      if (ctx) {
        ctx.lineWidth = options.lineWidth;
        ctx.strokeStyle = options.lineColor;
        ctx.beginPath();

        newMoves.forEach(([x, y]) => {
          ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.closePath();

        handleEnd();
        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          if (
            typeof newUsers[userId] !== "object" ||
            newUsers[userId] === null
          ) {
            console.log("New Users  is not iterable");
          } else {
            newUsers[userId] = [...newUsers[userId], newMoves];
          }
          return newUsers;
        });
      }
    });
    socket.on("user_undo", (userId) => {
      console.log(userId);

      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        newUsers[userId] = newUsers[userId]?.slice(0, -1);

        if (ctx) {
          drawOnUndo(ctx, savedMoves, newUsers);
          handleEnd();
        }

        return newUsers;
      });
    });

    return () => {
      socket.off("user_draw");
      socket.off("user_undo");
    };
  }, [ctx, handleEnd, setUsers]);
};
