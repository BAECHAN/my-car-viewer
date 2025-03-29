// src/App.tsx
import React from "react";
import Car360Viewer from "./Car360Viewer";
import { getImageFiles } from "./utils/getImageFiles";

function App() {
  const images = getImageFiles();

  return (
    <div className="container px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">360도 차량 뷰어 예제</h1>
      {images.length > 0 && <Car360Viewer images={images} autoPlay={false} />}
    </div>
  );
}

export default App;
