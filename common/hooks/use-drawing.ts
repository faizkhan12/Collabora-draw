import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

interface useDrawProps {
  options: CtxOptions;
  ctx?: CanvasRenderingContext2D;
}

let moves: [number, number][] = [];
export const useDraw = (
  options: CtxOptions,
  ctx?: CanvasRenderingContext2D
) => {
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
    if (!ctx) return;
    moves = [[x, y]];
    setDrawing(true);

    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // handle end of the drawing
  const handleEndDrawing = () => {
    if (!ctx) return;
    socket.emit("draw", moves, options);
    setDrawing(false);
    ctx.closePath();
  };

  // handle the drawing
  const handleDrawing = (x: number, y: number) => {
    if (ctx && drawing) {
      moves.push([x, y]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  return {
    handleStartDrawing,
    handleEndDrawing,
    handleDrawing,
    drawing,
  };
};
