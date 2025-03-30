"use client";
// src/App.tsx
import { useState, useEffect } from "react";
import Car360Viewer from "./Car360Viewer";
import { getImageFiles } from "./utils/getImageFiles";

export interface Vehicle {
  model: string;
  exteriorColor: string;
  interiorColor: string;
}

const exteriorColorList = ["swp", "abp"];

const exteriorColorExtension: Record<
  (typeof exteriorColorList)[number],
  string
> = {
  abp: "png",
  swp: "svg",
};

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>({
    model: "k9",
    exteriorColor: "abp",
    interiorColor: "",
  });

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const imageUrls = await getImageFiles(selectedVehicle);
        setImages(imageUrls);
      } catch (error) {
        console.error("이미지 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [selectedVehicle]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">360도 차량 뷰어 예제</h1>
      {images.length > 0 && (
        <Car360Viewer images={images} autoPlay={true} autoPlayInterval={300} />
      )}
      <ul className="flex gap-2 bg-green-600 p-2 rounded-md mt-3">
        {exteriorColorList.map((color) => (
          <li key={color} className="w-10 h-10">
            <button
              onClick={() =>
                setSelectedVehicle({
                  model: "k9",
                  exteriorColor: color,
                  interiorColor: "",
                })
              }
            >
              <img
                src={`${
                  import.meta.env.VITE_API_BASE_URL
                }/src/assets/${color}.${exteriorColorExtension[color]}`}
                alt={color}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
