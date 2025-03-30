import { Vehicle } from "../App";

export const getImageFiles = async (
  selectedVehicle: Vehicle
): Promise<string[]> => {
  try {
    if (!selectedVehicle) {
      return [];
    }

    const { model, exteriorColor } = selectedVehicle;

    // 이미지 기본 경로
    const basePath = `/src/assets/images/${model}/${exteriorColor}`;

    const imageNumbers = Array.from({ length: 72 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );

    // 이미지 URL 생성
    const imageUrls = imageNumbers.map(
      (num) => `${basePath}/${exteriorColor}_${num}.png`
    );

    // 이미지가 실제로 존재하는지 확인
    const validImages = await Promise.all(
      imageUrls.map(async (url) => {
        try {
          const response = await fetch(url, { method: "HEAD" });
          return response.ok ? url : null;
        } catch {
          return null;
        }
      })
    );

    // null 값 제거하고 유효한 이미지 URL만 반환
    return validImages.filter((url): url is string => url !== null);
  } catch (error) {
    console.error("이미지 로드 중 에러:", error);
    return [];
  }
};
