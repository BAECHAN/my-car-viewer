// src/Car360Viewer.tsx
import React, { useState, useEffect, useRef } from "react";

export interface Car360ViewerProps {
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
  const prevImageIndexRef = useRef<number>(0);

  useEffect(() => {
    if (prevImageIndexRef.current !== currentImageIndex) {
      setCurrentImageIndex(prevImageIndexRef.current);
    }
  }, []);

  // 이미지 인덱스 변경 함수를 별도로 만들어서 이전 값을 저장한 후 업데이트
  const updateImageIndex = (newIndex: number) => {
    prevImageIndexRef.current = currentImageIndex; // 현재 값을 이전 값으로 저장
    setCurrentImageIndex(newIndex); // 새 값으로 업데이트
  };

  // AutoPlay 기능
  useEffect(
    function handleAutoPlay() {
      let interval: ReturnType<typeof setInterval>;
      if (isAutoPlaying) {
        interval = setInterval(() => {
          updateImageIndex((currentImageIndex + 1) % images.length);
        }, autoPlayInterval);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    },
    [isAutoPlaying, autoPlayInterval, currentImageIndex]
  );

  // 전역 마우스 이벤트 핸들러 설정
  useEffect(
    function handleGlobalMouse() {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;
        const diff = e.clientX - startXRef.current;

        if (Math.abs(diff) > 20) {
          if (diff < 0) {
            updateImageIndex(
              (currentImageIndex - 1 + images.length) % images.length
            );
          } else {
            updateImageIndex((currentImageIndex + 1) % images.length);
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
    [images.length, currentImageIndex]
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
