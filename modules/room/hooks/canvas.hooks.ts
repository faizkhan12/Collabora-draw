import { useEffect, useState } from "react";
import { socket } from "@/common/lib/socket";
import { useOptions } from "@/common/recoil/options";

let moves: [number, number][] = [];
export const useDraw = (
  ctx: CanvasRenderingContext2D | undefined,
  blocked: boolean,
  movedX: number,
  movedY: number,
  handleEnd: () => void
) => {
  const options = useOptions();
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (ctx) {
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = options.lineWidth;
      ctx.strokeStyle = options.lineColor;
    }
  }, []);

  // handling start of the drawing
  const handleStartDrawing = (x: number, y: number) => {
    if (!ctx || blocked) return;
    moves = [[x + movedX, y + movedY]];
    setDrawing(true);
    ctx.beginPath();
    ctx.lineTo(x + movedX, y + movedY);
    ctx.stroke();
  };

  // handle end of the drawing
  const handleEndDrawing = () => {
    if (!ctx || blocked) return;
    socket.emit("draw", moves, options);
    setDrawing(false);
    ctx.closePath();
    handleEnd();
  };

  // handle the drawing
  const handleDrawing = (x: number, y: number) => {
    if (!ctx || !drawing || blocked) {
      return;
    }
    moves.push([x + movedX, y + movedY]);
    ctx.lineTo(x + movedX, y + movedY);
    ctx.stroke();
  };
  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDrawing,
    drawing,
  };
};
