import { useDraw } from "@/common/hooks/use-drawing";
import { socket } from "@/common/lib/socket";
import Canvas from "@/modules/canvas/components/canvas";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  return <Canvas />;
}
