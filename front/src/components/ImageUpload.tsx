import React, { useRef } from "react";

interface ImageUploadProps {
  model: string;
  setImage: (image: File | null) => void;
  image: File | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  model,
  setImage,
  image,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <>
      {model === "gemini-pro-vision" && (
        <input
          type="file"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />
      )}
      {image && (
        <img
          ref={imageRef}
          src={URL.createObjectURL(image)}
          alt="uploaded"
          style={{ width: "200px", height: "200px" }}
        />
      )}
    </>
  );
};

export default ImageUpload;
