// src/Car360Viewer.tsx
import React, { useState, useEffect, useRef } from "react";

interface Car360ViewerProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const Car360Viewer = ({
  images,
  autoPlay = false,
  autoPlayInterval = 1000,
}: Car360ViewerProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const draggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);

  // AutoPlay 기능
  useEffect(
    function handleAutoPlay() {
      let interval: ReturnType<typeof setInterval>;
      if (isAutoPlaying) {
        interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, autoPlayInterval);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    },
    [isAutoPlaying, autoPlayInterval, images.length]
  );

  // 전역 마우스 이벤트 핸들러 설정
  useEffect(
    function handleGlobalMouse() {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;
        const diff = e.clientX - startXRef.current;

        if (Math.abs(diff) > 20) {
          if (diff < 0) {
            setCurrentImageIndex(
              (prev) => (prev - 1 + images.length) % images.length
            );
          } else {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
          }
          startXRef.current = e.clientX;
        }
      };

      const handleGlobalMouseUp = () => {
        draggingRef.current = false;
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    },
    [images.length]
  );

  /**
   * 이미지 마우스 다운 이벤트 핸들러
   */
  const handleImageMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    setIsAutoPlaying(false); // 마우스 다운 시 자동 재생 중지
  };

  /**
   * 자동 재생 버튼 토글
   */
  const handleAutoPlayToggle = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  return (
    <div className="relative w-[900px] h-[300px] select-none">
      <img
        className="w-full h-full cursor-grab active:cursor-grabbing object-cover"
        src={images[currentImageIndex]}
        alt={`car-${currentImageIndex}`}
        onMouseDown={handleImageMouseDown}
      />
      <button
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full transition-colors"
        onClick={handleAutoPlayToggle}
        aria-label={isAutoPlaying ? "자동 재생 중지" : "자동 재생 시작"}
      >
        {isAutoPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 4h4v16H6zM14 4h4v16h-4z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3l14 9-14 9V3z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Car360Viewer;
