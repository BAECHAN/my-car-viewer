// src/Car360Viewer.tsx
import React, { useState, useEffect, useRef } from "react";

interface Car360ViewerProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const Car360Viewer: React.FC<Car360ViewerProps> = ({
  images,
  autoPlay = false,
  autoPlayInterval = 1000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const draggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);

  // AutoPlay 기능 (선택적)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, autoPlayInterval, images.length]);

  // 전역 마우스 이벤트 핸들러 설정
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const diff = e.clientX - startXRef.current;

      if (Math.abs(diff) > 20) {
        if (diff > 0) {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        } else {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }
        startXRef.current = e.clientX;
      }
    };

    const handleGlobalMouseUp = () => {
      draggingRef.current = false;
    };

    // 전역 이벤트 리스너 등록
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    // 클린업 함수
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [images.length]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
  };

  return (
    <div
      style={{
        userSelect: "none",
        width: "900px",
        height: "300px",
        position: "relative",
      }}
    >
      <img
        className="w-full h-full cursor-grab active:cursor-grabbing"
        src={images[currentIndex]}
        alt={`car-${currentIndex}`}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default Car360Viewer;
