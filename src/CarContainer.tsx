import React, { useEffect, useState } from "react";
import { getImageFiles } from "./utils/getImageFiles";
import Car360Viewer from "./Car360Viewer";

export interface Car {
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

const CarContainer = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car>({
    model: "k9",
    exteriorColor: "abp",
    interiorColor: "",
  });

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageUrls = await getImageFiles(selectedCar);
        setImages(imageUrls);
      } catch (error) {
        console.error("이미지 로드 실패:", error);
      }
    };

    loadImages();
  }, [selectedCar]);

  const handleColorClick = (selectedColor: string) => {
    setSelectedCar((prev) => ({
      ...prev,
      exteriorColor: selectedColor,
    }));
  };

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
              onClick={() => handleColorClick(color)}
              aria-label={`${color} 색상 선택`}
              className="w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm"
            >
              <img
                src={`${
                  import.meta.env.VITE_API_BASE_URL
                }/src/assets/${color}.${exteriorColorExtension[color]}`}
                alt={`${color} 색상`}
                className="w-full h-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarContainer;
