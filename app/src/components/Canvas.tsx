import { useEffect, useRef } from "react";
import styled from "styled-components";
import { fabric } from "fabric";

const StyledCanvasContainer = styled.div`
  width: 50vw;
`
const RawCanvas = styled.canvas`
  width: 50vw!important;
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

const SketchCanvas: React.FC<SketchCanvas> = ({ onUpdate }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef<fabric.Canvas>();

  useEffect(() => {
    // Initialize the Fabric canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
    });

    // Configure drawing brush
    fabricCanvasRef.current.freeDrawingBrush.color = "black";
    fabricCanvasRef.current.freeDrawingBrush.width = 5;

    fabricCanvasRef.current.on("mouse:up", () => {
      fabricCanvasRef.current?.renderAll();
      const dataURL =
        fabricCanvasRef.current?.toDataURL({ format: "png" }) || "";
      const blob = dataURLToBlob(dataURL);
      onUpdate(blob);
    });

    return () => {
      // Dispose of the canvas on unmount
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  return (
    <StyledCanvasContainer>
      <RawCanvas ref={canvasRef} />
    </StyledCanvasContainer>
  );
};

export default SketchCanvas;
