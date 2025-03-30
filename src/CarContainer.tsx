import { useEffect, useState } from "react";
import { getImageFiles } from "./utils/getImageFiles";
import Car360Viewer from "./Car360Viewer";

export interface Car {
  model: string;
  exteriorColor: string;
  interiorColor: string;
}

const exteriorColorList = ["swp", "dfg", "p2m", "d9b", "abp"];

const exteriorColorExtension: Record<
  (typeof exteriorColorList)[number],
  { name: string; extension: string }
> = {
  swp: {
    name: "스노우 화이트 펄",
    extension: "svg",
  },
  dfg: {
    name: "페블 그레이",
    extension: "png",
  },
  abp: {
    name: "오로라 블랙 펄",
    extension: "png",
  },
  p2m: {
    name: "판테라 메탈",
    extension: "png",
  },
  d9b: {
    name: "딥 크로마 블루",
    extension: "png",
  },
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
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mt-3">
          {exteriorColorExtension[selectedCar.exteriorColor].name}
        </h2>
      </div>
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
                }/src/assets/${color}.${
                  exteriorColorExtension[color].extension
                }`}
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
