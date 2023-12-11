import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Canvas from "../components/Canvas";
import Preview from "../components/Preview";

const Container = styled.div`
  display: flex;
  align-items: stretch;
`;

const HomePage = () => {
  const [sketchBlob, setSketchBlob] = useState<Blob>(new Blob());
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<Blob>(new Blob());
  const convert = () => {
    const formData = new FormData();
    formData.append("sketch_file", sketchBlob);
    formData.append("prompt", prompt);

    axios
      .post(
        "https://clipdrop-api.co/sketch-to-image/v1/sketch-to-image",
        formData,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_CLIPDROP_SECRET,
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        setPreview(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Container>
        <div>
          <Canvas onUpdate={(val) => setSketchBlob(val)} />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <Preview data={preview} />
      </Container>
      <div>
        <button onClick={convert}>Convert</button>
      </div>
    </>
  );
};

export default HomePage;
