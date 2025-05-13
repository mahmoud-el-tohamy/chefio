import React, { useState, useEffect } from "react";
import Image from "next/image";

interface FoodImage {
  src: string;
  alt: string;
  top: number;
  left: number;
}

const foodImages: FoodImage[] = [
  { src: "/Images/food1.jpg", alt: "Food 1", top: 10, left: 20 },
  { src: "/Images/food2.jpg", alt: "Food 2", top: 20, left: 80 },
  { src: "/Images/food3.jpg", alt: "Food 3", top: 30, left: 50 },
  { src: "/Images/food4.jpg", alt: "Food 4", top: 40, left: 30 },
  { src: "/Images/food5.jpg", alt: "Food 5", top: 50, left: 70 },
  { src: "/Images/food6.jpg", alt: "Food 6", top: 60, left: 40 },
  { src: "/Images/food8.jpg", alt: "Food 8", top: 80, left: 25 },
  { src: "/Images/food7.jpg", alt: "Food 7", top: 70, left: 60 },
];

const FoodImages: React.FC = () => {
  const [imageSize, setImageSize] = useState(90);
  const [visibleImages, setVisibleImages] = useState(foodImages);

  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 640) {
        setVisibleImages(foodImages.slice(0, 6));
        setImageSize(70);
      } else if (window.innerWidth < 1024) {
        setVisibleImages(foodImages.slice(0, 7));
        setImageSize(75);
      } else {
        setVisibleImages(foodImages);
        setImageSize(90);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "350px",
        marginTop: "20px",
      }}
    >
      {visibleImages.map((img, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${img.top}%`,
            left: `${img.left}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={imageSize}
            height={imageSize}
            style={{
              borderRadius: "50%",
              border: "4px solid white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FoodImages;
