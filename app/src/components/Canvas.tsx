import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { fabric } from "fabric";
import { Button } from "@radix-ui/themes";
import EditIcon from "./_/edit.svg?react";
import EraserIcon from "./_/eraser.svg?react";

const StyledCanvasContainer = styled.div`
  width: 50vw;
`;
const RawCanvas = styled.canvas`
  width: 50vw !important;
  height: 100vh !important;
  flex: 1;
`;

const dataURLToBlob = (dataURL: string) => {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

type SketchCanvas = {
  onUpdate: (val: Blob) => void;
};

const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  position: absolute;
  left: 24px;
  z-index: 10;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledToolButton = styled(Button)<{ active: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${(p) => (p.active ? "#828282" : "#000")};
  cursor: pointer;
`;

const SketchCanvas: FC<SketchCanvas> = ({ onUpdate }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef<fabric.Canvas>();
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    // Initialize the Fabric canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    const minScale = Math.min(
      1024,
      Math.min(window.innerHeight, window.innerWidth / 2),
    );

    fabricCanvasRef.current?.setHeight(minScale);
    fabricCanvasRef.current?.setWidth(minScale);

    // Configure drawing brush
    fabricCanvasRef.current.freeDrawingBrush.color = "black";
    fabricCanvasRef.current.freeDrawingBrush.width = 10;

    fabricCanvasRef.current.on("mouse:up", () => {
      fabricCanvasRef.current?.renderAll();
      const dataURL =
        fabricCanvasRef.current?.toDataURL({ format: "png" }) || "";
      const blob = dataURLToBlob(dataURL);
      onUpdateRef.current(blob);
    });

    return () => {
      // Dispose of the canvas on unmount
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  const [mode, setMode] = useState<"draw" | "erase">("draw");

  return (
    <StyledCanvasContainer>
      <RawCanvas ref={canvasRef} />
      <ToolContainer>
        <StyledToolButton
          active={mode === "draw"}
          onClick={() => {
            if (fabricCanvasRef.current) {
              fabricCanvasRef.current.freeDrawingBrush.color = "black";
              fabricCanvasRef.current.freeDrawingBrush.width = 10;
            }
            setMode("draw");
          }}
        >
          <EditIcon />
        </StyledToolButton>
        <StyledToolButton
          active={mode === "erase"}
          onClick={() => {
            if (fabricCanvasRef.current) {
              fabricCanvasRef.current.freeDrawingBrush.color = "white";
              fabricCanvasRef.current.freeDrawingBrush.width = 40;
            }
            setMode("erase");
          }}
        >
          <EraserIcon />
        </StyledToolButton>
      </ToolContainer>
    </StyledCanvasContainer>
  );
};

export default SketchCanvas;
